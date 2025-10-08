'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Crown,
  Shield,
  User,
  Mail,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'public' | 'member' | 'resident_artist' | 'staff' | 'admin';
  organization_id: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
  total_bookings: number;
  total_spent: number;
  organization?: {
    id: string;
    name: string;
  };
}

interface UserStats {
  total_users: number;
  active_users: number;
  members: number;
  resident_artists: number;
  staff: number;
  admins: number;
  new_users_this_month: number;
}

export function UserRoleManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [orgFilter, setOrgFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUserRole, setNewUserRole] = useState<string>('public');
  const [newUserActive, setNewUserActive] = useState<boolean>(true);

  useEffect(() => {
    fetchUsers();
    fetchUserStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/admin/users/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        await fetchUsers();
        await fetchUserStats();
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleStatusUpdate = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: isActive })
      });

      if (response.ok) {
        await fetchUsers();
        await fetchUserStats();
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesOrg = orgFilter === 'all' || user.organization_id === orgFilter;
    
    return matchesSearch && matchesRole && matchesOrg;
  });

  const getRoleBadge = (role: string) => {
    const variants = {
      public: 'secondary',
      member: 'default',
      resident_artist: 'outline',
      staff: 'default',
      admin: 'destructive'
    } as const;
    
    const icons = {
      public: User,
      member: User,
      resident_artist: Crown,
      staff: Shield,
      admin: Crown
    } as const;
    
    const Icon = icons[role as keyof typeof icons] || User;
    
    return (
      <Badge variant={variants[role as keyof typeof variants] || 'secondary'}>
        <Icon className="h-3 w-3 mr-1" />
        {role.replace('_', ' ').charAt(0).toUpperCase() + role.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  const getRoleIcon = (role: string) => {
    const icons = {
      public: User,
      member: User,
      resident_artist: Crown,
      staff: Shield,
      admin: Crown
    } as const;
    
    return icons[role as keyof typeof icons] || User;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.active_users || 0} active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.members || 0}</div>
            <p className="text-xs text-muted-foreground">
              Regular members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resident Artists</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.resident_artists || 0}</div>
            <p className="text-xs text-muted-foreground">
              Free access users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff & Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats?.staff || 0) + (stats?.admins || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.staff || 0} staff, {stats?.admins || 0} admins
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage user roles and permissions across organizations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="resident_artist">Resident Artist</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={orgFilter} onValueChange={setOrgFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by org" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {/* Add organization options here */}
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Spent</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {user.first_name && user.last_name 
                            ? `${user.first_name} ${user.last_name}`
                            : user.email
                          }
                        </div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {user.organization?.name || 'Unknown'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={user.is_active}
                          onCheckedChange={(checked) => handleStatusUpdate(user.id, checked)}
                        />
                        <span className="text-sm">
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {user.total_bookings} bookings
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        ${user.total_spent.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>User Details</DialogTitle>
                            <DialogDescription>
                              Manage user role and permissions
                            </DialogDescription>
                          </DialogHeader>
                          {selectedUser && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Name</label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedUser.first_name && selectedUser.last_name 
                                      ? `${selectedUser.first_name} ${selectedUser.last_name}`
                                      : 'Not provided'
                                    }
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Email</label>
                                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Current Role</label>
                                  <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Organization</label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedUser.organization?.name || 'Unknown'}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Status</label>
                                  <div className="mt-1">
                                    <Badge variant={selectedUser.is_active ? 'default' : 'secondary'}>
                                      {selectedUser.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Member Since</label>
                                  <p className="text-sm text-muted-foreground">
                                    {format(new Date(selectedUser.created_at), 'MMM dd, yyyy')}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Total Bookings</label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedUser.total_bookings} bookings
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Total Spent</label>
                                  <p className="text-sm text-muted-foreground">
                                    ${selectedUser.total_spent.toFixed(2)}
                                  </p>
                                </div>
                              </div>

                              <div className="border-t pt-4">
                                <h4 className="text-sm font-medium mb-3">Update Role</h4>
                                <div className="space-y-3">
                                  <div>
                                    <Label htmlFor="role-select">New Role</Label>
                                    <Select 
                                      value={newUserRole} 
                                      onValueChange={setNewUserRole}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="public">
                                          <div className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Public
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="member">
                                          <div className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Member
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="resident_artist">
                                          <div className="flex items-center gap-2">
                                            <Crown className="h-4 w-4" />
                                            Resident Artist
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="staff">
                                          <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4" />
                                            Staff
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="admin">
                                          <div className="flex items-center gap-2">
                                            <Crown className="h-4 w-4" />
                                            Admin
                                          </div>
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <Button 
                                    onClick={() => handleRoleUpdate(selectedUser.id, newUserRole)}
                                    disabled={newUserRole === selectedUser.role}
                                  >
                                    Update Role
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
