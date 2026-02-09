import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaBoxes, 
  FaChartLine, 
  FaTasks,
  FaShippingFast,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';

const HomeContent = ({ user }) => {
  const [stats, setStats] = useState({
    totalVendors: 156,
    totalBuyers: 89,
    activeOrders: 234,
    completedOrders: 1847,
    pendingShipments: 45,
    revenue: 2847500,
    pendingTasks: 23,
    completedTasks: 187
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'order', message: 'New PO #12345 created for ABC Textiles', time: '5 mins ago', status: 'new' },
    { id: 2, type: 'vendor', message: 'Vendor code 108 generated successfully', time: '15 mins ago', status: 'success' },
    { id: 3, type: 'shipment', message: 'Shipment #SH-789 dispatched', time: '1 hour ago', status: 'success' },
    { id: 4, type: 'task', message: 'Quality inspection pending for Batch #456', time: '2 hours ago', status: 'warning' }
  ]);

  const [departmentStats] = useState([
    { name: 'Sourcing', active: 45, pending: 12, completed: 156, color: 'var(--primary)' },
    { name: 'Operations', active: 34, pending: 8, completed: 203, color: 'var(--secondary)' },
    { name: 'Quality', active: 28, pending: 15, completed: 178, color: 'var(--primary)' },
    { name: 'Shipping', active: 19, pending: 7, completed: 145, color: 'var(--secondary)' }
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color }) => (
    <div className="stat-card" style={{ borderTopColor: color }}>
      <div className="stat-icon" style={{ backgroundColor: `${color}15`, color: color }}>
        <Icon />
      </div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <div className="stat-value">{value}</div>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
        {trend && (
          <div className={`stat-trend ${trend.direction}`}>
            {trend.direction === 'up' ? <FaArrowUp /> : <FaArrowDown />}
            <span>{trend.value}% from last month</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Welcome Section - uses shadcn primary */}
      <div className="home-welcome-section">
        <div style={styles.welcomeContent}>
          <h1 className="home-welcome-title">
            Welcome back, {user?.name || user?.email}! 👋
          </h1>
          <p className="home-welcome-subtitle">
            {user?.role === 'master-admin' && 'Here\'s what\'s happening across all departments today.'}
            {user?.role === 'manager' && 'Track your team\'s performance and manage operations efficiently.'}
            {user?.role === 'tenant' && 'View your dashboard metrics and recent activities.'}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      {/* <div style={styles.statsGrid}>
        <StatCard
          icon={FaUsers}
          title="Total Vendors"
          value={stats.totalVendors}
          subtitle="Active suppliers"
          trend={{ direction: 'up', value: 12 }}
          color="#667eea"
        />
        <StatCard
          icon={FaBoxes}
          title="Active Orders"
          value={stats.activeOrders}
          subtitle="In progress"
          trend={{ direction: 'up', value: 8 }}
          color="#764ba2"
        />
        <StatCard
          icon={FaShippingFast}
          title="Pending Shipments"
          value={stats.pendingShipments}
          subtitle="Awaiting dispatch"
          trend={{ direction: 'down', value: 5 }}
          color="#f093fb"
        />
        <StatCard
          icon={FaMoneyBillWave}
          title="Total Revenue"
          value={formatCurrency(stats.revenue)}
          subtitle="This month"
          trend={{ direction: 'up', value: 15 }}
          color="#4facfe"
        />
      </div> */}

      {/* Main Content Grid */}
      {/* <div style={styles.mainGrid}> */}
        {/* Department Performance */}
        {/* <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Department Performance</h2>
            <select style={styles.filterSelect}>
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Quarter</option>
            </select>
          </div>
          <div style={styles.departmentList}>
            {departmentStats.map((dept, index) => (
              <div key={index} style={styles.departmentItem}>
                <div style={styles.departmentHeader}>
                  <div style={styles.departmentName}>
                    <div 
                      style={{
                        ...styles.departmentDot,
                        backgroundColor: dept.color
                      }}
                    />
                    <span style={styles.deptNameText}>{dept.name}</span>
                  </div>
                  <div style={styles.departmentStats}>
                    <span style={styles.statBadge}>
                      <FaCheckCircle style={{ color: '#10b981' }} />
                      {dept.completed}
                    </span>
                    <span style={styles.statBadge}>
                      <FaClock style={{ color: '#f59e0b' }} />
                      {dept.active}
                    </span>
                    <span style={styles.statBadge}>
                      <FaExclamationTriangle style={{ color: '#ef4444' }} />
                      {dept.pending}
                    </span>
                  </div>
                </div>
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      width: `${(dept.completed / (dept.completed + dept.active + dept.pending)) * 100}%`,
                      backgroundColor: dept.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Recent Activities */}
        {/* <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Recent Activities</h2>
            <button style={styles.viewAllBtn}>View All</button>
          </div>
          <div style={styles.activitiesList}>
            {recentActivities.map((activity) => (
              <div key={activity.id} style={styles.activityItem}>
                <div 
                  style={{
                    ...styles.activityIcon,
                    backgroundColor: 
                      activity.status === 'success' ? '#10b98115' :
                      activity.status === 'warning' ? '#f59e0b15' :
                      '#667eea15',
                    color: 
                      activity.status === 'success' ? '#10b981' :
                      activity.status === 'warning' ? '#f59e0b' :
                      '#667eea'
                  }}
                >
                  {activity.status === 'success' ? <FaCheckCircle /> :
                   activity.status === 'warning' ? <FaExclamationTriangle /> :
                   <FaClock />}
                </div>
                <div style={styles.activityContent}>
                  <p style={styles.activityMessage}>{activity.message}</p>
                  <span style={styles.activityTime}>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Quick Stats Row */}
      {/* <div style={styles.quickStatsRow}>
        <div style={styles.quickStatCard}>
          <div style={styles.quickStatIcon}>
            <FaTasks style={{ color: '#667eea' }} />
          </div>
          <div style={styles.quickStatContent}>
            <div style={styles.quickStatValue}>{stats.pendingTasks}</div>
            <div style={styles.quickStatLabel}>Pending Tasks</div>
          </div>
        </div>
        <div style={styles.quickStatCard}>
          <div style={styles.quickStatIcon}>
            <FaCheckCircle style={{ color: '#10b981' }} />
          </div>
          <div style={styles.quickStatContent}>
            <div style={styles.quickStatValue}>{stats.completedTasks}</div>
            <div style={styles.quickStatLabel}>Completed Tasks</div>
          </div>
        </div>
        <div style={styles.quickStatCard}>
          <div style={styles.quickStatIcon}>
            <FaChartLine style={{ color: '#f59e0b' }} />
          </div>
          <div style={styles.quickStatContent}>
            <div style={styles.quickStatValue}>{stats.totalBuyers}</div>
            <div style={styles.quickStatLabel}>Active Buyers</div>
          </div>
        </div>
        <div style={styles.quickStatCard}>
          <div style={styles.quickStatIcon}>
            <FaBoxes style={{ color: '#764ba2' }} />
          </div>
          <div style={styles.quickStatContent}>
            <div style={styles.quickStatValue}>{stats.completedOrders}</div>
            <div style={styles.quickStatLabel}>Total Orders</div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  welcomeContent: {
    flex: 1
  },
  quickActions: {
    display: 'flex',
    gap: '12px'
  },
  quickActionBtn: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap'
  },
  primaryBtn: {
    background: 'var(--primary-foreground)',
    color: 'var(--primary)'
  },
  secondaryBtn: {
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'var(--primary-foreground)',
    backdropFilter: 'blur(10px)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '24px'
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
    marginBottom: '24px'
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f0f0f0'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a'
  },
  filterSelect: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    cursor: 'pointer',
    outline: 'none'
  },
  viewAllBtn: {
    padding: '6px 16px',
    background: 'var(--muted)',
    color: 'var(--primary)',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  departmentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  departmentItem: {
    padding: '0'
  },
  departmentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  departmentName: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  departmentDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%'
  },
  deptNameText: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1a1a1a'
  },
  departmentStats: {
    display: 'flex',
    gap: '12px'
  },
  statBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#6b7280'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: '#f3f4f6',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease'
  },
  activitiesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  activityItem: {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    background: '#fafafa',
    transition: 'all 0.2s',
    cursor: 'pointer'
  },
  activityIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    flexShrink: 0
  },
  activityContent: {
    flex: 1
  },
  activityMessage: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: '4px'
  },
  activityTime: {
    fontSize: '12px',
    color: '#9ca3af'
  },
  quickStatsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  quickStatCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f0f0f0'
  },
  quickStatIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    background: '#f9fafb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px'
  },
  quickStatContent: {
    flex: 1
  },
  quickStatValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '4px'
  },
  quickStatLabel: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '500'
  }
};

// Add hover effect for stat cards
const statCardStyle = `
  .stat-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid #f0f0f0;
    border-top: 3px solid;
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }
  
  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
  }
  
  .stat-content {
    flex: 1;
  }
  
  .stat-title {
    font-size: 13px;
    color: #6b7280;
    font-weight: 500;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .stat-value {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 4px;
  }
  
  .stat-subtitle {
    font-size: 13px;
    color: #9ca3af;
    margin-bottom: 8px;
  }
  
  .stat-trend {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 600;
    margin-top: 8px;
  }
  
  .stat-trend.up {
    color: #10b981;
  }
  
  .stat-trend.down {
    color: #ef4444;
  }
  
  .stat-trend svg {
    font-size: 10px;
  }
  
  .activity-item:hover {
    background: #f3f4f6;
  }
  
  .quick-stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
  
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .main-grid {
      grid-template-columns: 1fr;
    }
    
    .welcome-section {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
    
    .quick-actions {
      width: 100%;
    }
    
    .quick-action-btn {
      flex: 1;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = statCardStyle;
  document.head.appendChild(styleSheet);
}

export default HomeContent;