import React from 'react';
import './Avatar.css';
import { getInitials, getAvatarColor } from '../../utils/helpers';

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg'
};

const Avatar = ({
  src,
  name,
  size = 'md',
  className = '',
  showStatus = false,
  status = 'offline'
}) => {
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500'
  };

  return (
    <div className={`avatar-wrapper relative inline-flex ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className={`avatar-image ${sizes[size]} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`avatar-fallback ${sizes[size]} ${getAvatarColor(
            name
          )} rounded-full flex items-center justify-center text-white font-medium`}
        >
          {getInitials(name)}
        </div>
      )}

      {showStatus && (
        <span
          className={`avatar-status absolute bottom-0 right-0 block rounded-full ring-2 ring-white ${
            statusColors[status]
          } ${size === 'xs' || size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'}`}
        />
      )}
    </div>
  );
};

export const AvatarGroup = ({ users, max = 4, size = 'sm' }) => {
  const displayUsers = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="avatar-group flex -space-x-2">
      {displayUsers.map((user, index) => (
        <Avatar
          key={user._id || index}
          src={user.avatar}
          name={user.fullName}
          size={size}
          className="avatar-group-item ring-2 ring-white"
        />
      ))}

      {remaining > 0 && (
        <div
          className={`avatar-group-more ${sizes[size]} bg-secondary-200 text-secondary-600 rounded-full flex items-center justify-center font-medium ring-2 ring-white`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default Avatar;