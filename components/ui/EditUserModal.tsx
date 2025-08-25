'use client'

import { useState, useEffect } from 'react'
import { X, Save, User, Palette, Shield, Mail, Building2 } from 'lucide-react'

interface MemberType {
  id: string
  type_key: string
  label: string
  description?: string
  is_staff: boolean
  default_role_on_claim: string
  sort_order: number
}

interface EditUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => Promise<void>
  user: any
  isArtist: boolean
  userRole: string
  memberTypes?: MemberType[]
}

export default function EditUserModal({ isOpen, onClose, onSave, user, isArtist, userRole, memberTypes = [] }: EditUserModalProps) {
  const [formData, setFormData] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && user) {
      if (isArtist) {
        setFormData({
          studio_type: user.studio_type || 'Studio',
          is_claimed: user.is_claimed || false,
          member_type_id: user.member_type_id || null,
          role: user.role || 'resident'
        })
      } else {
        setFormData({
          role: user.role || 'resident'
        })
      }
      setError('')
    }
  }, [isOpen, user, isArtist])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await onSave(formData)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to update user')
    } finally {
      setLoading(false)
    }
  }

  const canEdit = userRole === 'super_admin' || userRole === 'org_admin'

  if (!isOpen || !user || !canEdit) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            {isArtist ? (
              <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-3" />
            ) : (
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
            )}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit {isArtist ? 'Artist' : 'User'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* User Info Display */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {isArtist ? user.name : user.email}
                </span>
              </div>
              {isArtist && user.studio_number && (
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Studio {user.studio_number}
                  </span>
                </div>
              )}
            </div>

            {/* Edit Fields */}
            {isArtist ? (
              // Artist Edit Fields
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Member Type
                  </label>
                  <select
                    value={formData.member_type_id || ''}
                    onChange={(e) => setFormData({ ...formData, member_type_id: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Member Type</option>
                    {memberTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label} {type.is_staff && '(Staff)'}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Member type determines the artist's category and permissions
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role
                  </label>
                  <select
                    value={formData.role || 'resident'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="resident">Resident</option>
                    <option value="moderator">Moderator</option>
                    <option value="org_admin">Organization Admin</option>
                    {userRole === 'super_admin' && (
                      <option value="super_admin">Super Admin</option>
                    )}
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Role determines administrative permissions
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Studio Type
                  </label>
                  <select
                    value={formData.studio_type || 'Studio'}
                    onChange={(e) => setFormData({ ...formData, studio_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Studio">Studio Artist</option>
                    <option value="Associate">Associate Artist</option>
                    <option value="Gallery">Gallery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Claim Status
                  </label>
                  <select
                    value={formData.is_claimed?.toString() || 'false'}
                    onChange={(e) => setFormData({ ...formData, is_claimed: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="false">Unclaimed</option>
                    <option value="true">Claimed</option>
                  </select>
                </div>
              </div>
            ) : (
              // User Edit Fields
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <select
                  value={formData.role || 'resident'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="resident">Resident</option>
                  <option value="moderator">Moderator</option>
                  <option value="org_admin">Organization Admin</option>
                  {userRole === 'super_admin' && (
                    <option value="super_admin">Super Admin</option>
                  )}
                </select>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
