import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Repeat, TrendingUp, DollarSign, Calendar, MapPin, Search, Globe, MousePointerClick, Smartphone, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function ScrollReveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

const StatCard = ({ title, value, subtitle, icon: Icon, color, delay }) => (
  <ScrollReveal delay={delay}>
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${color} shadow-sm flex-shrink-0`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  </ScrollReveal>
);

const COLORS = ['#dc2626', '#ef4444', '#10b981', '#8b5cf6', '#f43f5e'];

export default function AdminRetention() {
  const [data, setData] = useState(null);
  const [trafficData, setTrafficData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [retRes, trafRes] = await Promise.all([
        axios.get('/api/analytics/retention'),
        axios.get('/api/analytics/traffic')
      ]);
      setData(retRes.data);
      setTrafficData(trafRes.data);
    } catch (error) {
      console.error('Failed to fetch analytics data', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = data?.topCustomers.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone?.includes(searchQuery)
  );

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Web Analytics</h1>
          <p className="text-gray-500 mt-1">Track traffic, retention, and lifetime value</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 text-gray-400">Loading analytics...</div>
      ) : data && trafficData ? (
        <>
          {/* Deep Web Traffic Section */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Globe className="text-red-500" /> Deep Web Traffic (Last 30 Days)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard 
                title="Total Page Views" 
                value={trafficData.totalPageViews} 
                icon={MousePointerClick} 
                color="from-indigo-500 to-indigo-600"
                delay={0}
              />
              <StatCard 
                title="Unique Visitors" 
                value={trafficData.uniqueVisitors} 
                icon={Users} 
                color="from-emerald-500 to-emerald-600"
                delay={0.1}
              />
              <StatCard 
                title="Mobile Traffic" 
                value={`${Math.round(((trafficData.devices.find(d => d.name === 'Mobile')?.value || 0) / (trafficData.uniqueVisitors || 1)) * 100)}%`} 
                icon={Smartphone} 
                color="from-pink-500 to-rose-600"
                delay={0.2}
              />
              <StatCard 
                title="Desktop Traffic" 
                value={`${Math.round(((trafficData.devices.find(d => d.name === 'Desktop')?.value || 0) / (trafficData.uniqueVisitors || 1)) * 100)}%`} 
                icon={Monitor} 
                color="from-red-500 to-cyan-600"
                delay={0.3}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top Pages Chart */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Top Pages Visited</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trafficData.topPages} layout="vertical" margin={{ left: 20 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Bar dataKey="views" fill="#dc2626" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Devices Chart */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6 text-center">Device Breakdown</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={trafficData.devices}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {trafficData.devices.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Legend iconType="circle" wrapperStyle={{fontSize: '12px'}} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-200 mb-10" />

          {/* Retention & Billing Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="text-purple-500" /> Retention & Billing
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard 
                title="Total Customers" 
                value={data.totalCustomers} 
                icon={Users} 
                color="from-red-500 to-red-600"
                delay={0}
              />
              <StatCard 
                title="Repeat Customers" 
                value={data.repeatCustomers} 
                icon={Repeat} 
                color="from-purple-500 to-purple-600"
                delay={0.1}
              />
              <StatCard 
                title="Retention Rate" 
                value={`${data.retentionRate}%`} 
                subtitle="Ordered more than once"
                icon={TrendingUp} 
                color="from-green-500 to-green-600"
                delay={0.2}
              />
              <StatCard 
                title="Total LTV Revenue" 
                value={`₹${data.totalRevenue.toLocaleString()}`} 
                icon={DollarSign} 
                color="from-red-500 to-[#dc2626]"
                delay={0.3}
              />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-900">Top Customers (LTV)</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search name or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20 focus:border-[#dc2626] transition-all text-sm"
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 text-gray-500 text-sm font-semibold uppercase tracking-wider">
                      <th className="p-4 pl-6">Customer</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Orders</th>
                      <th className="p-4">Lifetime Value</th>
                      <th className="p-4 pr-6">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredCustomers?.map((customer, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-red-100 flex items-center justify-center text-indigo-700 font-bold">
                              {customer.name ? customer.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{customer.name || 'Anonymous'}</p>
                              {customer.visitorId && (
                                <p className="text-xs text-gray-400">Profile: {customer.visitorId.substring(0,8)}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-gray-700 font-medium">{customer.phone || 'N/A'}</p>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold ${customer.orderCount > 1 ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                            {customer.orderCount}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="text-gray-900 font-bold">₹{customer.totalSpent.toLocaleString()}</p>
                        </td>
                        <td className="p-4 pr-6">
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Calendar size={14} />
                            {new Date(customer.lastOrderDate).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredCustomers?.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-400">
                          No customers found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
