import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface PublishCourseRequest {
  courseId: string;
  courseData: {
    title: string;
    description: string;
    content: string;
    slides: any[];
    script: string;
    duration: number;
    difficulty: number;
    category: string;
    tags: string[];
    keyLearningObjectives: string[];
  };
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body: PublishCourseRequest = await request.json();
    const { courseId, courseData } = body;

    if (!courseId || !courseData) {
      return NextResponse.json(
        { error: 'Course ID and course data are required' },
        { status: 400 }
      );
    }

    // Verify the course belongs to the current user
    const existingCourse = await db.course.findFirst({
      where: {
        id: courseId,
        creatorId: session.user.id,
        isPublished: false // Only allow publishing unpublished courses
      }
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found or you do not have permission to publish it' },
        { status: 404 }
      );
    }

    // Find or create the skill for this course
    let skill = await db.skill.findFirst({
      where: {
        name: {
          equals: courseData.category,
        }
      }
    });

    if (!skill) {
      // Create a new skill if it doesn't exist
      skill = await db.skill.create({
        data: {
          name: courseData.category,
          description: `Skills related to ${courseData.category}`,
          categoryId: 'default', // You might want to handle categories differently
          difficulty: courseData.difficulty,
          isVerified: false
        }
      });
    }

    // Update the course with published data
    const publishedCourse = await db.course.update({
      where: { id: courseId },
      data: {
        title: courseData.title,
        description: courseData.description,
        content: courseData.content,
        slides: JSON.stringify(courseData.slides),
        script: courseData.script,
        duration: courseData.duration,
        difficulty: courseData.difficulty,
        language: 'en',
        isPublished: true,
        skillId: skill.id,
        updatedAt: new Date()
      },
      include: {
        skill: {
          select: { name: true }
        },
        creator: {
          select: { name: true, username: true, avatar: true }
        }
      }
    });

    // Award achievement for course creation
    try {
      const courseCreatorAchievement = await db.achievement.findFirst({
        where: { name: 'Course Creator' }
      });

      if (courseCreatorAchievement) {
        await db.userAchievement.upsert({
          where: {
            userId_achievementId: {
              userId: session.user.id,
              achievementId: courseCreatorAchievement.id
            }
          },
          update: {},
          create: {
            userId: session.user.id,
            achievementId: courseCreatorAchievement.id,
            unlockedAt: new Date()
          }
        });
      }
    } catch (achievementError) {
      console.error('Error awarding achievement:', achievementError);
      // Don't fail the whole operation if achievement awarding fails
    }

    return NextResponse.json({
      success: true,
      course: publishedCourse,
      message: 'Course published successfully!'
    });

  } catch (error) {
    console.error('Course publishing error:', error);
    return NextResponse.json(
      { error: 'Failed to publish course' },
      { status: 500 }
    );
  }
}