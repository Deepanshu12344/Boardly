import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, FolderOpen, ArrowRight } from 'lucide-react';

const Projects = ({ projects, onUpdateProjects }) => {
  const navigate = useNavigate();

  const handleViewProject = (project) => {
    // Debug: Log the entire project object
    console.log('Full project object:', project);
    console.log('project.id:', project.id);
    console.log('project._id:', project._id);
    console.log('All project keys:', Object.keys(project));
    
    // Try different possible ID fields
    const projectId = project.id || project._id || project.projectId;
    
    if (!projectId) {
      console.error('No valid project ID found in:', project);
      alert('Error: Project ID not found');
      return;
    }
    
    console.log('Navigating to project:', projectId);
    navigate(`/project/${projectId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Projects Yet</h3>
        <p className="text-gray-600 mb-6">
          Create your first project to start organizing your tasks and workflows.
        </p>
      </div>
    );
  }

  // Debug: Log all projects to see their structure
  console.log('All projects:', projects);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <div
          key={project.id || project._id || index} // Fallback key
          className="bg-white border border-gray-200 rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleViewProject(project)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {project.name}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3">
                {project.description}
              </p>
              {/* Debug: Show the ID in the UI temporarily */}
              {/* <p className="text-xs text-red-500 mt-1">
                Debug - ID: {project.id || project._id || 'No ID found'}
              </p> */}
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0" />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(project.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>You</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="text-blue-600 font-medium">View Details</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Projects;