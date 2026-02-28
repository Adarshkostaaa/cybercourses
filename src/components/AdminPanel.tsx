import { useState, useEffect } from 'react';
import { supabase, testConnection } from '../lib/supabase';
import { Eye, CheckCircle, X, Search, Filter, Users, DollarSign, Clock, TrendingUp, UserPlus, Activity, Mail, Calendar, BarChart3, RefreshCw, ChevronDown } from 'lucide-react';

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

interface RegisteredUser {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  has_purchased: boolean;
  last_active: string;
}

interface UserActivity {
  id: string;
  user_email: string;
  action: string;
  details: string;
  timestamp: string;
  page: string;
}

const AdminPanel: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [activeTab, setActiveTab] = useState<'purchases' | 'users' | 'activity'>('purchases');

  useEffect(() => {
    fetchPurchases();
    loadRegisteredUsers();
    loadActivities();
  }, []);

  const loadRegisteredUsers = () => {
    const users = JSON.parse(localStorage.getItem('registered_users_list') || '[]');
    // Also pull from library_users
    const libraryUsers = JSON.parse(localStorage.getItem('library_users') || '[]');
    const adminPurchases = JSON.parse(localStorage.getItem('admin_purchases') || '[]');
    const purchaserEmails = new Set(adminPurchases.map((p: any) => p.user_email?.toLowerCase()));

    // Merge library_users into registered list
    libraryUsers.forEach((lu: any) => {
      const exists = users.find((u: any) => u.email?.toLowerCase() === lu.email?.toLowerCase());
      if (!exists) {
        users.push({
          id: lu.id || `user_${Date.now()}`,
          email: lu.email,
          full_name: lu.full_name || 'Unknown',
          created_at: lu.created_at || new Date().toISOString(),
          has_purchased: purchaserEmails.has(lu.email?.toLowerCase()),
          last_active: lu.created_at || new Date().toISOString()
        });
      }
    });

    // Update has_purchased flag
    users.forEach((u: RegisteredUser) => {
      u.has_purchased = purchaserEmails.has(u.email?.toLowerCase());
    });

    setRegisteredUsers(users);
    localStorage.setItem('registered_users_list', JSON.stringify(users));
  };

  const loadActivities = () => {
    const acts = JSON.parse(localStorage.getItem('user_activities') || '[]');
    setActivities(acts.reverse().slice(0, 200)); // Show latest 200
  };

  const fetchPurchases = async () => {
    try {
      const connectionTest = await testConnection();
      if (!connectionTest) {
        const localPurchases = JSON.parse(localStorage.getItem('admin_purchases') || '[]');
        setPurchases(localPurchases);
        return;
      }
      const { data, error } = await supabase.from('purchases').select('*').order('created_at', { ascending: false });
      if (error) {
        const localPurchases = JSON.parse(localStorage.getItem('admin_purchases') || '[]');
        setPurchases(localPurchases);
        return;
      }
      const localPurchases = JSON.parse(localStorage.getItem('admin_purchases') || '[]');
      const allPurchases = [...(data || []), ...localPurchases];
      const uniquePurchases = allPurchases.reduce((acc: Purchase[], current: Purchase) => {
        if (!acc.find(p => p.id === current.id)) acc.push(current);
        return acc;
      }, []);
      setPurchases(uniquePurchases);
    } catch {
      const localPurchases = JSON.parse(localStorage.getItem('admin_purchases') || '[]');
      setPurchases(localPurchases);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (purchaseId: string) => {
    setUpdating(purchaseId);
    try {
      const connectionTest = await testConnection();
      if (connectionTest) {
        await supabase.from('purchases').update({ payment_status: 'approved', approved_at: new Date().toISOString() }).eq('id', purchaseId);
      }
      const localPurchases = JSON.parse(localStorage.getItem('admin_purchases') || '[]');
      const updatedPurchases = localPurchases.map((p: Purchase) =>
        p.id === purchaseId ? { ...p, payment_status: 'approved' as const, approved_at: new Date().toISOString() } : p
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
      const connectionTest = await testConnection();
      if (connectionTest) {
        await supabase.from('purchases').update({ payment_status: 'rejected' }).eq('id', purchaseId);
      }
      const localPurchases = JSON.parse(localStorage.getItem('admin_purchases') || '[]');
      const updatedPurchases = localPurchases.map((p: Purchase) =>
        p.id === purchaseId ? { ...p, payment_status: 'rejected' as const } : p
      );
      localStorage.setItem('admin_purchases', JSON.stringify(updatedPurchases));
      await fetchPurchases();
    } catch (error) {
      console.error('Error rejecting purchase:', error);
    } finally {
      setUpdating(null);
    }
  };

  const filteredPurchases = purchases.filter(p => {
    const matchesSearch = p.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.course_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = registeredUsers.filter(u =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredActivities = activities.filter(a =>
    a.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: purchases.length,
    pending: purchases.filter(p => p.payment_status === 'pending').length,
    approved: purchases.filter(p => p.payment_status === 'approved').length,
    rejected: purchases.filter(p => p.payment_status === 'rejected').length,
    totalRevenue: purchases.filter(p => p.payment_status === 'approved').reduce((sum, p) => sum + (p.amount_paid || p.course_price), 0),
    registeredCount: registeredUsers.length,
    nonBuyers: registeredUsers.filter(u => !u.has_purchased).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-heading mb-1">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Manage purchases, users, and activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Orders</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-primary-400" />
            </div>
          </div>
          <div className="bg-white border border-amber-100 rounded-xl p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Pending</p>
                <p className="text-xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-400" />
            </div>
          </div>
          <div className="bg-white border border-green-100 rounded-xl p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Approved</p>
                <p className="text-xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white border border-red-100 rounded-xl p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Rejected</p>
                <p className="text-xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <X className="h-8 w-8 text-red-400" />
            </div>
          </div>
          <div className="bg-white border border-purple-100 rounded-xl p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Revenue</p>
                <p className="text-xl font-bold text-purple-600">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Registered</p>
                <p className="text-xl font-bold text-blue-600">{stats.registeredCount}</p>
              </div>
              <UserPlus className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white border border-orange-100 rounded-xl p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Non-buyers</p>
                <p className="text-xl font-bold text-orange-600">{stats.nonBuyers}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-soft mb-6">
          <div className="flex border-b border-gray-100">
            {[
              { id: 'purchases' as const, label: 'Purchases', icon: DollarSign, count: purchases.length },
              { id: 'users' as const, label: 'Registered Users', icon: Users, count: registeredUsers.length },
              { id: 'activity' as const, label: 'User Activity', icon: Activity, count: activities.length }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                }`}>
                <tab.icon className="h-4 w-4" />
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm" />
            </div>
            {activeTab === 'purchases' && (
              <div className="sm:w-44 relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none">
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              </div>
            )}
            <button onClick={() => { fetchPurchases(); loadRegisteredUsers(); loadActivities(); }}
              className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors" title="Refresh">
              <RefreshCw className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          {/* ===== PURCHASES TAB ===== */}
          {activeTab === 'purchases' && (
            <div className="overflow-x-auto">
              {filteredPurchases.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50/80">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredPurchases.map((purchase) => (
                      <tr key={purchase.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-medium text-gray-900 text-sm">{purchase.user_name}</div>
                          <div className="text-xs text-gray-500 break-all">{purchase.user_email}</div>
                          <div className="text-xs text-gray-400">{purchase.user_phone}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-sm text-gray-900 font-medium">{purchase.course_title}</div>
                          {purchase.coupon_used && <div className="text-xs text-green-600 font-medium">Coupon: {purchase.coupon_used}</div>}
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-sm font-bold text-gray-900">₹{purchase.amount_paid || purchase.course_price}</div>
                          {purchase.course_price !== purchase.amount_paid && (
                            <div className="text-xs text-gray-400 line-through">₹{purchase.course_price}</div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                            purchase.payment_status === 'approved' ? 'bg-green-50 text-green-700 border border-green-200'
                            : purchase.payment_status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                            {purchase.payment_status.charAt(0).toUpperCase() + purchase.payment_status.slice(1)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-sm text-gray-600">{new Date(purchase.created_at).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-400">{new Date(purchase.created_at).toLocaleTimeString()}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => setSelectedPurchase(purchase)}
                              className="p-2 bg-gray-50 hover:bg-primary-50 border border-gray-200 hover:border-primary-200 rounded-lg transition-all" title="View">
                              <Eye className="h-4 w-4 text-gray-500 hover:text-primary-600" />
                            </button>
                            {purchase.payment_status === 'pending' && (
                              <>
                                <button onClick={() => handleApprove(purchase.id)} disabled={updating === purchase.id}
                                  className="p-2 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-all disabled:opacity-50" title="Approve">
                                  {updating === purchase.id ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                                  : <CheckCircle className="h-4 w-4 text-green-600" />}
                                </button>
                                <button onClick={() => handleReject(purchase.id)} disabled={updating === purchase.id}
                                  className="p-2 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-all disabled:opacity-50" title="Reject">
                                  {updating === purchase.id ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                  : <X className="h-4 w-4 text-red-600" />}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-gray-700 mb-1">No purchases found</h3>
                  <p className="text-sm text-gray-400">
                    {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filter.' : 'No purchase requests yet.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ===== REGISTERED USERS TAB ===== */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              {filteredUsers.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50/80">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Active</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-primary-700 font-bold text-sm">{user.full_name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="font-medium text-gray-900 text-sm">{user.full_name}</div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Mail className="h-3.5 w-3.5 text-gray-400" />
                            <span className="break-all">{user.email}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                            <span>{new Date(user.created_at).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-gray-500">
                            {new Date(user.last_active).toLocaleDateString()} {new Date(user.last_active).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {user.has_purchased ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
                              <CheckCircle className="h-3 w-3" /> Buyer
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                              <Clock className="h-3 w-3" /> Registered Only
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-gray-700 mb-1">No registered users</h3>
                  <p className="text-sm text-gray-400">Users who register will appear here.</p>
                </div>
              )}
            </div>
          )}

          {/* ===== ACTIVITY TAB ===== */}
          {activeTab === 'activity' && (
            <div className="p-4">
              {filteredActivities.length > 0 ? (
                <div className="space-y-2">
                  {filteredActivities.slice(0, 50).map((act) => (
                    <div key={act.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        act.action === 'signup' ? 'bg-blue-100' :
                        act.action === 'signin' ? 'bg-green-100' :
                        act.action === 'signout' ? 'bg-red-100' :
                        act.action === 'access_course' ? 'bg-purple-100' :
                        act.action === 'view_course' ? 'bg-amber-100' :
                        act.action === 'add_to_cart' ? 'bg-pink-100' :
                        'bg-gray-100'
                      }`}>
                        <Activity className={`h-4 w-4 ${
                          act.action === 'signup' ? 'text-blue-600' :
                          act.action === 'signin' ? 'text-green-600' :
                          act.action === 'signout' ? 'text-red-600' :
                          act.action === 'access_course' ? 'text-purple-600' :
                          act.action === 'view_course' ? 'text-amber-600' :
                          act.action === 'add_to_cart' ? 'text-pink-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-900 capitalize">{act.action.replace(/_/g, ' ')}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{act.user_email}</span>
                        </div>
                        {act.details && <p className="text-xs text-gray-500 mt-0.5">{act.details}</p>}
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(act.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-gray-700 mb-1">No activity yet</h3>
                  <p className="text-sm text-gray-400">User activities like signups, sign-ins, and course views will appear here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Purchase Details Modal */}
      {selectedPurchase && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900 font-heading">Purchase Details</h3>
              <button onClick={() => setSelectedPurchase(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'User Name', value: selectedPurchase.user_name },
                { label: 'Email', value: selectedPurchase.user_email },
                { label: 'Phone', value: selectedPurchase.user_phone },
                { label: 'Course', value: selectedPurchase.course_title },
                { label: 'Amount Paid', value: `₹${selectedPurchase.amount_paid || selectedPurchase.course_price}`, highlight: true },
                { label: 'Purchase Time', value: new Date(selectedPurchase.created_at).toLocaleString() }
              ].map(item => (
                <div key={item.label}>
                  <label className="block text-xs font-semibold text-gray-500 mb-0.5 uppercase tracking-wider">{item.label}</label>
                  <p className={`text-sm ${item.highlight ? 'text-primary-600 font-bold' : 'text-gray-900'} break-all`}>{item.value}</p>
                </div>
              ))}
              {selectedPurchase.coupon_used && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-0.5 uppercase tracking-wider">Coupon Used</label>
                  <p className="text-sm text-green-600 font-medium">{selectedPurchase.coupon_used}</p>
                </div>
              )}
              {selectedPurchase.approved_at && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-0.5 uppercase tracking-wider">Approved Time</label>
                  <p className="text-sm text-green-600">{new Date(selectedPurchase.approved_at).toLocaleString()}</p>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-0.5 uppercase tracking-wider">Status</label>
                <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                  selectedPurchase.payment_status === 'approved' ? 'bg-green-50 text-green-700'
                  : selectedPurchase.payment_status === 'rejected' ? 'bg-red-50 text-red-700'
                  : 'bg-amber-50 text-amber-700'}`}>
                  {selectedPurchase.payment_status.charAt(0).toUpperCase() + selectedPurchase.payment_status.slice(1)}
                </span>
              </div>
              {selectedPurchase.payment_status === 'pending' && (
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { handleApprove(selectedPurchase.id); setSelectedPurchase(null); }} disabled={updating === selectedPurchase.id}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-semibold transition-all text-sm disabled:opacity-50">
                    {updating === selectedPurchase.id ? 'Approving...' : 'Approve'}
                  </button>
                  <button onClick={() => { handleReject(selectedPurchase.id); setSelectedPurchase(null); }} disabled={updating === selectedPurchase.id}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold transition-all text-sm disabled:opacity-50">
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
