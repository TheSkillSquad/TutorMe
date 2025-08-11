// File: src/components/skill-matching-marketplace.tsx

'use client'

import { useState, useEffect } from 'react'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import {
  Search, Filter, Sparkles, Target, Users, Clock,
  Star, MessageSquare, Video, TrendingUp, Heart, Award
} from 'lucide-react'

interface User {
  id: string
  name: string
  avatar: string
  credits: number
  rating: number
  location: string
  skillsOffered: Skill[]
  skillsWanted: Skill[]
}

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  description?: string
}

interface Match {
  id: string
  user: User
  compatibilityScore: number
  sharedInterests: string[]
  potentialTrades: Trade[]
  matchReason: string
}

interface Trade {
  offeredSkill: string
  wantedSkill: string
  compatibility: number
}

const mockCategories = [
  'All Categories',
  'Programming',
  'Languages',
  'Music',
  'Art & Design',
  'Business',
  'Health & Fitness',
  'Academic',
  'Lifestyle',
  'Technology'
]

const mockLocations = [
  'Any Location',
  'Remote',
  'New York',
  'London',
  'Tokyo',
  'Berlin',
  'San Francisco'
]

export default function SkillMatchingMarketplace() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedLocation, setSelectedLocation] = useState('Any Location')
  const [proficiencyRange, setProficiencyRange] = useState([1, 5])
  const [maxDistance, setMaxDistance] = useState([50])
  const [activeTab, setActiveTab] = useState('matches')
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(false)

  const mockUsers: User[] = [/* ... your user data remains unchanged ... */]

  const currentUserSkills = {
    offered: ['React', 'Photography', 'English'],
    wanted: ['Spanish', 'Guitar', 'Machine Learning']
  }

  const calculateCompatibility = (user: User): number => {
    let score = 0
    const offeredSet = new Set(currentUserSkills.offered.map(s => s.toLowerCase()))
    const wantedSet = new Set(currentUserSkills.wanted.map(s => s.toLowerCase()))
    
    user.skillsOffered.forEach(skill => {
      if (wantedSet.has(skill.name.toLowerCase())) {
        score += 30
      }
    })
    
    user.skillsWanted.forEach(skill => {
      if (offeredSet.has(skill.name.toLowerCase())) {
        score += 30
      }
    })
    
    score += user.rating * 10
    
    if (user.location !== 'Remote') {
      score += 10
    }

    return Math.min(100, score)
  }

  const generateMatches = () => {
    setLoading(true)
    
    setTimeout(() => {
      const calculatedMatches = mockUsers.map(user => {
        const compatibilityScore = calculateCompatibility(user)
        const sharedInterests: string[] = []
        const potentialTrades: Trade[] = []

        user.skillsOffered.forEach(offered => {
          if (currentUserSkills.wanted.some(wanted =>
            wanted.toLowerCase() === offered.name.toLowerCase()
          )) {
            sharedInterests.push(offered.name)
            potentialTrades.push({
              offeredSkill: offered.name,
              wantedSkill: currentUserSkills.wanted.find(wanted =>
                wanted.toLowerCase() === offered.name.toLowerCase()
              ) || '',
              compatibility: offered.proficiency
            })
          }
        })

        user.skillsWanted.forEach(wanted => {
          if (currentUserSkills.offered.some(offered =>
            offered.toLowerCase() === wanted.name.toLowerCase()
          )) {
            if (!sharedInterests.includes(wanted.name)) {
              sharedInterests.push(wanted.name)
            }
            const existingTrade = potentialTrades.find(trade =>
              trade.offeredSkill === wanted.name
            )
            if (!existingTrade) {
              potentialTrades.push({
                offeredSkill: currentUserSkills.offered.find(offered =>
                  offered.toLowerCase() === wanted.name.toLowerCase()
                ) || '',
                wantedSkill: wanted.name,
                compatibility: wanted.proficiency
              })
            }
          }
        })

        let matchReason = ''
        if (compatibilityScore >= 80) {
          matchReason = 'Excellent match! Multiple complementary skills.'
        } else if (compatibilityScore >= 60) {
          matchReason = 'Great match with strong skill compatibility.'
        } else if (compatibilityScore >= 40) {
          matchReason = 'Good potential for skill exchange.'
        } else {
          matchReason = 'Some shared interests worth exploring.'
        }

        return {
          id: user.id,
          user,
          compatibilityScore,
          sharedInterests,
          potentialTrades,
          matchReason
        }
      }).filter(match => match.compatibilityScore > 20)
        .sort((a, b) => b.compatibilityScore - a.compatibilityScore)

      setMatches(calculatedMatches)
      setLoading(false)
    }, 1500)
  }

  useEffect(() => {
    generateMatches()
  }, [])

  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.user.skillsOffered.some(skill =>
        skill.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      match.user.skillsWanted.some(skill =>
        skill.name.toLowerCase().includes(searchQuery.toLowerCase())
      )

    const matchesCategory = selectedCategory === 'All Categories' ||
      match.user.skillsOffered.some(skill => skill.category === selectedCategory) ||
      match.user.skillsWanted.some(skill => skill.category === selectedCategory)

    const matchesLocation = selectedLocation === 'Any Location' ||
      match.user.location === selectedLocation

    return matchesSearch && matchesCategory && matchesLocation
  })

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-blue-600 bg-blue-100'
    if (score >= 40) return 'text-yellow-600 bg-yellow-100'
    return 'text-gray-600 bg-gray-100'
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      {/* ... rest of the return JSX unchanged ... */}
    </div>
  )
}
