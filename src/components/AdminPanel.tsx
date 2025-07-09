import React, { useState, useEffect } from 'react';
import { supabase, testConnection } from '../lib/supabase';
import { Eye, CheckCircle, X, Search, Filter, Users, DollarSign, Clock, TrendingUp } from 'lucide-react';

interface Purchase {
  id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  course_title: string;
  course_price: number;
  amount_paid: number;
  coupon_used?: string;
  payment_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  approved_at?: string;
}

const AdminPanel: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      // Test connection first
      const connectionTest = await testConnection();
      if (!connectionTest) {
        console.log('⚠️ Database connection failed, using localStorage fallback');
        const localPurchases = JSON.parse(localStorage.getItem('admin_purchases') || '[]');
        setPurchases(localPurchases);
        return;
      }

      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        // Fallback to localStorage if database query fails
        const localPurchases = JSON.parse(localStorage.getItem('admin_purchases') || '[]');
        setPurchases(localPurchases);
        return;
      }
      
      // Merge database data with localStorage data
      const localPurchases = JSON.parse(localStorage.getItem('admin_purchases') || '[]');
      const allPurchases = [...(data || []), ...localPurchases];
      
      // Remove duplicates based on ID
      const uniquePurchases = allPurchases.reduce((acc: Purchase[], current: Purchase) => {
        const existingIndex = acc.findIndex(p => p.id === current.id);
        if (existingIndex === -1) {
          acc.push(current);
        }
        return acc;
      }, []);
      
      setPurchases(uniquePurchases);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      // Final fallback to localStorage
      const localPurchases = JSON.parse(localStorage.getItem('admin_purchases') || '[]');
      setPurchases(localPurchases);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (purchaseId: string) => {
    setUpdating(purchaseId);
    try {
      // Try database update first
      const connectionTest = await testConnection();
      if (connectionTest) {
        const { error } = await supabase
          .from('purchases')
          .update({ 
            payment_status: 'approved',
            approved_at: new Date().toISOString()
          })
          .eq('id', purchaseId);

        if (error) {
          console.error('Database update failed, using localStorage:', error);
        }
      }
      
      // Always update localStorage as well
      const localPurchases = JSON.parse(localStorage.getItem('admin_purchases') || '[]');
      const updatedPurchases = localPurchases.map((purchase: Purchase) => 
        purchase.id === purchaseId 
          ? { ...purchase, payment_status: 'approved' as const, approved_at: new Date().toISOString() }
          : purchase
      );
      localStorage.setItem('admin_purchases', JSON.stringify(updatedPurchases));
      
      await fetchPurchases();
    } catch (error) {
      console.error('Error approving purchase:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleReject = async (purchaseId: string) => {
    setUpdating(purchaseId);
    try {
      // Try database update first
      const connectionTest = await testConnection();
      if (connectionTest) {
        const { error } = await supabase
          .from('purchases')
          .update({ payment_status: 'rejected' })
          .eq('id', purchaseId);

        if (error) {
          console.error('Database update failed, using localStorage:', error);
        }
      }
      
      // Always update localStorage as well
      const localPurchases = JSON.parse(localStorage.getItem('admin_purchases') || '[]');
      const updatedPurchases = localPurchases.map((purchase: Purchase) => 
        purchase.id === purchaseId 
          ? { ...purchase, payment_status: 'rejected' as const }
          : purchase
      );
      localStorage.setItem('admin_purchases', JSON.stringify(updatedPurchases));
      
      await fetchPurchases();
    } catch (error) {
      console.error('Error rejecting purchase:', error);
    } finally {
      setUpdating(null);
    }
  };

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.course_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || purchase.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: purchases.length,
    pending: purchases.filter(p => p.payment_status === 'pending').length,
    approved: purchases.filter(p => p.payment_status === 'approved').length,
    rejected: purchases.filter(p => p.payment_status === 'rejected').length,
    totalRevenue: purchases
      .filter(p => p.payment_status === 'approved')
      .reduce((sum, p) => sum + (p.amount_paid || p.course_price), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-white font-mono">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 font-mono">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 font-mono text-sm sm:text-base">
            Manage course purchases and user payments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-black/50 border border-cyan-400/30 rounded-xl p-3 sm:p-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400 font-mono">Total</p>
                <p className="text-lg sm:text-2xl font-bold text-white font-mono">{stats.total}</p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400" />
            </div>
          </div>
          
          <div className="bg-black/50 border border-yellow-400/30 rounded-xl p-3 sm:p-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400 font-mono">Pending</p>
                <p className="text-lg sm:text-2xl font-bold text-yellow-400 font-mono">{stats.pending}</p>
              </div>
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-black/50 border border-green-400/30 rounded-xl p-3 sm:p-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400 font-mono">Approved</p>
                <p className="text-lg sm:text-2xl font-bold text-green-400 font-mono">{stats.approved}</p>
              </div>
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-black/50 border border-red-400/30 rounded-xl p-3 sm:p-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400 font-mono">Rejected</p>
                <p className="text-lg sm:text-2xl font-bold text-red-400 font-mono">{stats.rejected}</p>
              </div>
              <X className="h-6 w-6 sm:h-8 sm:w-8 text-red-400" />
            </div>
          </div>
          
          <div className="bg-black/50 border border-purple-400/30 rounded-xl p-3 sm:p-4 backdrop-blur-md col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400 font-mono">Revenue</p>
                <p className="text-lg sm:text-2xl font-bold text-purple-400 font-mono">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-black/50 border border-cyan-400/30 rounded-xl p-4 sm:p-6 backdrop-blur-md mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name, email, or course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 font-mono text-sm"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full pl-10 pr-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-mono text-sm appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Purchases Table */}
        {filteredPurchases.length > 0 ? (
          <div className="bg-black/50 border border-cyan-400/30 rounded-xl backdrop-blur-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-cyan-900/20 border-b border-cyan-400/30">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider font-mono">User</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider font-mono">Course</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider font-mono">Amount</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider font-mono">Status</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider font-mono">Date</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider font-mono">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredPurchases.map((purchase) => (
                    <tr key={purchase.id} className="hover:bg-cyan-900/10 transition-colors duration-200">
                      <td className="px-4 sm:px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-white font-mono">{purchase.user_name}</div>
                          <div className="text-sm text-gray-400 font-mono break-all">{purchase.user_email}</div>
                          <div className="text-xs text-gray-500 font-mono">{purchase.user_phone}</div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm text-white font-mono">{purchase.course_title}</div>
                        {purchase.coupon_used && (
                          <div className="text-xs text-green-400 font-mono">Coupon: {purchase.coupon_used}</div>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm font-medium text-cyan-400 font-mono">₹{purchase.amount_paid || purchase.course_price}</div>
                        {(purchase.amount_paid || purchase.course_price) && (
                          <div className="text-xs text-gray-500 line-through font-mono">₹{purchase.course_price}</div>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          purchase.payment_status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : purchase.payment_status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {purchase.payment_status.charAt(0).toUpperCase() + purchase.payment_status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm text-gray-400 font-mono">
                          <div>{new Date(purchase.created_at).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(purchase.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedPurchase(purchase)}
                            className="p-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-400/30 rounded-lg transition-colors duration-200"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4 text-cyan-400" />
                          </button>
                          {purchase.payment_status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(purchase.id)}
                                disabled={updating === purchase.id}
                                className="p-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                title="Approve"
                              >
                                {updating === purchase.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
                                ) : (
                                  <CheckCircle className="h-4 w-4 text-green-400" />
                                )}
                              </button>
                              <button
                                onClick={() => handleReject(purchase.id)}
                                disabled={updating === purchase.id}
                                className="p-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                title="Reject"
                              >
                                {updating === purchase.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                                ) : (
                                  <X className="h-4 w-4 text-red-400" />
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredPurchases.length === 0 && !loading && (
              <div className="text-center py-8 sm:py-12">
                <div className="text-gray-400 text-4xl sm:text-6xl mb-4">📋</div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 font-mono">No purchases found</h3>
                <p className="text-gray-400 font-mono text-sm sm:text-base">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'No purchase requests have been made yet.'
                  }
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 text-4xl sm:text-6xl mb-4">📋</div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 font-mono">No purchases found</h3>
            <p className="text-gray-400 font-mono text-sm sm:text-base">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'No purchase requests have been made yet.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Mobile-First Purchase Details Modal */}
      {selectedPurchase && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black/90 border border-cyan-400/30 rounded-xl max-w-md w-full p-4 sm:p-6 backdrop-blur-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white font-mono">Purchase Details</h3>
              <button
                onClick={() => setSelectedPurchase(null)}
                className="p-2 hover:bg-cyan-800/30 rounded-lg transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-300" />
              </button>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">User Name</label>
                <p className="text-white font-mono text-sm sm:text-base">{selectedPurchase.user_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">Email</label>
                <p className="text-white font-mono text-sm sm:text-base break-all">{selectedPurchase.user_email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">Phone</label>
                <p className="text-white font-mono text-sm sm:text-base">{selectedPurchase.user_phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">Course</label>
                <p className="text-white font-mono text-sm sm:text-base">{selectedPurchase.course_title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">Amount Paid</label>
                <p className="text-cyan-400 font-mono text-sm sm:text-base">₹{selectedPurchase.amount_paid || selectedPurchase.course_price}</p>
              </div>
              {selectedPurchase.coupon_used && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">Coupon Used</label>
                  <p className="text-green-400 font-mono text-sm sm:text-base">{selectedPurchase.coupon_used}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">Purchase Time</label>
                <p className="text-white font-mono text-sm sm:text-base">{new Date(selectedPurchase.created_at).toLocaleString()}</p>
              </div>
              {selectedPurchase.approved_at && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">Approved Time</label>
                  <p className="text-green-400 font-mono text-sm sm:text-base">{new Date(selectedPurchase.approved_at).toLocaleString()}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedPurchase.payment_status === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : selectedPurchase.payment_status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedPurchase.payment_status.charAt(0).toUpperCase() + selectedPurchase.payment_status.slice(1)}
                </span>
              </div>
              
              {selectedPurchase.payment_status === 'pending' && (
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                  <button
                    onClick={() => {
                      handleApprove(selectedPurchase.id);
                      setSelectedPurchase(null);
                    }}
                    disabled={updating === selectedPurchase.id}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 font-mono border border-green-400/30 hover:border-green-400 disabled:opacity-50 text-sm"
                  >
                    {updating === selectedPurchase.id ? 'Approving...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedPurchase.id);
                      setSelectedPurchase(null);
                    }}
                    disabled={updating === selectedPurchase.id}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 font-mono border border-red-400/30 hover:border-red-400 disabled:opacity-50 text-sm"
                  >
                    {updating === selectedPurchase.id ? 'Rejecting...' : 'Reject'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
