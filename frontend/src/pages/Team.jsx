import React, { useState } from 'react';
import {
  HiOutlineUserAdd,
  HiOutlineMail,
  HiOutlineDotsVertical,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSearch
} from 'react-icons/hi';
import './Team.css';
import { useOrganization } from '../hooks/useOrganization';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import Dropdown, { DropdownItem, DropdownDivider } from '../components/common/Dropdown';
import EmptyState from '../components/common/EmptyState';
import { USER_ROLES } from '../utils/constants';
import { formatDate, canManageOrganization } from '../utils/helpers';

const Team = () => {
  const {
    members,
    currentOrganization,
    inviteMember,
    updateMemberRole,
    removeMember
  } = useOrganization();

  const [search, setSearch] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'member',
    team: ''
  });
  const [inviting, setInviting] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const userRole = currentOrganization?.userRole || 'member';
  const canManageTeam = canManageOrganization(userRole);

  const safeMembers = Array.isArray(members)
    ? members.filter((member) => member && member.user)
    : [];

  const filteredMembers = safeMembers.filter((member) => {
    const fullName = member.user?.fullName || '';
    const email = member.user?.email || '';
    const query = search.toLowerCase();

    return (
      fullName.toLowerCase().includes(query) ||
      email.toLowerCase().includes(query)
    );
  });

  const handleInvite = async (event) => {
    event.preventDefault();

    if (!canManageTeam) {
      return;
    }

    setInviting(true);

    const result = await inviteMember(inviteData.email, inviteData.role, inviteData.team);

    if (result.success) {
      setShowInviteModal(false);
      setInviteData({
        email: '',
        role: 'member',
        team: ''
      });
    }

    setInviting(false);
  };

  const handleRoleChange = async (memberId, newRole) => {
    if (!canManageTeam) {
      return;
    }

    await updateMemberRole(memberId, newRole);
    setEditingMember(null);
  };

  const handleRemoveMember = async (memberId) => {
    if (!canManageTeam) {
      return;
    }

    const confirmed = window.confirm('Are you sure you want to remove this member?');

    if (!confirmed) {
      return;
    }

    await removeMember(memberId);
  };

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'project_manager', label: 'Project Manager' },
    { value: 'member', label: 'Member' },
    { value: 'guest', label: 'Guest' }
  ];

  const teamOptions = [
    { value: '', label: 'No Team' },
    { value: 'development', label: 'Development' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'operations', label: 'Operations' }
  ];

  return (
    <div className="team-page space-y-6">
      <div className="team-header flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="team-header-content">
          <h1 className="team-title text-2xl font-bold text-secondary-900">
            Team
          </h1>

          <p className="team-subtitle mt-1 text-secondary-500">
            Manage members in {currentOrganization?.name}
          </p>
        </div>

        {canManageTeam && (
          <Button
            onClick={() => setShowInviteModal(true)}
            icon={HiOutlineUserAdd}
            className="team-invite-button"
          >
            Invite Member
          </Button>
        )}
      </div>

      <div className="team-search w-full sm:w-72">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search members..."
          icon={HiOutlineSearch}
        />
      </div>

      {filteredMembers.length > 0 ? (
        <div className="team-table-wrapper overflow-hidden rounded-lg border border-secondary-100 bg-white shadow-soft">
          <table className="team-table w-full">
            <thead className="team-table-head border-b border-secondary-200 bg-secondary-50">
              <tr>
                <th className="team-table-heading px-6 py-3 text-left text-sm font-medium text-secondary-700">
                  Member
                </th>
                <th className="team-table-heading px-6 py-3 text-left text-sm font-medium text-secondary-700">
                  Role
                </th>
                <th className="team-table-heading px-6 py-3 text-left text-sm font-medium text-secondary-700">
                  Team
                </th>
                <th className="team-table-heading px-6 py-3 text-left text-sm font-medium text-secondary-700">
                  Status
                </th>
                <th className="team-table-heading px-6 py-3 text-left text-sm font-medium text-secondary-700">
                  Joined
                </th>
                <th className="team-table-heading w-10"></th>
              </tr>
            </thead>

            <tbody className="team-table-body divide-y divide-secondary-100">
              {filteredMembers.map((member) => {
                const role = USER_ROLES[member.role];

                return (
                  <tr key={member._id} className="team-table-row hover:bg-secondary-50">
                    <td className="team-table-cell px-6 py-4">
                      <div className="team-member-info flex items-center gap-3">
                        <Avatar
                          src={member.user?.avatar}
                          name={member.user?.fullName || 'Unnamed User'}
                          size="md"
                        />

                        <div className="team-member-text">
                          <p className="team-member-name font-medium text-secondary-900">
                            {member.user?.fullName || 'Unnamed User'}
                          </p>
                          <p className="team-member-email text-sm text-secondary-500">
                            {member.user?.email || 'No email'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="team-table-cell px-6 py-4">
                      {editingMember === member._id ? (
                        <Select
                          value={member.role}
                          onChange={(event) =>
                            handleRoleChange(member._id, event.target.value)
                          }
                          options={roleOptions}
                          className="team-role-select w-40"
                        />
                      ) : (
                        <Badge className={role?.color}>
                          {role?.label || member.role}
                        </Badge>
                      )}
                    </td>

                    <td className="team-table-cell px-6 py-4 text-sm text-secondary-600">
                      {member.team || '-'}
                    </td>

                    <td className="team-table-cell px-6 py-4">
                      <Badge
                        variant={member.status === 'active' ? 'success' : 'warning'}
                        dot
                      >
                        {member.status}
                      </Badge>
                    </td>

                    <td className="team-table-cell px-6 py-4 text-sm text-secondary-600">
                      {formatDate(member.createdAt)}
                    </td>

                    <td className="team-table-cell px-6 py-4">
                      {canManageTeam && member.role !== 'owner' && (
                        <Dropdown
                          trigger={
                            <button
                              type="button"
                              className="team-row-menu-button rounded-lg p-2 text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700"
                            >
                              <HiOutlineDotsVertical className="team-row-menu-icon h-4 w-4" />
                            </button>
                          }
                          position="bottom-right"
                        >
                          <DropdownItem
                            icon={HiOutlinePencil}
                            onClick={() => setEditingMember(member._id)}
                          >
                            Change Role
                          </DropdownItem>

                          <DropdownDivider />

                          <DropdownItem
                            icon={HiOutlineTrash}
                            danger
                            onClick={() => handleRemoveMember(member._id)}
                          >
                            Remove
                          </DropdownItem>
                        </Dropdown>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={HiOutlineUserAdd}
          title="No team members yet"
          description={
            canManageTeam
              ? 'Invite your team members to start collaborating'
              : 'No team members found'
          }
          actionLabel={canManageTeam ? 'Invite Member' : undefined}
          onAction={canManageTeam ? () => setShowInviteModal(true) : undefined}
        />
      )}

      {canManageTeam && (
        <Modal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          title="Invite Team Member"
        >
          <form onSubmit={handleInvite} className="team-invite-form">
            <div className="team-invite-fields space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={inviteData.email}
                onChange={(event) =>
                  setInviteData((prevInviteData) => ({
                    ...prevInviteData,
                    email: event.target.value
                  }))
                }
                placeholder="colleague@example.com"
                icon={HiOutlineMail}
                required
              />

              <Select
                label="Role"
                value={inviteData.role}
                onChange={(event) =>
                  setInviteData((prevInviteData) => ({
                    ...prevInviteData,
                    role: event.target.value
                  }))
                }
                options={roleOptions}
              />

              <Select
                label="Team (optional)"
                value={inviteData.team}
                onChange={(event) =>
                  setInviteData((prevInviteData) => ({
                    ...prevInviteData,
                    team: event.target.value
                  }))
                }
                options={teamOptions}
              />
            </div>

            <div className="team-invite-actions mt-6 flex justify-end gap-3 border-t border-secondary-200 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowInviteModal(false)}
              >
                Cancel
              </Button>

              <Button type="submit" loading={inviting}>
                Send Invite
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Team;