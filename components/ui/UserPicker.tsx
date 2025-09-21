'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  User, 
  UserPlus, 
  X, 
  Users,
  Building2,
  ExternalLink,
  Check,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnnouncementPerson, createPersonFromUser, createExternalPerson } from '@/types/people';

interface UserPickerProps {
  selectedPeople: AnnouncementPerson[];
  onPeopleChange: (people: AnnouncementPerson[]) => void;
  organizationSlug: string;
  className?: string;
}

interface OrganizationMember {
  id: string;
  name: string;
  email?: string;
  profile_image?: string;
  role?: string;
  member_type?: {
    label: string;
    type_key: string;
  };
  is_claimed?: boolean;
  claimed_by_clerk_user_id?: string;
}

export function UserPicker({ 
  selectedPeople, 
  onPeopleChange, 
  organizationSlug,
  className 
}: UserPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddExternal, setShowAddExternal] = useState(false);
  const [organizationMembers, setOrganizationMembers] = useState<OrganizationMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [externalPersonForm, setExternalPersonForm] = useState({
    name: '',
    role: '',
    avatarUrl: '',
    relationshipType: 'participant' as AnnouncementPerson['relationship_type']
  });

  // Fetch organization members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/organizations/by-slug/${organizationSlug}/users`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch organization members');
        }
        
        const data = await response.json();
        
        // Combine memberships and artist profiles into a unified list
        const members: OrganizationMember[] = [];
        
        // Add memberships (staff/admin users)
        if (data.memberships) {
          data.memberships.forEach((membership: any) => {
            members.push({
              id: `member_${membership.clerk_user_id}`,
              name: `User ${membership.clerk_user_id.substring(0, 8)}...`,
              email: membership.clerk_user_id,
              role: membership.role,
              is_claimed: false
            });
          });
        }
        
        // Add artist profiles
        if (data.artist_profiles) {
          data.artist_profiles.forEach((profile: any) => {
            members.push({
              id: `artist_${profile.id}`,
              name: profile.name || 'Unnamed Artist',
              email: profile.email,
              profile_image: profile.profile_image,
              role: profile.org_member_types?.label || 'Artist',
              member_type: profile.org_member_types,
              is_claimed: profile.is_claimed,
              claimed_by_clerk_user_id: profile.claimed_by_clerk_user_id
            });
          });
        }
        
        setOrganizationMembers(members);
      } catch (err) {
        console.error('Error fetching organization members:', err);
        setError('Failed to load organization members');
      } finally {
        setIsLoading(false);
      }
    };

    if (organizationSlug) {
      fetchMembers();
    }
  }, [organizationSlug]);

  // Filter organization members based on search
  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return organizationMembers;
    
    return organizationMembers.filter(member =>
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [organizationMembers, searchTerm]);

  const addMember = (member: OrganizationMember, relationshipType: AnnouncementPerson['relationship_type'] = 'participant') => {
    const person = createPersonFromUser({
      id: member.id,
      name: member.name,
      email: member.email,
      profile_image: member.profile_image,
      role: member.role
    }, relationshipType);
    
    if (!selectedPeople.find(p => p.id === person.id)) {
      onPeopleChange([...selectedPeople, person]);
    }
    setSearchTerm('');
  };

  const addExternalPerson = () => {
    if (externalPersonForm.name.trim()) {
      const person = createExternalPerson(
        externalPersonForm.name,
        externalPersonForm.role || undefined,
        externalPersonForm.avatarUrl || undefined,
        externalPersonForm.relationshipType
      );
      onPeopleChange([...selectedPeople, person]);
      setExternalPersonForm({ name: '', role: '', avatarUrl: '', relationshipType: 'participant' });
      setShowAddExternal(false);
    }
  };

  const removePerson = (personId: string) => {
    onPeopleChange(selectedPeople.filter(p => p.id !== personId));
  };

  const updatePersonRelationship = (personId: string, relationshipType: AnnouncementPerson['relationship_type']) => {
    onPeopleChange(selectedPeople.map(p => 
      p.id === personId ? { ...p, relationship_type: relationshipType } : p
    ));
  };

  const isPersonSelected = (memberId: string) => {
    return selectedPeople.some(p => p.id === memberId);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Selected People */}
      {selectedPeople.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Selected People ({selectedPeople.length})</span>
          </div>
          
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {selectedPeople.map((person) => (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border"
              >
                {/* Avatar */}
                <div className="relative">
                  {person.avatar_url ? (
                    <img
                      src={person.avatar_url}
                      alt={person.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                      {person.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                </div>

                {/* Person Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {person.name}
                  </div>
                  {person.role && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {person.role}
                    </div>
                  )}
                </div>

                {/* Relationship Type Selector */}
                <select
                  value={person.relationship_type}
                  onChange={(e) => updatePersonRelationship(person.id, e.target.value as AnnouncementPerson['relationship_type'])}
                  className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="participant">Participant</option>
                  <option value="organizer">Organizer</option>
                  <option value="speaker">Speaker</option>
                  <option value="featured_artist">Featured Artist</option>
                  <option value="contact">Contact</option>
                  <option value="host">Host</option>
                </select>

                {/* Remove Button */}
                <button
                  onClick={() => removePerson(person.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Search Organization Members */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Add Organization Members</span>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search members by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Member Results */}
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading members...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        ) : (
          <div className="max-h-60 overflow-y-auto space-y-1">
            {filteredMembers.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">
                  {searchTerm ? 'No members found matching your search' : 'No members available'}
                </p>
              </div>
            ) : (
              filteredMembers.map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                    isPersonSelected(member.id)
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  )}
                  onClick={() => !isPersonSelected(member.id) && addMember(member)}
                >
                  {/* Avatar */}
                  <div className="relative">
                    {member.profile_image ? (
                      <img
                        src={member.profile_image}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                        {member.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                    )}
                  </div>

                  {/* Member Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {member.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {member.role} {member.member_type && `• ${member.member_type.label}`}
                    </div>
                    {member.email && (
                      <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
                        {member.email}
                      </div>
                    )}
                  </div>

                  {/* Status Indicators */}
                  <div className="flex items-center gap-2">
                    {member.is_claimed && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Claimed
                      </span>
                    )}
                    
                    {isPersonSelected(member.id) ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Plus className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add External Person */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Add External Person</span>
        </div>
        
        {!showAddExternal ? (
          <button
            onClick={() => setShowAddExternal(true)}
            className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add External Person
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={externalPersonForm.name}
                  onChange={(e) => setExternalPersonForm({ ...externalPersonForm, name: e.target.value })}
                  placeholder="Enter name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={externalPersonForm.role}
                  onChange={(e) => setExternalPersonForm({ ...externalPersonForm, role: e.target.value })}
                  placeholder="Enter role"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Avatar URL
              </label>
              <input
                type="url"
                value={externalPersonForm.avatarUrl}
                onChange={(e) => setExternalPersonForm({ ...externalPersonForm, avatarUrl: e.target.value })}
                placeholder="Enter avatar URL"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Relationship Type
              </label>
              <select
                value={externalPersonForm.relationshipType}
                onChange={(e) => setExternalPersonForm({ ...externalPersonForm, relationshipType: e.target.value as AnnouncementPerson['relationship_type'] })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="participant">Participant</option>
                <option value="organizer">Organizer</option>
                <option value="speaker">Speaker</option>
                <option value="featured_artist">Featured Artist</option>
                <option value="contact">Contact</option>
                <option value="host">Host</option>
              </select>
            </div>
            
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowAddExternal(false)}
                className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={addExternalPerson}
                disabled={!externalPersonForm.name.trim()}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add Person
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

