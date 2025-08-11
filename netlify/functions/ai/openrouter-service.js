// OpenRouter AI service utilities for Netlify Functions
const ZAI = require('z-ai-web-dev-sdk');

class OpenRouterService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.zai = null;
  }

  async initialize() {
    if (!this.zai) {
      this.zai = await ZAI.create();
    }
    return this.zai;
  }

  async generateSkillCourse(skillTopic, userLevel = 'beginner', duration = 3, options = {}) {
    try {
      const zai = await this.initialize();

      const prompt = `
You are an expert educational content creator for an online tutoring platform called TutorMe. Create a comprehensive ${duration}-week course on "${skillTopic}" for ${userLevel} level students.

Course Requirements:
- Duration: ${duration} weeks
- Level: ${userLevel}
- Include: Weekly structure, learning objectives, practical exercises, quizzes, and projects
- Format: Structured JSON response

Please create a detailed course outline with the following structure:
{
  "title": "Course Title",
  "description": "Course description",
  "skillTopic": "${skillTopic}",
  "userLevel": "${userLevel}",
  "duration": ${duration},
  "weeks": [
    {
      "week": 1,
      "title": "Week 1 Title",
      "description": "Week description",
      "objectives": ["Objective 1", "Objective 2"],
      "topics": ["Topic 1", "Topic 2"],
      "exercises": [
        {
          "title": "Exercise 1",
          "description": "Exercise description",
          "type": "practical|quiz|project",
          "difficulty": "beginner|intermediate|advanced"
        }
      ],
      "resources": ["Resource 1", "Resource 2"]
    }
  ],
  "prerequisites": ["Prerequisite 1", "Prerequisite 2"],
  "learningOutcomes": ["Outcome 1", "Outcome 2"],
  "assessment": {
    "finalProject": "Final project description",
    "quizzes": "Quiz structure",
    "gradingCriteria": "Grading criteria"
  }
}

Make the course engaging, practical, and suitable for ${userLevel} level students. Include real-world examples and hands-on exercises.
`;

      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational content creator specializing in creating comprehensive, engaging courses for online learning platforms.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });

      const courseContent = completion.choices[0]?.message?.content;
      
      if (!courseContent) {
        throw new Error('No course content generated');
      }

      // Parse the JSON response
      try {
        const courseData = JSON.parse(courseContent);
        return {
          ...courseData,
          generatedAt: new Date().toISOString(),
          metadata: {
            skillTopic,
            userLevel,
            duration,
            includeExercises: options.includeExercises !== false,
            includeQuizzes: options.includeQuizzes !== false,
            includeProjects: options.includeProjects !== false,
          },
        };
      } catch (parseError) {
        console.error('Failed to parse course JSON:', parseError);
        // Return the raw content if JSON parsing fails
        return {
          rawContent: courseContent,
          generatedAt: new Date().toISOString(),
          metadata: {
            skillTopic,
            userLevel,
            duration,
            parseError: true,
          },
        };
      }
    } catch (error) {
      console.error('Generate skill course error:', error);
      throw new Error('Failed to generate skill course');
    }
  }

  async findTutorMatches(skills, userLevel, preferences = {}) {
    try {
      const zai = await this.initialize();

      const skillsList = Array.isArray(skills) ? skills.join(', ') : skills;
      const preferencesText = preferences ? Object.entries(preferences)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ') : 'No specific preferences';

      const prompt = `
You are a matching algorithm for an online tutoring platform called TutorMe. Find the best tutor matches for a student with the following requirements:

Student Requirements:
- Skills needed: ${skillsList}
- Level: ${userLevel}
- Preferences: ${preferencesText}

Please provide a list of ideal tutor profiles with the following structure:
{
  "matches": [
    {
      "tutorId": "tutor_1",
      "name": "Tutor Name",
      "expertise": ["Skill 1", "Skill 2"],
      "experience": "X years",
      "rating": 4.8,
      "hourlyRate": 50,
      "availability": {
        "monday": ["09:00", "17:00"],
        "tuesday": ["09:00", "17:00"]
      },
      "teachingStyle": "Interactive and practical",
      "matchScore": 95,
      "matchReasons": ["Reason 1", "Reason 2"]
    }
  ],
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ],
  "searchSummary": "Summary of search criteria and results"
}

Focus on finding tutors who:
1. Have expertise in the required skills
2. Match the student's level
3. Fit within the specified preferences
4. Have good ratings and availability
5. Offer reasonable pricing

Provide at least 3-5 matches with detailed information.
`;

      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert matching algorithm specializing in connecting students with the best tutors based on their specific needs and preferences.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.6,
        max_tokens: 3000,
      });

      const matchesContent = completion.choices[0]?.message?.content;
      
      if (!matchesContent) {
        throw new Error('No matches generated');
      }

      // Parse the JSON response
      try {
        const matchesData = JSON.parse(matchesContent);
        return {
          ...matchesData,
          generatedAt: new Date().toISOString(),
          searchCriteria: {
            skills,
            userLevel,
            preferences,
          },
        };
      } catch (parseError) {
        console.error('Failed to parse matches JSON:', parseError);
        return {
          rawContent: matchesContent,
          generatedAt: new Date().toISOString(),
          searchCriteria: {
            skills,
            userLevel,
            preferences,
          },
          parseError: true,
        };
      }
    } catch (error) {
      console.error('Find tutor matches error:', error);
      throw new Error('Failed to find tutor matches');
    }
  }

  async generateExercise(skillTopic, difficulty = 'intermediate', type = 'practical') {
    try {
      const zai = await this.initialize();

      const prompt = `
You are an expert educational content creator for TutorMe. Create a ${type} exercise for ${skillTopic} at ${difficulty} level.

Exercise Requirements:
- Skill: ${skillTopic}
- Difficulty: ${difficulty}
- Type: ${type}
- Include: Clear instructions, expected outcomes, and evaluation criteria

Please create an exercise with the following structure:
{
  "title": "Exercise Title",
  "description": "Exercise description",
  "skillTopic": "${skillTopic}",
  "difficulty": "${difficulty}",
  "type": "${type}",
  "instructions": [
    "Step 1: Do this",
    "Step 2: Do that"
  ],
  "objectives": ["Objective 1", "Objective 2"],
  "expectedOutcome": "What the student should achieve",
  "timeEstimate": "30 minutes",
  "evaluationCriteria": [
    "Criterion 1: Description",
    "Criterion 2: Description"
  ],
  "hints": [
    "Hint 1",
    "Hint 2"
  ],
  "solution": "Solution approach or answer key"
}

Make the exercise challenging but achievable, with clear learning objectives.
`;

      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational content creator specializing in creating engaging and effective learning exercises.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const exerciseContent = completion.choices[0]?.message?.content;
      
      if (!exerciseContent) {
        throw new Error('No exercise generated');
      }

      // Parse the JSON response
      try {
        const exerciseData = JSON.parse(exerciseContent);
        return {
          ...exerciseData,
          generatedAt: new Date().toISOString(),
        };
      } catch (parseError) {
        console.error('Failed to parse exercise JSON:', parseError);
        return {
          rawContent: exerciseContent,
          generatedAt: new Date().toISOString(),
          parseError: true,
        };
      }
    } catch (error) {
      console.error('Generate exercise error:', error);
      throw new Error('Failed to generate exercise');
    }
  }

  async generateQuiz(skillTopic, questionCount = 5, difficulty = 'intermediate') {
    try {
      const zai = await this.initialize();

      const prompt = `
You are an expert educational content creator for TutorMe. Create a ${questionCount}-question quiz for ${skillTopic} at ${difficulty} level.

Quiz Requirements:
- Skill: ${skillTopic}
- Questions: ${questionCount}
- Difficulty: ${difficulty}
- Include: Multiple choice questions with one correct answer each

Please create a quiz with the following structure:
{
  "title": "Quiz Title",
  "description": "Quiz description",
  "skillTopic": "${skillTopic}",
  "difficulty": "${difficulty}",
  "timeLimit": "15 minutes",
  "questions": [
    {
      "id": 1,
      "question": "Question text",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctAnswer": "Option A",
      "explanation": "Explanation of the correct answer"
    }
  ],
  "passingScore": 70,
  "instructions": "Quiz instructions"
}

Make the questions challenging but fair, testing understanding of key concepts.
`;

      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational content creator specializing in creating effective assessment quizzes.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.6,
        max_tokens: 3000,
      });

      const quizContent = completion.choices[0]?.message?.content;
      
      if (!quizContent) {
        throw new Error('No quiz generated');
      }

      // Parse the JSON response
      try {
        const quizData = JSON.parse(quizContent);
        return {
          ...quizData,
          generatedAt: new Date().toISOString(),
        };
      } catch (parseError) {
        console.error('Failed to parse quiz JSON:', parseError);
        return {
          rawContent: quizContent,
          generatedAt: new Date().toISOString(),
          parseError: true,
        };
      }
    } catch (error) {
      console.error('Generate quiz error:', error);
      throw new Error('Failed to generate quiz');
    }
  }

  // Utility functions
  validateSkillTopic(topic) {
    return typeof topic === 'string' && topic.length >= 2 && topic.length <= 100;
  }

  validateUserLevel(level) {
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    return validLevels.includes(level);
  }

  validateDuration(duration) {
    const numDuration = parseInt(duration);
    return !isNaN(numDuration) && numDuration >= 1 && numDuration <= 52;
  }

  sanitizeInput(input) {
    if (typeof input === 'string') {
      return input.replace(/[<>]/g, '').trim();
    }
    return input;
  }

  // Error handling
  handleApiError(error) {
    console.error('OpenRouter API error:', error);
    
    if (error.response) {
      // API response error
      return {
        error: 'API Error',
        message: error.response.data?.error?.message || 'Unknown API error',
        status: error.response.status,
      };
    } else if (error.request) {
      // Network error
      return {
        error: 'Network Error',
        message: 'Failed to connect to OpenRouter API',
        status: 503,
      };
    } else {
      // Other error
      return {
        error: 'Unknown Error',
        message: error.message || 'Unknown error occurred',
        status: 500,
      };
    }
  }
}

module.exports = OpenRouterService;