import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, FolderOpen, KanbanSquare, Plus, User } from 'lucide-react';
import Projects from '../Projects/Projects';
import TaskBoard from '../Tasks/TaskBoard';
import CreateProjectModal from '../Projects/CreateProjectModal';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('projects');
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

const loadData = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:8000/api/get', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("API Response:", res.data);
    const backendProjects = res.data || [];
    setProjects(backendProjects);
  } catch (err) {
    console.error('Failed to load projects from API:', err);
    setProjects([]);
  }
};


  const handleCreateProject = (projectData) => {
    const newProject = {
      id: Date.now().toString(),
      ...projectData,
      createdBy: user.id,
      createdAt: new Date().toISOString()
    };
    
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setShowCreateProject(false);
  };

  const handleUpdateProjects = (updatedProjects) => {
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  const handleUpdateTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-gray-900">Boardly</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h2>
          <p className="text-gray-600">
            Manage your projects and tasks efficiently in one place.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/50 backdrop-blur-sm p-1 rounded-lg border border-white/20 inline-flex">
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === 'projects'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span>Projects</span>
            </button>
            <button
              onClick={() => setActiveTab('taskboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === 'taskboard'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <KanbanSquare className="w-4 h-4" />
              <span>Task Board</span>
            </button>
          </div>
        </div>

        {/* Create Project Button - Only show on Projects tab */}
        {activeTab === 'projects' && (
          <div className="mb-6">
            <button
              onClick={() => setShowCreateProject(true)}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Project</span>
            </button>
          </div>
        )}

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === 'projects' && (
            <Projects 
              projects={projects}
              onUpdateProjects={handleUpdateProjects}
            />
          )}
          {activeTab === 'taskboard' && (
            <TaskBoard 
              tasks={tasks}
              projects={projects}
              onUpdateTasks={handleUpdateTasks}
            />
          )}
        </div>
      </main>

      {/* Create Project Modal */}
      {showCreateProject && (
        <CreateProjectModal
          onClose={() => setShowCreateProject(false)}
          onSubmit={handleCreateProject}
        />
      )}
    </div>
  );
};

export default Dashboard;