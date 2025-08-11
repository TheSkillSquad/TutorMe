'use client';

import { useState } from 'react';
import { Card, CardContent } from './card';
import { Tabs, TabsContent } from './tabs';
import { Button } from './button';
import { Input } from './input';

interface LearningProfile {
  skill: string;
  experience: string;
  goal: string;
  recommendedCourses: string[];
  estimatedROI: number;
}

const courseRecommendations: Record<string, string[]> = {
  'Web Development': ['HTML & CSS Basics', 'JavaScript Mastery', 'React in Depth'],
  'Data Science': ['Python for Data Analysis', 'Machine Learning 101', 'Deep Learning'],
  'Digital Marketing': ['SEO Basics', 'Social Media Strategy', 'Ad Campaign Optimization'],
};

const skillOptions = Object.keys(courseRecommendations);

export default function ROICalculator() {
  const [selectedSkill, setSelectedSkill] = useState('');
  const [experience, setExperience] = useState('');
  const [goal, setGoal] = useState('');
  const [profile, setProfile] = useState<LearningProfile | null>(null);

  const handleCalculate = () => {
    const roi = Math.floor(Math.random() * 100) + 1;

    const recommended =
      courseRecommendations[selectedSkill as keyof typeof courseRecommendations] || [
        `Introduction to ${selectedSkill}`,
        `Advanced ${selectedSkill}`,
        `Master Class: ${selectedSkill}`,
      ];

    const newProfile: LearningProfile = {
      skill: selectedSkill,
      experience,
      goal,
      recommendedCourses: recommended,
      estimatedROI: roi,
    };

    setProfile(newProfile);
  };

  return (
    <Tabs defaultValue="calculator" className="w-full">
      <TabsContent value="calculator">
        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-xl font-semibold">Skill ROI Calculator</h2>
            <div className="space-y-2">
              <label>Skill</label>
              <Input
                list="skills"
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                placeholder="e.g. Web Development"
              />
              <datalist id="skills">
                {skillOptions.map((skill) => (
                  <option key={skill} value={skill} />
                ))}
              </datalist>
            </div>

            <div className="space-y-2">
              <label>Experience Level</label>
              <Input
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g. Beginner"
              />
            </div>

            <div className="space-y-2">
              <label>Learning Goal</label>
              <Input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Get a job in 6 months"
              />
            </div>

            <Button onClick={handleCalculate}>Calculate ROI</Button>
          </CardContent>
        </Card>
      </TabsContent>

      {profile && (
        <TabsContent value="result">
          <Card>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold">Your Personalized Learning Profile</h3>
              <p><strong>Skill:</strong> {profile.skill}</p>
              <p><strong>Experience:</strong> {profile.experience}</p>
              <p><strong>Goal:</strong> {profile.goal}</p>
              <p><strong>Estimated ROI:</strong> {profile.estimatedROI}%</p>
              <p><strong>Recommended Courses:</strong></p>
              <ul className="list-disc ml-5">
                {profile.recommendedCourses.map((course, idx) => (
                  <li key={idx}>{course}</li>
                ))}
              </ul>

              <Button
                onClick={() => {
                  const el = document.querySelector('[value="calculator"]');
                  if (el instanceof HTMLElement) el.click();
                }}
              >
                Go to Calculator
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  );
}