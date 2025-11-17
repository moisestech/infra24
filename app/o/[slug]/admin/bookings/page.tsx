'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Clock,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { TenantLayout } from '@/components/tenant/TenantLayout';
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation';
import { useAuth, useUser } from '@clerk/nextjs';

interface Organization {
  id: string;
  name: string;
  slug: string;
}

interface Booking {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  user_name?: string;
  user_email?: string;
  user_id?: string; // Clerk user ID
  resource_id: string;
  created_at: string;
  metadata?: any;
  resources?: {
    id: string;
    title: string;
    type: string;
    category: string;
    location: string;
  };
}

interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
}

export default function AdminBookingsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'reschedule' | 'email' | null>(null);
  const [processingBookingId, setProcessingBookingId] = useState<string | null>(null);

  // Get navigation config based on organization slug
  const getNavigationConfig = () => {
    switch (slug) {
      case 'oolite':
        return ooliteConfig;
      case 'bakehouse':
        return bakehouseConfig;
      default:
        return ooliteConfig; // Default fallback
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    if (!isSignedIn) {
      console.log('❌ User not authenticated, redirecting to sign in');
      // You could redirect to sign-in page here: window.location.href = '/sign-in';
      alert('Please sign in to access the admin panel.');
    }
  }, [isSignedIn]);

  // Fetch organization details
  const fetchOrganization = async () => {
    try {
      const response = await fetch(`/api/organizations/by-slug/${slug}/public`);
      if (response.ok) {
        const data = await response.json();
        setOrganization(data.organization);
      }
    } catch (error) {
      console.error('Error fetching organization:', error);
    }
  };

  // Fetch bookings for this organization
  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      // Log current admin user information using Clerk hooks
      console.log('👤 Current Admin User Info:', {
        userId: userId || 'Not authenticated',
        isSignedIn,
        userEmail: user?.emailAddresses?.[0]?.emailAddress || 'No email',
        userName: user?.fullName || user?.firstName || 'No name',
        organization: organization?.name || 'Unknown org'
      });
      
      const response = await fetch(`/api/organizations/${organization?.id}/bookings`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
        
        // Log user emails for debugging
        console.log('📧 Admin Bookings - User Emails:');
        data.bookings?.forEach((booking: Booking, index: number) => {
          console.log(`${index + 1}. ${booking.title}: ${booking.user_email || 'No email'} (User: ${booking.user_name || 'Unknown'})`);
        });
        
        // Calculate stats
        const bookingStats: BookingStats = {
          total: data.bookings?.length || 0,
          pending: data.bookings?.filter((b: Booking) => b.status === 'pending').length || 0,
          confirmed: data.bookings?.filter((b: Booking) => b.status === 'confirmed').length || 0,
          cancelled: data.bookings?.filter((b: Booking) => b.status === 'cancelled').length || 0,
          completed: data.bookings?.filter((b: Booking) => b.status === 'completed').length || 0,
        };
        setStats(bookingStats);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganization();
  }, [slug]);

  useEffect(() => {
    if (organization?.id) {
      fetchBookings();
    }
  }, [organization?.id]);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.user_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      confirmed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
      completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      no_show: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Enhanced booking management functions
  const handleBookingAction = (booking: Booking, action: 'approve' | 'reject' | 'reschedule' | 'email') => {
    setSelectedBooking(booking);
    setActionType(action);
    setShowBookingModal(true);
  };

  const updateBookingStatus = async (bookingId: string, status: string, notes?: string) => {
    try {
      // Set loading state for this specific booking
      setProcessingBookingId(bookingId);
      
      const response = await fetch(`/api/organizations/${organization?.id}/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          notes,
          updated_by: 'admin'
        }),
      });

      if (response.ok) {
        await fetchBookings(); // Refresh the list
        setShowBookingModal(false);
        setSelectedBooking(null);
        setActionType(null);
        
        // Refresh the calendar if it's available
        if (typeof window !== 'undefined' && (window as any).refreshCalendar) {
          console.log('🔄 Admin: Refreshing calendar after booking update');
          (window as any).refreshCalendar();
        }
      } else {
        console.error('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    } finally {
      // Clear loading state
      setProcessingBookingId(null);
    }
  };

  const sendEmailToUser = (booking: Booking, subject: string, message: string) => {
    const emailBody = encodeURIComponent(message);
    const emailSubject = encodeURIComponent(subject);
    const emailTo = booking.user_email || 'no-email@example.com';
    
    window.open(`mailto:${emailTo}?subject=${emailSubject}&body=${emailBody}`, '_blank');
  };

  if (loading) {
    return (
      <TenantLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </TenantLayout>
    );
  }

  if (!organization) {
    return (
      <TenantLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
          <div className="container mx-auto px-4 py-8">
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-500">Organization not found</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </TenantLayout>
    );
  }

  return (
    <TenantLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link href={`/o/${slug}`}>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Organization
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Booking Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage bookings for {organization.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="default">{organization.slug}</Badge>
              <Badge variant="default">{organization.name}</Badge>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                    </div>
                    <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                      <p className="text-lg sm:text-2xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                    <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Confirmed</p>
                      <p className="text-lg sm:text-2xl font-bold text-green-600">{stats.confirmed}</p>
                    </div>
                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Cancelled</p>
                      <p className="text-lg sm:text-2xl font-bold text-red-600">{stats.cancelled}</p>
                    </div>
                    <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                      <p className="text-lg sm:text-2xl font-bold text-blue-600">{stats.completed}</p>
                    </div>
                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="no_show">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bookings Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Bookings ({filteredBookings.length})
              </CardTitle>
              <CardDescription>
                Manage and view all bookings for {organization.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No bookings found</p>
                  {searchTerm || statusFilter !== 'all' ? (
                    <p className="text-sm text-gray-400 mt-2">Try adjusting your filters</p>
                  ) : null}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <Card key={booking.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {booking.title}
                              </h3>
                              {getStatusBadge(booking.status)}
                            </div>
                            
                            {booking.description && (
                              <p className="text-gray-600 dark:text-gray-400 mb-3">
                                {booking.description}
                              </p>
                            )}

                            <div className="space-y-3 text-sm">
                              <div className="flex items-start gap-2">
                                <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="text-gray-600 dark:text-gray-400">
                                  <div className="font-medium">Date & Time</div>
                                  <div className="text-xs sm:text-sm">
                                    {formatDateTime(booking.start_time)} - {formatDateTime(booking.end_time)}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-2">
                                <Users className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="text-gray-600 dark:text-gray-400">
                                  <div className="font-medium">User</div>
                                  <div className="text-xs sm:text-sm">
                                    {booking.user_name || 'Unknown User'}
                                  </div>
                                  {booking.user_email && (
                                    <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-mono bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                                      📧 {booking.user_email}
                                    </div>
                                  )}
                                  {booking.user_id && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      ID: {booking.user_id}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {booking.resources && (
                              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="text-sm">
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {booking.resources.title}
                                  </div>
                                  <div className="text-gray-600 dark:text-gray-400">
                                    {booking.resources.type} • {booking.resources.category}
                                    {booking.resources.location && ` • ${booking.resources.location}`}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Mobile-friendly action buttons */}
                          <div className="space-y-3">
                            {/* Primary actions row - always visible */}
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center justify-center gap-2 flex-1"
                                onClick={() => handleBookingAction(booking, 'email')}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="hidden sm:inline">View Details</span>
                                <span className="sm:hidden">Details</span>
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center justify-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50 flex-1"
                                onClick={() => {
                                  const subject = `Re: Your booking request - ${booking.title}`;
                                  const message = `Hi ${booking.user_name || 'there'},

Thank you for your booking request for "${booking.title}" on ${formatDateTime(booking.start_time)}.

I wanted to follow up with you about this request. 

Best regards,
Digital Lab Team`;
                                  sendEmailToUser(booking, subject, message);
                                }}
                              >
                                <span className="text-lg">📧</span>
                                <span className="hidden sm:inline">Email User</span>
                                <span className="sm:hidden">Email</span>
                              </Button>
                            </div>

                            {/* Status-specific actions */}
                            {booking.status === 'pending' && (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                                  onClick={() => handleBookingAction(booking, 'approve')}
                                  disabled={processingBookingId === booking.id}
                                >
                                  {processingBookingId === booking.id ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                      <span className="hidden sm:inline">Processing...</span>
                                      <span className="sm:hidden">...</span>
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="h-4 w-4" />
                                      <span className="hidden sm:inline">Approve</span>
                                      <span className="sm:hidden">✓ Approve</span>
                                    </>
                                  )}
                                </Button>
                                
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-orange-600 border-orange-600 hover:bg-orange-50 flex items-center justify-center gap-2"
                                  onClick={() => handleBookingAction(booking, 'reschedule')}
                                  disabled={processingBookingId === booking.id}
                                >
                                  {processingBookingId === booking.id ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                                      <span className="hidden sm:inline">Processing...</span>
                                      <span className="sm:hidden">...</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-lg">📅</span>
                                      <span className="hidden sm:inline">Reschedule</span>
                                      <span className="sm:hidden">Reschedule</span>
                                    </>
                                  )}
                                </Button>
                                
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
                                  onClick={() => handleBookingAction(booking, 'reject')}
                                  disabled={processingBookingId === booking.id}
                                >
                                  {processingBookingId === booking.id ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                      <span className="hidden sm:inline">Processing...</span>
                                      <span className="sm:hidden">...</span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="h-4 w-4" />
                                      <span className="hidden sm:inline">Reject</span>
                                      <span className="sm:hidden">✗ Reject</span>
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                            
                            {booking.status === 'confirmed' && (
                              <div className="flex flex-col sm:flex-row gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-orange-600 border-orange-600 hover:bg-orange-50 flex items-center justify-center gap-2 flex-1"
                                  onClick={() => handleBookingAction(booking, 'reschedule')}
                                  disabled={processingBookingId === booking.id}
                                >
                                  {processingBookingId === booking.id ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                                      <span className="hidden sm:inline">Processing...</span>
                                      <span className="sm:hidden">...</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-lg">📅</span>
                                      <span className="hidden sm:inline">Reschedule</span>
                                      <span className="sm:hidden">Reschedule</span>
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Booking Action Modal */}
          {showBookingModal && selectedBooking && (
            <BookingActionModal
              booking={selectedBooking}
              actionType={actionType}
              processingBookingId={processingBookingId}
              onClose={() => {
                setShowBookingModal(false);
                setSelectedBooking(null);
                setActionType(null);
              }}
              onAction={updateBookingStatus}
              onEmail={sendEmailToUser}
            />
          )}
        </div>
      </div>
    </TenantLayout>
  );
}

// Booking Action Modal Component
interface BookingActionModalProps {
  booking: Booking;
  actionType: 'approve' | 'reject' | 'reschedule' | 'email' | null;
  processingBookingId: string | null;
  onClose: () => void;
  onAction: (bookingId: string, status: string, notes?: string) => void;
  onEmail: (booking: Booking, subject: string, message: string) => void;
}

function BookingActionModal({ booking, actionType, processingBookingId, onClose, onAction, onEmail }: BookingActionModalProps) {
  const [notes, setNotes] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmit = () => {
    if (actionType === 'email') {
      onEmail(booking, emailSubject, emailMessage);
    } else if (actionType === 'approve') {
      onAction(booking.id, 'confirmed', notes);
    } else if (actionType === 'reject') {
      onAction(booking.id, 'cancelled', notes);
    } else if (actionType === 'reschedule') {
      onAction(booking.id, 'pending', `Reschedule requested: ${notes}`);
    }
  };

  const getModalTitle = () => {
    switch (actionType) {
      case 'approve': return 'Approve Booking';
      case 'reject': return 'Reject Booking';
      case 'reschedule': return 'Request Reschedule';
      case 'email': return 'Email User';
      default: return 'Booking Action';
    }
  };

  const getDefaultEmailContent = () => {
    const subject = `Re: Your booking request - ${booking.title}`;
    const message = `Hi ${booking.user_name || 'there'},

Thank you for your booking request for "${booking.title}" on ${formatDateTime(booking.start_time)}.

${actionType === 'reject' ? 
  'Unfortunately, we are unable to accommodate this booking at the requested time. ' :
  'I wanted to follow up with you about this request. '
}

${actionType === 'reschedule' ? 
  'Would it be possible to reschedule this booking to a different time? Please let me know your availability. ' :
  ''
}

Best regards,
Digital Lab Team`;

    return { subject, message };
  };

  // Set default email content when modal opens
  React.useEffect(() => {
    if (actionType === 'email' && !emailSubject) {
      const { subject, message } = getDefaultEmailContent();
      setEmailSubject(subject);
      setEmailMessage(message);
    }
  }, [actionType]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {getModalTitle()}
            </h2>
            <Button variant="outline" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          {/* Booking Details */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">{booking.title}</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div><strong>User:</strong> {booking.user_name || 'Unknown'} ({booking.user_email})</div>
              <div><strong>Date/Time:</strong> {formatDateTime(booking.start_time)} - {formatDateTime(booking.end_time)}</div>
              <div><strong>Status:</strong> {booking.status}</div>
              {booking.resources && (
                <div><strong>Resource:</strong> {booking.resources.title}</div>
              )}
            </div>
          </div>

          {/* Action Content */}
          {actionType === 'email' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <Input
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Email subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  placeholder="Your message to the user..."
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {actionType === 'approve' ? 'Approval Notes (Optional)' :
                 actionType === 'reject' ? 'Rejection Reason' :
                 'Reschedule Request Details'}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder={
                  actionType === 'approve' ? 'Add any notes about this approval...' :
                  actionType === 'reject' ? 'Please explain why this booking is being rejected...' :
                  'Explain the reschedule request and suggest alternative times...'
                }
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              onClick={handleSubmit}
              disabled={processingBookingId === booking.id}
              className={
                actionType === 'approve' ? 'bg-green-600 hover:bg-green-700 text-white flex-1' :
                actionType === 'reject' ? 'bg-red-600 hover:bg-red-700 text-white flex-1' :
                actionType === 'reschedule' ? 'bg-orange-600 hover:bg-orange-700 text-white flex-1' :
                'bg-blue-600 hover:bg-blue-700 text-white flex-1'
              }
            >
              {processingBookingId === booking.id ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  {actionType === 'approve' ? 'Approve Booking' :
                   actionType === 'reject' ? 'Reject Booking' :
                   actionType === 'reschedule' ? 'Request Reschedule' :
                   'Send Email'}
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
