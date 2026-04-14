import React, { useState, useEffect } from 'react';
import { canViewReports } from '../utils/helpers';
import EmptyState from '../components/common/EmptyState';
import {
  HiOutlineChartBar,
  HiOutlineClipboardList,
  HiOutlineUsers,
  HiOutlineTrendingUp
} from 'react-icons/hi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import './Reports.css';
import { useOrganization } from '../hooks/useOrganization';
import api from '../services/api';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card';
import Loader from '../components/common/Loader';
import Avatar from '../components/common/Avatar';

const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#ef4444', '#8b5cf6'];

const Reports = () => {
  const { currentOrganization } = useOrganization();

  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [teamAnalytics, setTeamAnalytics] = useState(null);

  const userRole = currentOrganization?.userRole || 'member';

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!currentOrganization) {
        return;
      }

      try {
        setLoading(true);

        const [dashboardResponse, teamResponse] = await Promise.all([
          api.get('/analytics/dashboard', {
            params: { organization: currentOrganization._id }
          }),
          api.get('/analytics/team', {
            params: { organization: currentOrganization._id }
          })
        ]);

        setAnalytics(dashboardResponse.data.data);
        setTeamAnalytics(teamResponse.data.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [currentOrganization]);

  if (currentOrganization && !canViewReports(userRole)) {
    return (
      <EmptyState
        title="Access restricted"
        description="Only owner, admin, and project manager can view reports."
      />
    );
  }

  if (loading) {
    return <Loader text="Loading reports..." />;
  }

  const statusData =
    analytics?.tasksByStatus?.map((item) => ({
      name: item._id?.replace('_', ' ') || 'Unknown',
      value: item.count
    })) || [];

  const priorityData =
    analytics?.tasksByPriority?.map((item) => ({
      name: item._id || 'Unknown',
      value: item.count
    })) || [];

  const typeData =
    analytics?.tasksByType?.map((item) => ({
      name: item._id || 'Unknown',
      value: item.count
    })) || [];

  return (
    <div className="reports-page space-y-6">
      <div className="reports-header">
        <h1 className="reports-title text-2xl font-bold text-secondary-900">
          Reports & Analytics
        </h1>
        <p className="reports-subtitle mt-1 text-secondary-500">
          Overview of {currentOrganization?.name}&apos;s productivity
        </p>
      </div>

      <div className="reports-stats-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="reports-stat-card flex items-center gap-4">
          <div className="reports-stat-icon flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            <HiOutlineClipboardList className="h-6 w-6 text-blue-600" />
          </div>
          <div className="reports-stat-content">
            <p className="reports-stat-value text-2xl font-bold text-secondary-900">
              {analytics?.overview?.totalTasks || 0}
            </p>
            <p className="reports-stat-label text-sm text-secondary-500">Total Tasks</p>
          </div>
        </Card>

        <Card className="reports-stat-card flex items-center gap-4">
          <div className="reports-stat-icon flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
            <HiOutlineTrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div className="reports-stat-content">
            <p className="reports-stat-value text-2xl font-bold text-secondary-900">
              {analytics?.tasksByStatus?.find((status) => status._id === 'done')?.count || 0}
            </p>
            <p className="reports-stat-label text-sm text-secondary-500">Completed</p>
          </div>
        </Card>

        <Card className="reports-stat-card flex items-center gap-4">
          <div className="reports-stat-icon flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
            <HiOutlineChartBar className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="reports-stat-content">
            <p className="reports-stat-value text-2xl font-bold text-secondary-900">
              {analytics?.tasksByStatus?.find((status) => status._id === 'in_progress')?.count ||
                0}
            </p>
            <p className="reports-stat-label text-sm text-secondary-500">In Progress</p>
          </div>
        </Card>

        <Card className="reports-stat-card flex items-center gap-4">
          <div className="reports-stat-icon flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
            <HiOutlineUsers className="h-6 w-6 text-red-600" />
          </div>
          <div className="reports-stat-content">
            <p className="reports-stat-value text-2xl font-bold text-secondary-900">
              {analytics?.overview?.overdueTasks || 0}
            </p>
            <p className="reports-stat-label text-sm text-secondary-500">Overdue</p>
          </div>
        </Card>
      </div>

      <div className="reports-chart-grid grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="reports-chart-card">
          <CardHeader className="reports-card-header">
            <CardTitle className="reports-card-title">Tasks by Status</CardTitle>
          </CardHeader>
          <CardContent className="reports-card-content">
            <div className="reports-chart-box h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`status-cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="reports-chart-card">
          <CardHeader className="reports-card-header">
            <CardTitle className="reports-card-title">Tasks by Priority</CardTitle>
          </CardHeader>
          <CardContent className="reports-card-content">
            <div className="reports-chart-box h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="reports-team-card">
        <CardHeader className="reports-card-header">
          <CardTitle className="reports-card-title">Team Performance</CardTitle>
        </CardHeader>
        <CardContent className="reports-card-content">
          {teamAnalytics?.memberPerformance?.length > 0 ? (
            <div className="reports-team-list space-y-4">
              {teamAnalytics.memberPerformance.slice(0, 5).map((member, index) => (
                <div
                  key={index}
                  className="reports-team-row flex items-center gap-4"
                >
                  <span className="reports-team-rank w-6 text-lg font-bold text-secondary-400">
                    #{index + 1}
                  </span>

                  <Avatar
                    src={member.user?.avatar}
                    name={member.user?.fullName}
                    size="sm"
                  />

                  <div className="reports-team-info flex-1">
                    <p className="reports-team-name font-medium text-secondary-900">
                      {member.user?.fullName}
                    </p>
                    <p className="reports-team-meta text-sm text-secondary-500">
                      {member.completedTasks} tasks completed
                    </p>
                  </div>

                  <div className="reports-team-progress-track h-2 w-32 rounded-full bg-secondary-200">
                    <div
                      className="reports-team-progress-fill h-2 rounded-full bg-primary-500"
                      style={{
                        width: `${(member.completedTasks / (teamAnalytics.memberPerformance[0]?.completedTasks || 1)) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="reports-empty-team py-8 text-center text-secondary-500">
              No performance data available yet
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="reports-types-card">
        <CardHeader className="reports-card-header">
          <CardTitle className="reports-card-title">Task Types Distribution</CardTitle>
        </CardHeader>
        <CardContent className="reports-card-content">
          <div className="reports-chart-box h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;