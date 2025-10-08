'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { 
  DollarSign, 
  Settings, 
  Plus,
  Edit,
  Save,
  X,
  Percent,
  Users,
  Crown,
  Shield,
  User,
  Building
} from 'lucide-react';

interface PricingTier {
  role: 'public' | 'member' | 'resident_artist' | 'staff';
  discount: number; // 0-1, where 1 = 100% discount (free)
  description: string;
}

interface Organization {
  id: string;
  name: string;
  pricing_tiers: PricingTier[];
  is_active: boolean;
}

interface PricingStats {
  total_organizations: number;
  active_organizations: number;
  average_discount: number;
  free_users: number;
  paid_users: number;
}

export function PricingConfiguration() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [stats, setStats] = useState<PricingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [editingTiers, setEditingTiers] = useState<PricingTier[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchOrganizations();
    fetchPricingStats();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/api/admin/organizations');
      if (response.ok) {
        const data = await response.json();
        setOrganizations(data.organizations || []);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPricingStats = async () => {
    try {
      const response = await fetch('/api/admin/pricing/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching pricing stats:', error);
    }
  };

  const handleEditPricing = (org: Organization) => {
    setSelectedOrg(org);
    setEditingTiers([...org.pricing_tiers]);
    setIsEditing(true);
  };

  const handleSavePricing = async () => {
    if (!selectedOrg) return;

    try {
      const response = await fetch(`/api/admin/organizations/${selectedOrg.id}/pricing`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pricing_tiers: editingTiers })
      });

      if (response.ok) {
        await fetchOrganizations();
        await fetchPricingStats();
        setIsEditing(false);
        setSelectedOrg(null);
      }
    } catch (error) {
      console.error('Error saving pricing:', error);
    }
  };

  const handleTierChange = (role: string, field: 'discount' | 'description', value: string | number) => {
    setEditingTiers(prev => prev.map(tier => 
      tier.role === role ? { ...tier, [field]: value } : tier
    ));
  };

  const getRoleIcon = (role: string) => {
    const icons = {
      public: User,
      member: User,
      resident_artist: Crown,
      staff: Shield
    } as const;
    
    return icons[role as keyof typeof icons] || User;
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      public: 'secondary',
      member: 'default',
      resident_artist: 'outline',
      staff: 'default'
    } as const;
    
    const Icon = getRoleIcon(role);
    
    return (
      <Badge variant={variants[role as keyof typeof variants] || 'secondary'}>
        <Icon className="h-3 w-3 mr-1" />
        {role.replace('_', ' ').charAt(0).toUpperCase() + role.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  const formatDiscount = (discount: number) => {
    if (discount === 1) return 'Free';
    if (discount === 0) return 'Full Price';
    return `${(discount * 100).toFixed(0)}% Off`;
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
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_organizations || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.active_organizations || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Discount</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((stats?.average_discount || 0) * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across all organizations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Free Users</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.free_users || 0}</div>
            <p className="text-xs text-muted-foreground">
              Resident artists & staff
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Users</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.paid_users || 0}</div>
            <p className="text-xs text-muted-foreground">
              Public & members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Organizations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Configuration</CardTitle>
          <CardDescription>
            Configure role-based pricing for each organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Public</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Resident Artist</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell>
                      <div className="font-medium">{org.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={org.is_active ? 'default' : 'secondary'}>
                        {org.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    {org.pricing_tiers.map((tier) => (
                      <TableCell key={tier.role}>
                        <div className="text-sm">
                          {formatDiscount(tier.discount)}
                        </div>
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPricing(org)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Pricing Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Pricing Tiers</DialogTitle>
            <DialogDescription>
              Configure role-based pricing for {selectedOrg?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrg && (
            <div className="space-y-6">
              <div className="space-y-4">
                {editingTiers.map((tier) => (
                  <div key={tier.role} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      {getRoleBadge(tier.role)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`${tier.role}-discount`}>Discount</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id={`${tier.role}-discount`}
                            type="number"
                            min="0"
                            max="1"
                            step="0.01"
                            value={tier.discount}
                            onChange={(e) => handleTierChange(tier.role, 'discount', parseFloat(e.target.value))}
                            className="flex-1"
                          />
                          <span className="text-sm text-muted-foreground">
                            {tier.discount === 1 ? 'Free' : tier.discount === 0 ? 'Full Price' : `${(tier.discount * 100).toFixed(0)}% Off`}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor={`${tier.role}-description`}>Description</Label>
                        <Input
                          id={`${tier.role}-description`}
                          value={tier.description}
                          onChange={(e) => handleTierChange(tier.role, 'description', e.target.value)}
                          placeholder="Role description"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSavePricing}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
