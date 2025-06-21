import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Circle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import CreateTaskModal from "../Tasks/CreateTaskModal";

const statusConfig = {
  Done: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
  },
  "In Progress": {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: <Clock className="w-5 h-5 text-blue-500" />,
  },
  "In Discussion": {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
  },
  default: {
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: <Circle className="w-5 h-5 text-gray-400" />,
  },
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !user) return;
    loadProjectData(id);
  }, [id, user]);

  const loadProjectData = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8000/api/project/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProject(res.data);
      setTasks(res.data.tasks || []);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        console.error("Error loading project:", err);
      }
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:8000/api/create`,
        {
          ...taskData,
          project: id,
          createdBy: user.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks((prevTasks) => [...prevTasks, res.data]);
      setShowCreateTask(false);
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  const getStatusIcon = (status) =>
    statusConfig[status]?.icon || statusConfig.default.icon;

  const getStatusColor = (status) =>
    statusConfig[status]?.color || statusConfig.default.color;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Project Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The project you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Info */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {project.name}
              </h2>
              <p className="text-gray-600">{project.description}</p>
            </div>
            <button
              onClick={() => setShowCreateTask(true)}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Created {formatDate(project.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Created by {project.owner?.name || "Unassigned"}</span>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Tasks ({tasks.length})
          </h3>

          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <Circle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No Tasks Yet
              </h4>
              <p className="text-gray-600 mb-4">
                Create your first task to start tracking project progress.
              </p>
              <button
                onClick={() => setShowCreateTask(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Add First Task
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedTasks.map((task) => (
                <div
                  key={task.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(task.status)}
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {task.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {task.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      {task.dueDate && (
                        <span>Due: {formatDate(task.dueDate)}</span>
                      )}
                      {/* {task.assignedTo && (
                        <span>Assigned to: {task.assignedTo}</span>
                      )} */}
                    </div>
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex space-x-1">
                        {task.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateTask && (
        <CreateTaskModal
          onClose={() => setShowCreateTask(false)}
          onSubmit={handleCreateTask}
          projectId={id}
          projectName={project.name}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
