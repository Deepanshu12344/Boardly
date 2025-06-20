import React from 'react';
import { Circle, CheckCircle, Clock, AlertCircle, Trash2, Calendar, User, FolderOpen } from 'lucide-react';
import TaskCard from './TaskCard';

const TaskColumn = ({ status, tasks, projects, onTaskStatusChange, onTaskDelete }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'Done':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'In Progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'In Discussion':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'Done':
        return 'border-green-200';
      case 'In Progress':
        return 'border-blue-200';
      case 'In Discussion':
        return 'border-yellow-200';
      default:
        return 'border-gray-200';
    }
  };

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-2 ${getStatusColor()} border-white/20 p-4 min-h-[500px]`}>
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <h3 className="font-semibold text-gray-900">{status}</h3>
        </div>
        <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Circle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No tasks</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              projects={projects}
              onStatusChange={onTaskStatusChange}
              onDelete={onTaskDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskColumn;