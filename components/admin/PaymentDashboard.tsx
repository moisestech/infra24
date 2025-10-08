'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

interface Payment {
  id: string;
  booking_id: string;
  payment_intent_id: string;
  amount_total: number;
  currency: string;
  payment_status: 'pending' | 'succeeded' | 'failed' | 'canceled' | 'refunded';
  receipt_url?: string;
  refund_id?: string;
  refund_reason?: string;
  created_at: string;
  updated_at: string;
  booking?: {
    id: string;
    title: string;
    user_id: string;
    start_time: string;
  };
}

interface PaymentStats {
  total_revenue: number;
  successful_payments: number;
  failed_payments: number;
  pending_payments: number;
  refunded_amount: number;
  average_payment: number;
  monthly_revenue: number;
  daily_revenue: number;
}

export function PaymentDashboard() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');

  useEffect(() => {
    fetchPayments();
    fetchPaymentStats();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/admin/payments');
      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentStats = async () => {
    try {
      const response = await fetch('/api/admin/payments/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching payment stats:', error);
    }
  };

  const handleRefund = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: refundAmount ? parseFloat(refundAmount) : undefined,
          reason: refundReason || 'Requested by admin'
        })
      });

      if (response.ok) {
        await fetchPayments();
        await fetchPaymentStats();
        setRefundAmount('');
        setRefundReason('');
        setSelectedPayment(null);
      }
    } catch (error) {
      console.error('Error processing refund:', error);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.booking?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.payment_intent_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.payment_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getPaymentStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      succeeded: 'default',
      failed: 'destructive',
      canceled: 'destructive',
      refunded: 'outline'
    } as const;
    
    const icons = {
      pending: Clock,
      succeeded: CheckCircle,
      failed: XCircle,
      canceled: XCircle,
      refunded: RefreshCw
    } as const;
    
    const Icon = icons[status as keyof typeof icons] || Clock;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
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
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.total_revenue?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Payments</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.successful_payments || 0}</div>
            <p className="text-xs text-muted-foreground">
              {((stats?.successful_payments || 0) / ((stats?.successful_payments || 0) + (stats?.failed_payments || 0)) * 100).toFixed(1)}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.failed_payments || 0}</div>
            <p className="text-xs text-muted-foreground">
              {((stats?.failed_payments || 0) / ((stats?.successful_payments || 0) + (stats?.failed_payments || 0)) * 100).toFixed(1)}% failure rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refunded Amount</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.refunded_amount?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 inline mr-1" />
              {((stats?.refunded_amount || 0) / (stats?.total_revenue || 1) * 100).toFixed(1)}% of total revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
          <CardDescription>
            Monitor and manage all payment transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="succeeded">Succeeded</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payments Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Booking</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="font-mono text-sm">
                        {payment.payment_intent_id.slice(-8)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.booking?.title || 'Unknown'}</div>
                        <div className="text-sm text-muted-foreground">
                          {payment.booking?.start_time && format(new Date(payment.booking.start_time), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        ${payment.amount_total.toFixed(2)} {payment.currency.toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell>{getPaymentStatusBadge(payment.payment_status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(payment.created_at), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(payment.created_at), 'h:mm a')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Payment Details</DialogTitle>
                            <DialogDescription>
                              View payment information and process refunds
                            </DialogDescription>
                          </DialogHeader>
                          {selectedPayment && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Payment Intent ID</label>
                                  <p className="text-sm text-muted-foreground font-mono">
                                    {selectedPayment.payment_intent_id}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Amount</label>
                                  <p className="text-sm text-muted-foreground">
                                    ${selectedPayment.amount_total.toFixed(2)} {selectedPayment.currency.toUpperCase()}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Status</label>
                                  <div className="mt-1">{getPaymentStatusBadge(selectedPayment.payment_status)}</div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Date</label>
                                  <p className="text-sm text-muted-foreground">
                                    {format(new Date(selectedPayment.created_at), 'MMM dd, yyyy h:mm a')}
                                  </p>
                                </div>
                                {selectedPayment.receipt_url && (
                                  <div className="col-span-2">
                                    <label className="text-sm font-medium">Receipt</label>
                                    <div className="mt-1">
                                      <Button variant="outline" size="sm" asChild>
                                        <a href={selectedPayment.receipt_url} target="_blank" rel="noopener noreferrer">
                                          <Eye className="h-4 w-4 mr-2" />
                                          View Receipt
                                        </a>
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {selectedPayment.payment_status === 'succeeded' && !selectedPayment.refund_id && (
                                <div className="border-t pt-4">
                                  <h4 className="text-sm font-medium mb-3">Process Refund</h4>
                                  <div className="space-y-3">
                                    <div>
                                      <Label htmlFor="refund-amount">Refund Amount (optional)</Label>
                                      <Input
                                        id="refund-amount"
                                        type="number"
                                        step="0.01"
                                        placeholder={`${selectedPayment.amount_total}`}
                                        value={refundAmount}
                                        onChange={(e) => setRefundAmount(e.target.value)}
                                      />
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Leave empty for full refund
                                      </p>
                                    </div>
                                    <div>
                                      <Label htmlFor="refund-reason">Reason</Label>
                                      <Textarea
                                        id="refund-reason"
                                        placeholder="Reason for refund..."
                                        value={refundReason}
                                        onChange={(e) => setRefundReason(e.target.value)}
                                      />
                                    </div>
                                    <Button 
                                      onClick={() => handleRefund(selectedPayment.id)}
                                      variant="destructive"
                                    >
                                      <RefreshCw className="h-4 w-4 mr-2" />
                                      Process Refund
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {selectedPayment.refund_id && (
                                <div className="border-t pt-4">
                                  <h4 className="text-sm font-medium mb-2">Refund Information</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Refund ID</label>
                                      <p className="text-sm text-muted-foreground font-mono">
                                        {selectedPayment.refund_id}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Reason</label>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedPayment.refund_reason || 'No reason provided'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
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
