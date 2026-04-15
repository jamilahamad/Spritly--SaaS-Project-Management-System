import React from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineClipboardCheck,
  HiOutlineChatAlt2,
  HiOutlineUserAdd,
  HiOutlineAtSymbol,
  HiOutlineRefresh,
  HiOutlineCheckCircle
} from 'react-icons/hi';
import './NotificationItem.css';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { getRelativeTime } from '../../utils/helpers';

const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
  onAcceptInvite,
  acceptingInvite
}) => {
  const icons = {
    task_assigned: HiOutlineClipboardCheck,
    comment_added: HiOutlineChatAlt2,
    task_updated: HiOutlineRefresh,
    mention: HiOutlineAtSymbol,
    member_added: HiOutlineUserAdd,
    organization_invite: HiOutlineUserAdd,
    invite_accepted: HiOutlineCheckCircle
  };

  const Icon = icons[notification.type] || HiOutlineClipboardCheck;

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification._id);
    }
  };

  const isInvite = notification.type === 'organization_invite';
  const canAcceptInvite =
    isInvite && !notification.read && notification.relatedMember;

  return (
    <div
      className={`notification-item flex gap-3 p-4 border-b border-secondary-100 transition-colors ${
        notification.read ? 'bg-white' : 'bg-primary-50'
      } hover:bg-secondary-50`}
    >
      <div className="notification-item-visual flex-shrink-0">
        {notification.relatedUser ? (
          <Avatar
            src={notification.relatedUser.avatar}
            name={notification.relatedUser.fullName}
            size="sm"
          />
        ) : (
          <div className="notification-item-icon-wrapper w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <Icon className="notification-item-icon w-4 h-4 text-primary-600" />
          </div>
        )}
      </div>

      <div className="notification-item-content flex-1 min-w-0">
        <Link
          to={notification.link || '#'}
          onClick={handleClick}
          className="notification-item-link block"
        >
          <p className="notification-item-title text-sm font-medium text-secondary-900">
            {notification.title}
          </p>

          <p className="notification-item-message text-sm text-secondary-600 mt-0.5 line-clamp-2">
            {notification.message}
          </p>

          <p className="notification-item-time text-xs text-secondary-400 mt-1">
            {getRelativeTime(notification.createdAt)}
          </p>
        </Link>

        {canAcceptInvite && (
          <div className="notification-item-actions mt-3">
            <Button
              size="sm"
              onClick={() => onAcceptInvite(notification)}
              loading={acceptingInvite === notification._id}
              className="notification-item-accept-button"
            >
              Accept Invitation
            </Button>
          </div>
        )}
      </div>

      <div className="notification-item-side flex-shrink-0 flex items-start gap-2">
        {!notification.read && (
          <span className="notification-item-unread-dot w-2 h-2 bg-primary-500 rounded-full mt-2" />
        )}

        <button
          type="button"
          onClick={() => onDelete(notification._id)}
          className="notification-item-delete-button p-1 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded"
        >
          <svg
            className="notification-item-delete-icon w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;