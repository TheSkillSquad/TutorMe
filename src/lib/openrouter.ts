import ZAI from 'z-ai-web-dev-sdk';

interface AIRequest {
  model?: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
}

interface AIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class OpenRouterService {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
  }

  async generateSkillCourse(
    skillTopic: string,
    userLevel: string = 'beginner',
    duration: number = 3
  ): Promise<string> {
    try {
      const prompt = `Create a ${duration}-minute micro-course on "${skillTopic}" for a ${userLevel} level learner. Include:

1. Learning objectives (2-3 specific outcomes)
2. Course outline with timestamps
3. 3 practical exercises
4. 2 quiz questions with answers
5. Additional resources for deeper learning

Make it engaging and actionable.`;

      const response = await this.makeAIRequest({
        model: 'moonshotai/kimi-k2:free',
        messages: [
          {
            role: 'system',
            content: `You are TutorMe's AI course generator. Create engaging ${duration}-minute micro-courses that are practical and immediately applicable. Focus on hands-on learning with clear steps.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Skill course generation error:', error);
      throw new Error('Failed to generate skill course');
    }
  }

  async findOptimalSkillMatches(
    userProfile: any,
    availableTraders: any[]
  ): Promise<any[]> {
    try {
      const prompt = `Find the best skill trading matches for this user:
User Profile: ${JSON.stringify(userProfile)}

Available Traders: ${JSON.stringify(availableTraders)}

Return a JSON array of matches ranked by compatibility, including:
- Direct matches (1:1 trades)
- Multi-party chains (A→B→C→A)
- Skill level compatibility scores
- Scheduling compatibility
- Reasons for each match

Prioritize matches that create value for all parties.`;

      const response = await this.makeAIRequest({
        model: 'moonshotai/kimi-k2:free',
        messages: [
          {
            role: 'system',
            content: 'You are TutorMe\'s skill matching AI. Analyze user profiles and find optimal trading partners, including complex multi-party trades. Consider skill levels, time zones, availability, and trading history.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      });

      const content = response.choices[0].message.content;
      try {
        return JSON.parse(content);
      } catch (parseError) {
        // If JSON parsing fails, return a structured response
        return [
          {
            type: 'direct',
            compatibility: 0.8,
            reasons: ['AI-generated match based on skills and availability'],
            partners: availableTraders.slice(0, 2)
          }
        ];
      }
    } catch (error) {
      console.error('Skill matching error:', error);
      throw new Error('Failed to find skill matches');
    }
  }

  async generatePersonalizedLearningPath(
    userHistory: any,
    goals: string[]
  ): Promise<any> {
    try {
      const fullContext = {
        completedCourses: userHistory.courses || [],
        skillTrades: userHistory.trades || [],
        learningPreferences: userHistory.preferences || {},
        timeConstraints: userHistory.availability || {},
        careerGoals: goals
      };

      const prompt = `Generate a comprehensive personalized learning path based on this user's complete journey:
User Context: ${JSON.stringify(fullContext)}

Create a learning path that includes:
1. Recommended courses in order
2. Skill trading opportunities
3. Timeline estimates
4. Milestones and achievements
5. Alternative paths based on progress

Return a structured JSON response.`;

      const response = await this.makeAIRequest({
        model: 'moonshotai/kimi-k2:free',
        messages: [
          {
            role: 'system',
            content: 'You are TutorMe\'s learning path AI. Use the full context to create personalized learning journeys that adapt to user history, preferences, and goals.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.5
      });

      const content = response.choices[0].message.content;
      try {
        return JSON.parse(content);
      } catch (parseError) {
        // Return a basic structure if JSON parsing fails
        return {
          path: [
            {
              step: 1,
              type: 'course',
              title: 'Introduction to your chosen skill',
              duration: '3 days'
            }
          ],
          timeline: '4 weeks',
          milestones: ['Complete first course', 'Make first trade']
        };
      }
    } catch (error) {
      console.error('Learning path generation error:', error);
      throw new Error('Failed to generate learning path');
    }
  }

  async analyzeSkillProgress(
    userProgress: any,
    targetSkill: string
  ): Promise<any> {
    try {
      const prompt = `Analyze this user's progress toward mastering "${targetSkill}":
Progress Data: ${JSON.stringify(userProgress)}

Provide analysis on:
1. Current skill level assessment
2. Strengths and weaknesses
3. Recommended next steps
4. Time estimation to mastery
5. Potential roadblocks and solutions

Return a comprehensive assessment.`;

      const response = await this.makeAIRequest({
        model: 'moonshotai/kimi-k2:free',
        messages: [
          {
            role: 'system',
            content: 'You are TutorMe\'s skill analysis AI. Provide detailed assessments of user progress and actionable recommendations for improvement.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.4
      });

      return {
        analysis: response.choices[0].message.content,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Skill progress analysis error:', error);
      throw new Error('Failed to analyze skill progress');
    }
  }

  private async makeAIRequest(request: AIRequest): Promise<AIResponse> {
    // Try OpenRouter Kimi first
    if (this.apiKey) {
      try {
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://tutorme.com',
            'X-Title': 'TutorMe Skill Exchange'
          },
          body: JSON.stringify({
            model: request.model || 'moonshotai/kimi-k2:free',
            max_tokens: request.max_tokens || 1000,
            temperature: request.temperature || 0.7,
            messages: request.messages
          })
        });

        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.warn('OpenRouter API failed, falling back to ZAI:', error);
      }
    }

    // Fallback to ZAI
    try {
      const zai = await ZAI.create();
      const formattedMessages = request.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const completion = await zai.chat.completions.create({
        messages: formattedMessages,
        max_tokens: request.max_tokens || 1000,
        temperature: request.temperature || 0.7
      });

      return {
        choices: [{
          message: {
            content: completion.choices[0]?.message?.content || 'No response generated'
          }
        }]
      };
    } catch (error) {
      console.error('All AI services failed:', error);
      throw new Error('All AI services are unavailable');
    }
  }

  // Smart AI routing based on request type and complexity
  async routeAIRequest(
    requestType: string,
    complexity: 'low' | 'medium' | 'high',
    prompt: string,
    options?: any
  ): Promise<any> {
    // Route to appropriate AI service based on request type
    if (complexity === 'high' || requestType === 'skill-matching') {
      return this.makeAIRequest({
        model: 'moonshotai/kimi-k2:free',
        messages: [
          {
            role: 'system',
            content: 'You are TutorMe\'s advanced AI for complex reasoning and analysis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: options?.maxTokens || 2000,
        temperature: options?.temperature || 0.5
      });
    } else if (requestType === 'simple-chat') {
      return this.makeAIRequest({
        model: 'moonshotai/kimi-k2:free',
        messages: [
          {
            role: 'system',
            content: 'You are TutorMe\'s helpful assistant for quick questions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: options?.maxTokens || 500,
        temperature: options?.temperature || 0.7
      });
    } else {
      // Default to Kimi for most requests
      return this.makeAIRequest({
        model: 'moonshotai/kimi-k2:free',
        messages: [
          {
            role: 'system',
            content: 'You are TutorMe\'s AI assistant.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: options?.maxTokens || 1000,
        temperature: options?.temperature || 0.7
      });
    }
  }
}

export const openRouterService = new OpenRouterService();
export default OpenRouterService;