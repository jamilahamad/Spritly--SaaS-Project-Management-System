import React, { useState, useEffect, useCallback } from 'react';
import {
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineViewGrid,
  HiOutlineViewList
} from 'react-icons/hi';
import { useOrganization } from '../hooks/useOrganization';
import projectService from '../services/projectService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectModal from '../components/projects/ProjectModal';
import { toast } from 'react-toastify';
import { canManageProjects } from '../utils/helpers';

const Projects = () => {
  const { currentOrganization } = useOrganization();

  const userRole = currentOrganization?.userRole || 'member';
  const canCreateProject = canManageProjects(userRole);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchProjects = useCallback(async () => {
    if (!currentOrganization) {
      return;
    }

    try {
      setLoading(true);
      const response = await projectService.getProjects(currentOrganization._id);
      setProjects(response.data);
    } catch (error) {
      toast.error('Failed to load projects');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentOrganization]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async (projectData) => {
    try {
      setCreating(true);
      await projectService.createProject(projectData);
      setShowCreateModal(false);
      fetchProjects();
    } catch (error) {
      // Error handled in service
    } finally {
      setCreating(false);
    }
  };

  const filteredProjects = projects.filter((project) => {
    return (
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.key.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (loading) {
    return <Loader text="Loading projects..." />;
  }

  return (
    <div className="projects-page space-y-6">
      <div className="projects-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="projects-header-content">
          <h1 className="projects-title text-2xl font-bold text-secondary-900">
            Projects
          </h1>

          <p className="projects-subtitle text-secondary-500 mt-1">
            {projects.length} project{projects.length !== 1 ? 's' : ''} in{' '}
            {currentOrganization?.name}
          </p>
        </div>

        {canCreateProject && (
          <Button
            onClick={() => setShowCreateModal(true)}
            icon={HiOutlinePlus}
            className="projects-create-button"
          >
            New Project
          </Button>
        )}
      </div>

      {projects.length > 0 && (
        <div className="projects-filters flex flex-col sm:flex-row items-center gap-4">
          <div className="projects-search w-full sm:w-72">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects..."
              icon={HiOutlineSearch}
            />
          </div>

          <div className="projects-view-toggle flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`projects-view-button p-2 rounded-lg ${
                viewMode === 'grid'
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-secondary-500 hover:bg-secondary-100'
              }`}
            >
              <HiOutlineViewGrid className="projects-view-icon w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`projects-view-button p-2 rounded-lg ${
                viewMode === 'list'
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-secondary-500 hover:bg-secondary-100'
              }`}
            >
              <HiOutlineViewList className="projects-view-icon w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {filteredProjects.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'projects-list space-y-4'
          }
        >
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : projects.length > 0 ? (
        <EmptyState
          title="No projects found"
          description="Try adjusting your search terms"
        />
      ) : (
        <EmptyState
          icon={HiOutlinePlus}
          title="No projects yet"
          description={
            canCreateProject
              ? 'Create your first project to start managing tasks'
              : 'No projects are available yet'
          }
          actionLabel={canCreateProject ? 'Create Project' : undefined}
          onAction={canCreateProject ? () => setShowCreateModal(true) : undefined}
        />
      )}

      {canCreateProject && (
        <ProjectModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateProject}
          loading={creating}
        />
      )}
    </div>
  );
};

export default Projects;