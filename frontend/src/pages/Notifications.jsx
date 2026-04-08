import React, { useState } from 'react';
import { HiOutlineBell, HiOutlineCheck, HiOutlineTrash } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNotifications } from '../hooks/useNotifications';
import { useOrganization } from '../hooks/useOrganization';
import organizationService from '../services/organizationService';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import NotificationItem from '../components/notifications/NotificationItem';
import Loader from '../components/common/Loader';

const Notifications = () => {
  const navigate = useNavigate();
  const { refreshOrganizations } = useOrganization();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    fetchNotifications
  } = useNotifications();

  const [acceptingInvite, setAcceptingInvite] = useState(null);

  const handleAcceptInvite = async (notification) => {
    if (!notification.relatedMember) {
      toast.error('Invitation reference not found');
      return;
    }

    try {
      setAcceptingInvite(notification._id);

      await organizationService.acceptInvitation(notification.relatedMember);
      await markAsRead(notification._id);
      await refreshOrganizations(true);
      await fetchNotifications();

      toast.success('Invitation accepted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept invitation');
    } finally {
      setAcceptingInvite(null);
    }
  };

  if (loading) {
    return <Loader text="Loading notifications..." />;
  }

  return (
    <div className="notifications-page max-w-3xl mx-auto space-y-6">
      <div className="notifications-header flex items-center justify-between">
        <div className="notifications-header-content">
          <h1 className="notifications-title text-2xl font-bold text-secondary-900">
            Notifications
          </h1>

          <p className="notifications-subtitle text-secondary-500 mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="notifications-actions flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={markAllAsRead}
                icon={HiOutlineCheck}
              >
                Mark all read
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllNotifications}
              icon={HiOutlineTrash}
            >
              Clear read
            </Button>
          </div>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="notifications-list-wrapper bg-white rounded-lg shadow-soft border border-secondary-100 overflow-hidden">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
              onAcceptInvite={handleAcceptInvite}
              acceptingInvite={acceptingInvite}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={HiOutlineBell}
          title="No notifications"
          description="You're all caught up! Check back later for updates."
        />
      )}
    </div>
  );
};

export default Notifications;