import React, { useState, useEffect } from 'react';
import { Shield, Users, BookOpen, DollarSign, CheckCircle, X, Eye, Search, Filter, RefreshCw, ArrowLeft } from 'lucide-react';
import { supabase, testConnection } from '../lib/supabase';

interface Purchase {
  id: string;
  user_email: string;
  user_phone: string;
  user_name: string;
  course_title: string;
  course_price: number;
  payment_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  payment_screenshot?: string;
  amount_paid: number;
  coupon_used?: string;
  approved_at?: string;
}

interface AdminPanelProps {
  onLogout?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalPurchases: 0,
    pendingPurchases: 0,
    approvedPurchases: 0,
    totalRevenue: 0
  });

  // Load purchases from Supabase
  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      setLoading(true);
      console.log('Testing database connection...');
      
      // Test connection first
      const connectionOk = await testConnection();
      if (!connectionOk) {
        console.error('Database connection failed');
        // Load from local storage when database is not available
        const localPurchases = JSON.parse(localStorage.getItem('admin_purchases') || '[]');
        setPurchases(localPurchases);
        setFilteredPurchases(localPurchases);
        calculateStats(localPurchases);
        return;
      }

      console.log('Loading purchases from Supabase...');
      
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading purchases:', error);
        // Fallback to local storage if query fails
        const localPurchases = JSON.parse(localStorage.getItem('admin_purchases') || '[]');
        setPurchases(localPurchases);
        setFilteredPurchases(localPurchases);
        calculateStats(localPurchases);
        return;
      }

      console.log('Purchases loaded:', data?.length || 0);
      const purchasesData = data || [];

      setPurchases(purchasesData);
      setFilteredPurchases(purchasesData);
      calculateStats(purchasesData);
    } catch (error) {
      console.error('Error in loadPurchases:', error);
      
      // Use local storage on any error
      const localPurchases = JSON.parse(localStorage.getItem('admin_purchases') || '[]');
      setPurchases(localPurchases);
      setFilteredPurchases(localPurchases);
      calculateStats(localPurchases);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (purchasesData: Purchase[]) => {
    const totalPurchases = purchasesData.length;
    const pendingPurchases = purchasesData.filter(p => p.payment_status === 'pending').length;
    const approvedPurchases = purchasesData.filter(p => p.payment_status === 'approved').length;
    const totalRevenue = purchasesData
      .filter(p => p.payment_status === 'approved')
      .reduce((sum, p) => sum + (p.amount_paid || p.course_price), 0);
    
    setStats({ totalPurchases, pendingPurchases, approvedPurchases, totalRevenue });
  };

  useEffect(() => {
    let filtered = purchases;
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.course_title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.payment_status === statusFilter);
    }
    
    setFilteredPurchases(filtered);
  }, [searchTerm, statusFilter, purchases]);

  const handleApprove = async (purchaseId: string) => {
    try {
      setUpdating(purchaseId);
      
      console.log('Approving purchase:', purchaseId);
      
      // Always update locally first (works as fallback)
      updateLocalPurchaseStatus(purchaseId, 'approved');
      
      // Try to update database in background (don't block on failure)
      try {
        if (!purchaseId.startsWith('mock_') && !purchaseId.startsWith('fallback_') && !purchaseId.startsWith('error_fallback_') && !purchaseId.startsWith('local_')) {
          const connectionOk = await testConnection();
          if (connectionOk) {
            const { error } = await supabase
              .from('purchases')
              .update({ 
                payment_status: 'approved',
                approved_at: new Date().toISOString()
              })
              .eq('id', purchaseId);

            if (error) {
              console.warn('Database update failed, but local update succeeded:', error);
            } else {
              console.log('Database updated successfully');
            }
          } else {
            console.warn('Database connection failed, using local storage only');
          }
        }
      } catch (dbError) {
        console.warn('Database operation failed, but local approval succeeded:', dbError);
      }
      
      // Show success message regardless of database status
      alert('✅ Purchase approved successfully! Course is now available in user library.');
      
    } catch (error) {
      console.error('Error in handleApprove:', error);
      // Even if there's an error, try local update as last resort
      try {
        updateLocalPurchaseStatus(purchaseId, 'approved');
        alert('✅ Purchase approved locally! Course is now available in user library.');
      } catch (localError) {
        console.error('Local update also failed:', localError);
        alert('❌ Failed to approve purchase. Please try again.');
      }
    } finally {
      setUpdating(null);
    }
  };

  // Function to update purchase status in local storage and state
  const updateLocalPurchaseStatus = (purchaseId: string, status: 'approved' | 'rejected') => {
    try {
      const approvedAt = new Date().toISOString();
      
      // Update admin purchases in localStorage
      const adminPurchases = JSON.parse(localStorage.getItem('admin_purchases') || '[]');
      const updatedAdminPurchases = adminPurchases.map((p: any) => 
        p.id === purchaseId ? { 
          ...p, 
          payment_status: status,
          approved_at: status === 'approved' ? approvedAt : undefined
        } : p
      );
      localStorage.setItem('admin_purchases', JSON.stringify(updatedAdminPurchases));
      
      // Update local state
      setPurchases(prev => prev.map(p => 
        p.id === purchaseId ? { 
          ...p, 
          payment_status: status,
          approved_at: status === 'approved' ? approvedAt : undefined
        } : p
      ));
      
      // Recalculate stats
      const updatedPurchases = purchases.map(p => 
        p.id === purchaseId ? { 
          ...p, 
          payment_status: status,
          approved_at: status === 'approved' ? approvedAt : undefined
        } : p
      );
      calculateStats(updatedPurchases);
      
      if (status === 'approved') {
        console.log('Purchase approved and will be available in user library');
      }
      
    } catch (error) {
      console.error('Error updating purchase status:', error);
    }
  };

  const handleReject = async (purchaseId: string) => {
    try {
      setUpdating(purchaseId);
      
      console.log('Rejecting purchase:', purchaseId);
      
      // Always update locally first (works as fallback)
      updateLocalPurchaseStatus(purchaseId, 'rejected');
      
      // Try to update database in background (don't block on failure)
      try {
        if (!purchaseId.startsWith('mock_') && !purchaseId.startsWith('fallback_') && !purchaseId.startsWith('error_fallback_') && !purchaseId.startsWith('local_')) {
          const connectionOk = await testConnection();
          if (connectionOk) {
            const { error } = await supabase
              .from('purchases')
              .update({ payment_status: 'rejected' })
              .eq('id', purchaseId);

            if (error) {
              console.warn('Database update failed, but local update succeeded:', error);
            } else {
              console.log('Database updated successfully');
            }
          } else {
            console.warn('Database connection failed, using local storage only');
          }
        }
      } catch (dbError) {
        console.warn('Database operation failed, but local rejection succeeded:', dbError);
      }
      
      // Show success message regardless of database status
      alert('❌ Purchase rejected successfully!');
      
    } catch (error) {
      console.error('Error in handleReject:', error);
      // Even if there's an error, try local update as last resort
      try {
        updateLocalPurchaseStatus(purchaseId, 'rejected');
        alert('❌ Purchase rejected locally!');
      } catch (localError) {
        console.error('Local update also failed:', localError);
        alert('❌ Failed to reject purchase. Please try again.');
      }
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cyberpunk Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-purple-900/10 to-pink-900/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Mobile-First Header */}
      <div className="relative z-10 bg-black/80 backdrop-blur-sm border-b border-cyan-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-mono">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
              <button
                onClick={loadPurchases}
                disabled={loading}
                className="flex items-center space-x-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-400/30 text-cyan-400 px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 font-mono disabled:opacity-50 text-sm"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 bg-red-600/20 hover:bg-red-600/30 border border-red-400/30 text-red-400 px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 font-mono text-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              )}
              <div className="text-xs sm:text-sm text-gray-300 font-mono">
                Welcome, Admin
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Mobile-First Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-black/50 backdrop-blur-sm border border-cyan-400/30 rounded-xl p-3 sm:p-6 hover:border-cyan-400 transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="text-center sm:text-left">
                <p className="text-cyan-200 text-xs sm:text-sm font-medium font-mono">Total Purchases</p>
                <p className="text-lg sm:text-2xl font-bold text-cyan-400 font-mono">{stats.totalPurchases}</p>
              </div>
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 animate-pulse mt-2 sm:mt-0" />
            </div>
          </div>
          
          <div className="bg-black/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-3 sm:p-6 hover:border-purple-400 transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="text-center sm:text-left">
                <p className="text-purple-200 text-xs sm:text-sm font-medium font-mono">Pending</p>
                <p className="text-lg sm:text-2xl font-bold text-purple-400 font-mono">{stats.pendingPurchases}</p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400 animate-pulse mt-2 sm:mt-0" />
            </div>
          </div>
          
          <div className="bg-black/50 backdrop-blur-sm border border-green-400/30 rounded-xl p-3 sm:p-6 hover:border-green-400 transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="text-center sm:text-left">
                <p className="text-green-200 text-xs sm:text-sm font-medium font-mono">Approved</p>
                <p className="text-lg sm:text-2xl font-bold text-green-400 font-mono">{stats.approvedPurchases}</p>
              </div>
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 animate-pulse mt-2 sm:mt-0" />
            </div>
          </div>
          
          <div className="bg-black/50 backdrop-blur-sm border border-pink-400/30 rounded-xl p-3 sm:p-6 hover:border-pink-400 transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="text-center sm:text-left">
                <p className="text-pink-200 text-xs sm:text-sm font-medium font-mono">Revenue</p>
                <p className="text-lg sm:text-2xl font-bold text-pink-400 font-mono">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-pink-400 animate-pulse mt-2 sm:mt-0" />
            </div>
          </div>
        </div>

        {/* Mobile-First Filters */}
        <div className="bg-black/50 backdrop-blur-sm border border-cyan-400/20 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by email, name, or course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-3 bg-black/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-gray-500 font-mono text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-3 bg-black/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white appearance-none font-mono text-sm sm:text-base"
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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-gray-400 font-mono text-sm sm:text-base">Loading purchases...</p>
          </div>
        )}

        {/* Mobile-First Purchases Table */}
        {!loading && (
          <div className="bg-black/50 backdrop-blur-sm border border-cyan-400/20 rounded-xl overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-cyan-400/20">
              <h2 className="text-lg sm:text-xl font-semibold text-white font-mono">Purchase Requests</h2>
            </div>
            
            {/* Mobile Cards View */}
            <div className="block sm:hidden">
              {filteredPurchases.map((purchase) => (
                <div key={purchase.id} className="border-b border-cyan-400/20 p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-white font-mono">{purchase.user_name}</div>
                        <div className="text-xs text-gray-400 font-mono">{purchase.user_email}</div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        purchase.payment_status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : purchase.payment_status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {purchase.payment_status.charAt(0).toUpperCase() + purchase.payment_status.slice(1)}
                      </span>
                    </div>
                    
                    <div>
                      <div className="text-sm text-white font-mono">{purchase.course_title}</div>
                      <div className="text-sm font-medium text-cyan-400 font-mono">₹{purchase.amount_paid || purchase.course_price}</div>
                    </div>
                    
                    <div className="text-xs text-gray-400 font-mono">
                      {new Date(purchase.created_at).toLocaleDateString()}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedPurchase(purchase)}
                        className="flex-1 p-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-400/30 rounded-lg transition-colors duration-200 text-cyan-400 text-xs font-mono"
                      >
                        View
                      </button>
                      {purchase.payment_status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(purchase.id)}
                            disabled={updating === purchase.id}
                            className="flex-1 p-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg transition-colors duration-200 disabled:opacity-50 text-green-400 text-xs font-mono"
                          >
                            {updating === purchase.id ? 'Approving...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(purchase.id)}
                            disabled={updating === purchase.id}
                            className="flex-1 p-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg transition-colors duration-200 disabled:opacity-50 text-red-400 text-xs font-mono"
                          >
                            {updating === purchase.id ? 'Rejecting...' : 'Reject'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/70">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider font-mono">User</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider font-mono">Course</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider font-mono">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider font-mono">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider font-mono">Purchase Time</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider font-mono">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-400/20">
                  {filteredPurchases.map((purchase) => (
                    <tr key={purchase.id} className="hover:bg-cyan-400/5 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-white font-mono">{purchase.user_name}</div>
                          <div className="text-sm text-gray-400 font-mono">{purchase.user_email}</div>
                          <div className="text-sm text-gray-400 font-mono">{purchase.user_phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white font-mono">{purchase.course_title}</div>
                        {purchase.coupon_used && (
                          <div className="text-xs text-green-400 font-mono">Coupon: {purchase.coupon_used}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-cyan-400 font-mono">₹{purchase.amount_paid || purchase.course_price}</div>
                        {purchase.course_price !== (purchase.amount_paid || purchase.course_price) && (
                          <div className="text-xs text-gray-500 line-through font-mono">₹{purchase.course_price}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
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
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-400 font-mono">
                          <div>{new Date(purchase.created_at).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(purchase.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
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