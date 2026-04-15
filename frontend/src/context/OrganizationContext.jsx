import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

export const OrganizationContext = createContext(null);

export const OrganizationProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  const [organizations, setOrganizations] = useState([]);
  const [currentOrganization, setCurrentOrganization] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const normalizeMembers = (membersData) => {
    if (!Array.isArray(membersData)) return [];
    return membersData.filter((member) => member && member.user);
  };

  const fetchOrganizations = useCallback(async (force = false) => {
    const token = localStorage.getItem('token');
    const canFetch = force ? !!token : isAuthenticated;

    if (!canFetch) {
      setOrganizations([]);
      setCurrentOrganization(null);
      setMembers([]);
      setLoading(false);
      setInitialized(false);
      return [];
    }

    try {
      setLoading(true);

      const response = await api.get('/organizations');
      const orgs = response.data.data || [];

      setOrganizations(orgs);

      const savedOrgId = localStorage.getItem('currentOrganization');
      const savedOrg = orgs.find((org) => org._id === savedOrgId);

      if (savedOrg) {
        setCurrentOrganization(savedOrg);
      } else if (orgs.length > 0) {
        setCurrentOrganization(orgs[0]);
        localStorage.setItem('currentOrganization', orgs[0]._id);
      } else {
        setCurrentOrganization(null);
        localStorage.removeItem('currentOrganization');
      }

      return orgs;
    } catch (error) {
      console.error('Error fetching organizations:', error);
      setOrganizations([]);
      setCurrentOrganization(null);
      setMembers([]);
      return [];
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setOrganizations([]);
      setCurrentOrganization(null);
      setMembers([]);
      setLoading(false);
      setInitialized(false);
      return;
    }

    setLoading(true);
    setInitialized(false);
    fetchOrganizations();
  }, [isAuthenticated, fetchOrganizations]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!currentOrganization?._id || !isAuthenticated) {
        setMembers([]);
        return;
      }

      try {
        const response = await api.get(`/organizations/${currentOrganization._id}/members`);
        setMembers(normalizeMembers(response.data.data));
      } catch (error) {
        console.error('Error fetching members:', error);
        setMembers([]);
      }
    };

    fetchMembers();
  }, [currentOrganization, isAuthenticated]);

  const createOrganization = async (orgData) => {
    try {
      setLoading(true);

      const response = await api.post('/organizations', orgData);
      const newOrg = response.data.data;
      const orgWithRole = { ...newOrg, userRole: 'owner' };

      setOrganizations((prev) => [...prev, orgWithRole]);
      setCurrentOrganization(orgWithRole);
      setMembers([]);
      localStorage.setItem('currentOrganization', newOrg._id);
      setInitialized(true);

      toast.success('Organization created successfully!');
      return { success: true, data: newOrg };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create organization';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const switchOrganization = (org) => {
    if (!org?._id) return;
    setCurrentOrganization(org);
    setMembers([]);
    localStorage.setItem('currentOrganization', org._id);
    toast.info(`Switched to ${org.name}`);
  };

  const updateOrganization = async (orgId, updates) => {
    try {
      const response = await api.put(`/organizations/${orgId}`, updates);
      const updated = response.data.data;

      setOrganizations((prev) =>
        prev.map((org) => (org._id === orgId ? { ...updated, userRole: org.userRole } : org))
      );

      if (currentOrganization?._id === orgId) {
        setCurrentOrganization({ ...updated, userRole: currentOrganization.userRole });
      }

      toast.success('Organization updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const inviteMember = async (email, role, team) => {
    if (!currentOrganization?._id) {
      return { success: false, error: 'No organization selected' };
    }

    try {
      await api.post(`/organizations/${currentOrganization._id}/members`, {
        email,
        role,
        team
      });

      const membersResponse = await api.get(
        `/organizations/${currentOrganization._id}/members`
      );

      setMembers(normalizeMembers(membersResponse.data.data));

      toast.success('Member invited successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to invite member';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateMemberRole = async (memberId, role) => {
    if (!currentOrganization?._id) {
      return { success: false, error: 'No organization selected' };
    }

    try {
      const response = await api.put(
        `/organizations/${currentOrganization._id}/members/${memberId}`,
        { role }
      );

      const updatedMember = response.data.data;

      setMembers((prev) =>
        normalizeMembers(
          prev.map((member) => (member._id === memberId ? updatedMember : member))
        )
      );

      toast.success('Member role updated');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const removeMember = async (memberId) => {
    if (!currentOrganization?._id) {
      return { success: false, error: 'No organization selected' };
    }

    try {
      await api.delete(`/organizations/${currentOrganization._id}/members/${memberId}`);
      setMembers((prev) => prev.filter((member) => member._id !== memberId));
      toast.success('Member removed');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove member';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    organizations,
    currentOrganization,
    members,
    loading,
    initialized,
    createOrganization,
    switchOrganization,
    updateOrganization,
    inviteMember,
    updateMemberRole,
    removeMember,
    refreshOrganizations: fetchOrganizations
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};