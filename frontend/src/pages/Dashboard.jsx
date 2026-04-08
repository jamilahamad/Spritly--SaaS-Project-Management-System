import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineFolder,
  HiOutlineClipboardList,
  HiOutlineUsers,
  HiOutlineExclamation
} from 'react-icons/hi';
import './Dashboard.css';
import { useOrganization } from '../hooks/useOrganization';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { getSocket, connectUserRoom } from '../services/socket';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card';
import Loader from '../components/common/Loader';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import { TASK_PRIORITIES } from '../utils/constants';
import { getRelativeTime } from '../utils/helpers';

const Dashboard = () => {
  const { currentOrganization } = useOrganization();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    if (!currentOrganization || !user?._id) {
      return;
    }

    try {
      setLoading(true);

      const analyticsResponse = await api.get('/analytics/dashboard', {
        params: { organization: currentOrganization._id }
      });

      setAnalytics(analyticsResponse.data.data);

      const tasksResponse = await api.get('/tasks', {
        params: {
          organization: currentOrganization._id,
          assignee: user._id,
          limit: 5
        }
      });

      setRecentTasks((tasksResponse.data.data || []).slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentOrganization, user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (!user?._id) {
      return;
    }

    connectUserRoom(user._id);
    const socket = getSocket();

    const handleRealtimeTaskAssigned = async (payload) => {
      const sameOrganization =
        !currentOrganization?._id || payload?.organizationId === currentOrganization._id;

      if (!sameOrganization) {
        return;
      }

      await fetchDashboardData();
    };

    const handleRealtimeTaskUpdated = async (payload) => {
      const sameOrganization =
        !currentOrganization?._id || payload?.organizationId === currentOrganization._id;

      if (!sameOrganization) {
        return;
      }

      await fetchDashboardData();
    };

    socket.on('task_assigned_realtime', handleRealtimeTaskAssigned);
    socket.on('task_updated_realtime', handleRealtimeTaskUpdated);

    return () => {
      socket.off('task_assigned_realtime', handleRealtimeTaskAssigned);
      socket.off('task_updated_realtime', handleRealtimeTaskUpdated);
    };
  }, [user, currentOrganization, fetchDashboardData]);

  if (loading) {
    return <Loader text="Loading dashboard..." />;
  }

  const stats = [
    {
      label: 'Total Projects',
      value: analytics?.overview?.totalProjects || 0,
      icon: HiOutlineFolder,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'Total Tasks',
      value: analytics?.overview?.totalTasks || 0,
      icon: HiOutlineClipboardList,
      color: 'bg-green-100 text-green-600'
    },
    {
      label: 'Team Members',
      value: analytics?.overview?.totalMembers || 0,
      icon: HiOutlineUsers,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      label: 'Overdue Tasks',
      value: analytics?.overview?.overdueTasks || 0,
      icon: HiOutlineExclamation,
      color: 'bg-red-100 text-red-600'
    }
  ];

  const getStatusColor = (status) => {
    const statusColors = {
      todo: 'bg-secondary-100 text-secondary-700',
      in_progress: 'bg-blue-100 text-blue-700',
      review: 'bg-yellow-100 text-yellow-700',
      done: 'bg-green-100 text-green-700'
    };

    return statusColors[status] || statusColors.todo;
  };

  return (
    <div className="dashboard-page space-y-6">
      <div className="dashboard-header">
        <h1 className="dashboard-title text-2xl font-bold text-secondary-900">
          Welcome back, {user?.fullName?.split(' ')[0]}!
        </h1>

        <p className="dashboard-subtitle text-secondary-500 mt-1">
          Here&apos;s what&apos;s happening in {currentOrganization?.name}
        </p>
      </div>

      <div className="dashboard-stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="dashboard-stat-card flex items-center gap-4">
            <div
              className={`dashboard-stat-icon w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}
            >
              <stat.icon className="w-6 h-6" />
            </div>

            <div className="dashboard-stat-content">
              <p className="dashboard-stat-value text-2xl font-bold text-secondary-900">
                {stat.value}
              </p>
              <p className="dashboard-stat-label text-sm text-secondary-500">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="dashboard-content-grid grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="dashboard-main-column lg:col-span-2">
          <Card className="dashboard-tasks-card">
            <CardHeader className="dashboard-card-header flex items-center justify-between">
              <CardTitle className="dashboard-card-title">My Tasks</CardTitle>

              <Link
                to="/my-tasks"
                className="dashboard-card-link text-sm text-primary-600 hover:text-primary-700"
              >
                View all
              </Link>
            </CardHeader>

            <CardContent className="dashboard-card-content">
              {recentTasks.length > 0 ? (
                <div className="dashboard-task-list space-y-3">
                  {recentTasks.map((task) => (
                    <Link
                      key={task._id}
                      to={`/tasks/${task._id}`}
                      className="dashboard-task-link flex items-center justify-between p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
                    >
                      <div className="dashboard-task-left flex items-center gap-3 min-w-0">
                        <span className="dashboard-task-key text-xs font-mono text-secondary-500">
                          {task.key}
                        </span>

                        <span className="dashboard-task-title text-sm font-medium text-secondary-900 truncate">
                          {task.title}
                        </span>
                      </div>

                      <div className="dashboard-task-right flex items-center gap-2 flex-shrink-0">
                        <Badge
                          size="sm"
                          className={TASK_PRIORITIES[task.priority]?.color}
                        >
                          {task.priority}
                        </Badge>

                        <Badge size="sm" className={getStatusColor(task.status)}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="dashboard-empty-state text-center py-8 text-secondary-500">
                  <HiOutlineClipboardList className="dashboard-empty-icon w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="dashboard-empty-text">No tasks assigned to you yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="dashboard-side-column">
          <Card className="dashboard-status-card">
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">Tasks by Status</CardTitle>
            </CardHeader>

            <CardContent className="dashboard-card-content">
              <div className="dashboard-status-list space-y-4">
                {analytics?.tasksByStatus?.map((item) => {
                  const totalTasks = analytics?.overview?.totalTasks || 1;
                  const percentage = Math.round((item.count / totalTasks) * 100);

                  return (
                    <div key={item._id} className="dashboard-status-item">
                      <div className="dashboard-status-row flex items-center justify-between text-sm mb-1">
                        <span className="dashboard-status-name text-secondary-600 capitalize">
                          {item._id?.replace('_', ' ') || 'Unknown'}
                        </span>

                        <span className="dashboard-status-count font-medium text-secondary-900">
                          {item.count}
                        </span>
                      </div>

                      <div className="dashboard-status-track w-full bg-secondary-200 rounded-full h-2">
                        <div
                          className={`dashboard-status-fill h-2 rounded-full transition-all ${
                            item._id === 'done'
                              ? 'bg-green-500'
                              : item._id === 'in_progress'
                                ? 'bg-blue-500'
                                : item._id === 'review'
                                  ? 'bg-yellow-500'
                                  : 'bg-secondary-400'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-activity-card mt-6">
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">Recent Activity</CardTitle>
            </CardHeader>

            <CardContent className="dashboard-card-content">
              {analytics?.recentActivity?.length > 0 ? (
                <div className="dashboard-activity-list space-y-4">
                  {analytics.recentActivity.slice(0, 5).map((activity, index) => (
                    <div
                      key={index}
                      className="dashboard-activity-item flex items-start gap-3"
                    >
                      <Avatar
                        src={activity.user?.avatar}
                        name={activity.user?.fullName}
                        size="sm"
                      />

                      <div className="dashboard-activity-content min-w-0">
                        <p className="dashboard-activity-text text-sm text-secondary-900">
                          <span className="dashboard-activity-user font-medium">
                            {activity.user?.fullName}
                          </span>{' '}
                          {activity.action}{' '}
                          <span className="dashboard-activity-target text-primary-600">
                            {activity.metadata?.taskKey || activity.metadata?.projectName}
                          </span>
                        </p>

                        <p className="dashboard-activity-time text-xs text-secondary-500">
                          {getRelativeTime(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="dashboard-activity-empty text-center text-secondary-500 py-4">
                  No recent activity
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;