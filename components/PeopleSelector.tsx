'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  User, 
  UserPlus, 
  X, 
  Users,
  Building2,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnnouncementPerson, createPersonFromUser, createExternalPerson } from '@/types/people';

interface PeopleSelectorProps {
  selectedPeople: AnnouncementPerson[];
  onPeopleChange: (people: AnnouncementPerson[]) => void;
  organizationMembers?: any[];
  className?: string;
}

export function PeopleSelector({ 
  selectedPeople, 
  onPeopleChange, 
  organizationMembers = [],
  className 
}: PeopleSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddExternal, setShowAddExternal] = useState(false);
  const [externalPersonForm, setExternalPersonForm] = useState({
    name: '',
    role: '',
    avatarUrl: '',
    relationshipType: 'participant' as AnnouncementPerson['relationship_type']
  });

  // Filter organization members based on search
  const filteredMembers = organizationMembers.filter(member =>
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addMember = (member: any, relationshipType: AnnouncementPerson['relationship_type'] = 'participant') => {
    const person = createPersonFromUser(member, relationshipType);
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

  return (
    <div className={cn("space-y-4", className)}>
      {/* Selected People */}
      {selectedPeople.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Users className="w-4 h-4" />
            Selected People ({selectedPeople.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedPeople.map((person) => (
              <motion.div
                key={person.id}
                className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                {/* Avatar */}
                <div className="relative">
                  {person.avatar_url ? (
                    <img
                      src={person.avatar_url}
                      alt={person.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-3 h-3 text-gray-500" />
                    </div>
                  )}
                  {person.is_member && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </div>
                
                {/* Person Info */}
                <div className="flex flex-col">
                  <div className="text-xs font-medium text-gray-900">
                    {person.name}
                  </div>
                  {person.role && (
                    <div className="text-xs text-gray-500">
                      {person.role}
                    </div>
                  )}
                </div>

                {/* Relationship Type Selector */}
                <select
                  value={person.relationship_type}
                  onChange={(e) => updatePersonRelationship(person.id, e.target.value as AnnouncementPerson['relationship_type'])}
                  className="text-xs border border-gray-300 rounded px-1 py-0.5"
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
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Search Organization Members */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search organization members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Member Results */}
        {searchTerm && (
          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <motion.button
                  key={member.id}
                  onClick={() => addMember(member)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                >
                  <div className="relative">
                    {member.profile_image ? (
                      <img
                        src={member.profile_image}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                    )}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {member.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {member.role} • {member.email}
                    </div>
                  </div>
                </motion.button>
              ))
            ) : (
              <div className="p-3 text-sm text-gray-500 text-center">
                No members found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add External Person */}
      <div className="space-y-2">
        <button
          onClick={() => setShowAddExternal(!showAddExternal)}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add External Person
        </button>

        <AnimatePresence>
          {showAddExternal && (
            <motion.div
              className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={externalPersonForm.name}
                    onChange={(e) => setExternalPersonForm({ ...externalPersonForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    value={externalPersonForm.role}
                    onChange={(e) => setExternalPersonForm({ ...externalPersonForm, role: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Curator, Artist"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Avatar URL
                </label>
                <input
                  type="url"
                  value={externalPersonForm.avatarUrl}
                  onChange={(e) => setExternalPersonForm({ ...externalPersonForm, avatarUrl: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Relationship Type
                </label>
                <select
                  value={externalPersonForm.relationshipType}
                  onChange={(e) => setExternalPersonForm({ ...externalPersonForm, relationshipType: e.target.value as AnnouncementPerson['relationship_type'] })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="participant">Participant</option>
                  <option value="organizer">Organizer</option>
                  <option value="speaker">Speaker</option>
                  <option value="featured_artist">Featured Artist</option>
                  <option value="contact">Contact</option>
                  <option value="host">Host</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={addExternalPerson}
                  disabled={!externalPersonForm.name.trim()}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Person
                </button>
                <button
                  onClick={() => setShowAddExternal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
