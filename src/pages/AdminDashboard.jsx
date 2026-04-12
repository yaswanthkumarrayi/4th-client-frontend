import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, CalendarDays, PackageCheck } from 'lucide-react';
import { adminAPI } from '../services/adminAPI';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await adminAPI.getDashboard();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const statCards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: DollarSign,
      iconBg: '#fef3c7',
      iconColor: '#d97706',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      iconBg: '#ede9fe',
      iconColor: '#7c3aed',
    },
    {
      label: 'This Month',
      value: stats?.monthOrders || 0,
      icon: CalendarDays,
      iconBg: '#dbeafe',
      iconColor: '#2563eb',
    },
    {
      label: 'Delivered',
      value: stats?.totalDelivered || 0,
      icon: PackageCheck,
      iconBg: '#dcfce7',
      iconColor: '#16a34a',
    },
  ];

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-2 md:mt-0">{today}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-[12px] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-2 md:mt-0">{today}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-[12px] border border-[#e5e7eb] p-4 md:p-6"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: card.iconBg }}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: card.iconColor }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;
