import React, { useState } from 'react';
import { Calendar, User, FolderOpen, Trash2, MoreVertical } from 'lucide-react';

const TaskCard = ({ task, projects, onStatusChange, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const project = projects.find(p => p.id === task.projectId);
  const statuses = ['Backlog', 'In Discussion', 'In Progress', 'Done'];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 group">
      {/* Task Header */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-gray-900 text-sm leading-snug flex-1 mr-2">
          {task.name}
        </h4>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-all p-1 rounded"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
              <div className="py-1">
                <div className="px-3 py-1 text-xs font-medium text-gray-500 border-b border-gray-100">
                  Move to:
                </div>
                {statuses.filter(s => s !== task.status).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      onStatusChange(task.id, status);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {status}
                  </button>
                ))}
                <div className="border-t border-gray-100 mt-1">
                  <button
                    onClick={() => {
                      onDelete(task.id);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task Description */}
      {task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Task Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{task.tags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Task Footer */}
      <div className="space-y-2">
        {/* Project */}
        {project && (
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <FolderOpen className="w-3 h-3" />
            <span className="truncate">{project.name}</span>
          </div>
        )}

        {/* Due Date & Assigned User */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          {task.dueDate && (
            <div className={`flex items-center space-x-1 ${
              isOverdue(task.dueDate) ? 'text-red-600' : ''
            }`}>
              <Calendar className="w-3 h-3" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
          
          {task.assignedTo && (
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span className="truncate max-w-[80px]">{task.assignedTo}</span>
            </div>
          )}
        </div>
      </div>

      {/* Click overlay to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default TaskCard;