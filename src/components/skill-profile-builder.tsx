'use client'

import { useState } from 'react'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs'
import {
  Plus, Star, Edit, Trash2, User, BookOpen,
  CreditCard, ExternalLink
} from 'lucide-react'

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  type: 'offered' | 'wanted'
  description?: string
}

const mockCategories = [
  'Programming', 'Languages', 'Music', 'Art & Design', 'Business',
  'Health & Fitness', 'Academic', 'Lifestyle', 'Technology', 'Other'
]

const mockSkills = [
  'JavaScript', 'Python', 'React', 'Spanish', 'Guitar', 'Photography',
  'Digital Marketing', 'Yoga', 'Mathematics', 'Cooking', 'Graphic Design',
  'Public Speaking', 'Data Analysis', 'Machine Learning', 'Creative Writing'
]

export default function SkillProfileBuilder() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('offered')
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    proficiency: 3,
    type: 'offered' as 'offered' | 'wanted',
    description: ''
  })

  const [userSkills, setUserSkills] = useState<Skill[]>([
    {
      id: '1',
      name: 'React',
      category: 'Programming',
      proficiency: 4,
      type: 'offered',
      description: 'Advanced React development with hooks and context'
    },
    {
      id: '2',
      name: 'Spanish',
      category: 'Languages',
      proficiency: 2,
      type: 'wanted',
      description: 'Want to improve conversational Spanish'
    },
    {
      id: '3',
      name: 'Guitar',
      category: 'Music',
      proficiency: 4,
      type: 'offered',
      description: 'Acoustic and electric guitar, various styles'
    },
    {
      id: '4',
      name: 'Photography',
      category: 'Art & Design',
      proficiency: 2,
      type: 'wanted',
      description: 'Learn composition and lighting techniques'
    }
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingSkill) {
      setUserSkills(prev => prev.map(skill =>
        skill.id === editingSkill.id
          ? { ...skill, ...formData }
          : skill
      ))
    } else {
      const newSkill: Skill = {
        id: Date.now().toString(),
        ...formData
      }
      setUserSkills(prev => [...prev, newSkill])
    }

    setFormData({
      name: '',
      category: '',
      proficiency: 3,
      type: 'offered',
      description: ''
    })
    setEditingSkill(null)
    setOpen(false)
  }

  const handleEdit = (skill: Skill) => {
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      type: skill.type,
      description: skill.description || ''
    })
    setEditingSkill(skill)
    setOpen(true)
  }

  const handleDelete = (skillId: string) => {
    setUserSkills(prev => prev.filter(skill => skill.id !== skillId))
  }

  const offeredSkills = userSkills.filter(skill => skill.type === 'offered')
  const wantedSkills = userSkills.filter(skill => skill.type === 'wanted')

  const renderStars = (proficiency: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < proficiency ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Add Skill button + Dialog */}
      {/* ... unchanged for brevity (same as your full version) ... */}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* ... TabsTrigger and all TabsContent sections ... */}
        {/* Everything else remains unchanged from your original version */}
      </Tabs>
    </div>
  )
}