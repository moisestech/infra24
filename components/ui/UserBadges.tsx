'use client'

import { Badge } from '@/components/ui/Badge'
import { Shield, User, Palette, Building2, Users } from 'lucide-react'

interface MemberType {
  id: string
  type_key: string
  label: string
  description?: string
  is_staff: boolean
  default_role_on_claim: string
  sort_order: number
}

interface UserBadgesProps {
  memberType?: MemberType | null
  role?: string
  className?: string
}

export default function UserBadges({ memberType, role, className = '' }: UserBadgesProps) {
  const getMemberTypeColor = (typeKey: string) => {
    switch (typeKey) {
      case 'studio_artist':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'associate':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'gallery':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'staff':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'org_admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'moderator':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'staff':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'resident':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getMemberTypeIcon = (typeKey: string) => {
    switch (typeKey) {
      case 'studio_artist':
        return <Palette className="h-3 w-3" />
      case 'associate':
        return <User className="h-3 w-3" />
      case 'gallery':
        return <Building2 className="h-3 w-3" />
      case 'staff':
        return <Users className="h-3 w-3" />
      default:
        return <User className="h-3 w-3" />
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
      case 'org_admin':
      case 'moderator':
      case 'staff':
        return <Shield className="h-3 w-3" />
      default:
        return <User className="h-3 w-3" />
    }
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {/* Member Type Badge */}
      {memberType && (
        <Badge 
          className={`${getMemberTypeColor(memberType.type_key)} flex items-center gap-1`}
        >
          {getMemberTypeIcon(memberType.type_key)}
          <span className="text-xs font-medium">{memberType.label}</span>
        </Badge>
      )}

      {/* Role Badge */}
      {role && role !== 'resident' && (
        <Badge 
          className={`${getRoleColor(role)} flex items-center gap-1`}
        >
          {getRoleIcon(role)}
          <span className="text-xs font-medium">{role.replace('_', ' ')}</span>
        </Badge>
      )}
    </div>
  )
}
