'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mic, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Clock, 
  Users, 
  Star,
  BookOpen,
  Target,
  CheckCircle,
  Sparkles,
  FileText,
  MessageSquare,
  Award
} from 'lucide-react';

export default function AICourseGeneratorDemo() {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [voiceInput, setVoiceInput] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  // Mock course data
  const mockCourse = {
    title: "Introduction to Python Programming",
    description: "Learn Python basics in just 3 minutes with this comprehensive micro-course",
    duration: 180,
    slides: [
      {
        title: "What is Python?",
        content: "Python is a high-level, interpreted programming language known for its simplicity and readability. Created by Guido van Rossum in 1991.",
        keyPoints: ["Easy to learn", "Versatile", "Large community", "Extensive libraries"],
        visual: "code"
      },
      {
        title: "Basic Syntax",
        content: "Python uses indentation to define code blocks. Variables are created when you assign a value to them.",
        keyPoints: ["No semicolons needed", "Indentation matters", "Dynamic typing", "Case-sensitive"],
        visual: "syntax"
      },
      {
        title: "Data Types",
        content: "Python has several built-in data types including integers, floats, strings, lists, tuples, and dictionaries.",
        keyPoints: ["int, float, str", "list, tuple, dict", "Type conversion", "Type checking"],
        visual: "types"
      },
      {
        title: "Control Flow",
        content: "Use if statements, loops, and conditional expressions to control the flow of your program.",
        keyPoints: ["if/elif/else", "for loops", "while loops", "break/continue"],
        visual: "flow"
      },
      {
        title: "Functions",
        content: "Functions are reusable blocks of code that perform specific tasks. They help organize code and avoid repetition.",
        keyPoints: ["def keyword", "Parameters", "Return values", "Lambda functions"],
        visual: "functions"
      }
    ],
    quiz: [
      {
        question: "What symbol is used for comments in Python?",
        options: ["//", "#", "/* */", "--"],
        correct: 1,
        explanation: "Python uses the # symbol for single-line comments."
      },
      {
        question: "Which of these is NOT a Python data type?",
        options: ["list", "dict", "array", "tuple"],
        correct: 2,
        explanation: "Python has lists, not arrays. Arrays are available through the NumPy library."
      }
    ],
    exercise: {
      title: "Your First Python Program",
      description: "Write a simple program that asks for a name and prints a greeting.",
      solution: "name = input('What is your name? ')\nprint(f'Hello, {name}! Welcome to Python!')"
    }
  };

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join('');
          setTranscript(transcript);
          setTopic(transcript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setVoiceInput(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && generatedCourse) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + (100 / (generatedCourse.duration / 10));
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, generatedCourse]);

  const toggleVoiceInput = () => {
    if (voiceInput) {
      recognitionRef.current?.stop();
      setVoiceInput(false);
    } else {
      recognitionRef.current?.start();
      setVoiceInput(true);
      setTranscript('');
    }
  };

  const generateCourse = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation process
    const steps = [
      "Analyzing topic...",
      "Researching content...",
      "Creating outline...",
      "Generating slides...",
      "Creating quiz questions...",
      "Adding exercises...",
      "Finalizing course..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setGeneratedCourse(mockCourse);
    setIsGenerating(false);
    setCurrentSlide(0);
    setProgress(0);
  };

  const playCourse = () => {
    setIsPlaying(true);
  };

  const pauseCourse = () => {
    setIsPlaying(false);
  };

  const nextSlide = () => {
    if (generatedCourse && currentSlide < generatedCourse.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">AI Course Generator Demo</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the power of AI-generated micro-courses. Create comprehensive 3-minute courses instantly!
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {!generatedCourse ? (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>Create Your AI Course</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    What do you want to learn about?
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Introduction to Python, Digital Photography Basics..."
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={toggleVoiceInput}
                      className={voiceInput ? "bg-red-100 text-red-700" : ""}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                  {voiceInput && (
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        Listening... {transcript}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">3-Minute Format</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Perfect for quick learning during breaks
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-4 w-4 text-green-500" />
                      <span className="font-medium">AI-Powered</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Intelligent content generation and optimization
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={generateCourse}
                  disabled={!topic.trim() || isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating Course...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate AI Course
                    </>
                  )}
                </Button>

                {isGenerating && (
                  <div className="space-y-2">
                    <Progress value={Math.random() * 100} className="w-full" />
                    <p className="text-sm text-center text-muted-foreground">
                      AI is creating your personalized course...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Course Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{generatedCourse.title}</CardTitle>
                      <p className="text-muted-foreground mt-2">{generatedCourse.description}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{generatedCourse.duration} seconds</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>2,341 learners</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span>4.8</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Course Player */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={isPlaying ? pauseCourse : playCourse}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsMuted(!isMuted)}
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Slide {currentSlide + 1} of {generatedCourse.slides.length}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={prevSlide} disabled={currentSlide === 0}>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm" onClick={nextSlide} disabled={currentSlide === generatedCourse.slides.length - 1}>
                        Next
                      </Button>
                    </div>
                  </div>

                  <Progress value={progress} className="w-full mb-6" />

                  {/* Current Slide */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-lg">
                    <h3 className="text-2xl font-bold mb-4">
                      {generatedCourse.slides[currentSlide].title}
                    </h3>
                    <p className="text-lg mb-6">
                      {generatedCourse.slides[currentSlide].content}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {generatedCourse.slides[currentSlide].keyPoints.map((point: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Content Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Course Overview</TabsTrigger>
                  <TabsTrigger value="quiz">Quiz</TabsTrigger>
                  <TabsTrigger value="exercise">Practice Exercise</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Structure</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {generatedCourse.slides.map((slide: any, index: number) => (
                          <div
                            key={index}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              index === currentSlide ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setCurrentSlide(index)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{slide.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {slide.keyPoints.length} key points
                                </p>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {Math.round((index + 1) * (generatedCourse.duration / generatedCourse.slides.length))}s
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="quiz" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Knowledge Check</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {generatedCourse.quiz.map((q: any, qIndex: number) => (
                          <div key={qIndex} className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-3">
                              {qIndex + 1}. {q.question}
                            </h4>
                            <div className="space-y-2">
                              {q.options.map((option: string, oIndex: number) => (
                                <label
                                  key={oIndex}
                                  className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-muted/50"
                                >
                                  <input
                                    type="radio"
                                    name={`question-${qIndex}`}
                                    className="text-primary"
                                  />
                                  <span>{option}</span>
                                </label>
                              ))}
                            </div>
                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <p className="text-sm text-blue-600 dark:text-blue-400">
                                <strong>Explanation:</strong> {q.explanation}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="exercise" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Hands-on Practice</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">{generatedCourse.exercise.title}</h4>
                          <p className="text-muted-foreground mb-4">
                            {generatedCourse.exercise.description}
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Your Solution:
                          </label>
                          <Textarea
                            placeholder="Write your code here..."
                            rows={6}
                            className="font-mono text-sm"
                          />
                        </div>

                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <h5 className="font-medium mb-2">Sample Solution:</h5>
                          <pre className="text-sm bg-muted p-3 rounded overflow-x-auto">
                            <code>{generatedCourse.exercise.solution}</code>
                          </pre>
                        </div>

                        <Button>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Check Solution
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Course Stats */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{generatedCourse.slides.length}</div>
                    <div className="text-sm text-muted-foreground">Slides</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{generatedCourse.quiz.length}</div>
                    <div className="text-sm text-muted-foreground">Quiz Questions</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{Math.round(generatedCourse.duration / 60)}</div>
                    <div className="text-sm text-muted-foreground">Minutes</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">95%</div>
                    <div className="text-sm text-muted-foreground">Completion Rate</div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <Button size="lg" onClick={() => setGeneratedCourse(null)}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create New Course
                </Button>
                <Button variant="outline" size="lg">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Save Course
                </Button>
                <Button variant="outline" size="lg">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}