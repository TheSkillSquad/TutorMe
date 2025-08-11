'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, BookOpen, Clock, Target } from 'lucide-react';

interface AICourseGeneratorProps {
  onCourseGenerated: (course: any) => void;
  userToken?: string;
}

export default function AICourseGenerator({ onCourseGenerated, userToken }: AICourseGeneratorProps) {
  const [skillTopic, setSkillTopic] = useState('');
  const [userLevel, setUserLevel] = useState('beginner');
  const [duration, setDuration] = useState('3');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState<any>(null);
  const [error, setError] = useState('');

  const handleGenerateCourse = async () => {
    if (!skillTopic.trim()) {
      setError('Please enter a skill topic');
      return;
    }

    if (!userToken) {
      setError('Please sign in to generate courses');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/ai/generate-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          skillTopic: skillTopic.trim(),
          userLevel,
          duration: parseInt(duration)
        })
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedCourse(data.course);
        onCourseGenerated(data.course);
      } else {
        setError(data.error || 'Failed to generate course');
      }
    } catch (error) {
      console.error('Course generation error:', error);
      setError('Failed to generate course. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatCourseContent = (content: string) => {
    // Simple formatting for the course content
    return content.split('\n').map((line, index) => {
      if (line.startsWith('##')) {
        return (
          <h3 key={index} className="text-lg font-semibold mt-4 mb-2">
            {line.replace('##', '').trim()}
          </h3>
        );
      } else if (line.startsWith('###')) {
        return (
          <h4 key={index} className="text-md font-medium mt-3 mb-1">
            {line.replace('###', '').trim()}
          </h4>
        );
      } else if (line.startsWith('-') || line.startsWith('*')) {
        return (
          <li key={index} className="ml-4 mt-1">
            {line.replace(/^[-*]\s/, '')}
          </li>
        );
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else {
        return (
          <p key={index} className="mt-2">
            {line}
          </p>
        );
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <span>AI Course Generator</span>
        </CardTitle>
        <CardDescription>
          Generate a personalized micro-course on any skill in seconds
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="skill-topic">Skill Topic</Label>
            <Input
              id="skill-topic"
              placeholder="e.g., Python Programming, Digital Marketing"
              value={skillTopic}
              onChange={(e) => setSkillTopic(e.target.value)}
              disabled={isGenerating}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="user-level">Your Level</Label>
            <Select value={userLevel} onValueChange={setUserLevel} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select value={duration} onValueChange={setDuration} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 minute</SelectItem>
                <SelectItem value="3">3 minutes</SelectItem>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="10">10 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <Button 
          onClick={handleGenerateCourse} 
          disabled={isGenerating || !skillTopic.trim() || !userToken}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Course...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate AI Course
            </>
          )}
        </Button>

        {generatedCourse && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Generated Course</span>
                <Badge variant="secondary" className="ml-auto">
                  <Clock className="h-3 w-3 mr-1" />
                  {duration} min
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                {formatCourseContent(generatedCourse)}
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  <span>Level: {userLevel}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Save course to user profile
                    console.log('Saving course...');
                  }}
                >
                  Save Course
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}