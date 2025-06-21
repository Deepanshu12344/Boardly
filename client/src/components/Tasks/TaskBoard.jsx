import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import TaskColumn from './TaskColumn';
import CreateTaskModal from './CreateTaskModal';

const TaskBoard = ({ tasks, projects, onUpdateTasks }) => {
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');

  const statuses = ['Backlog', 'In Discussion', 'In Progress', 'Done'];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const handleCreateTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      createdAt: new Date().toISOString()
    };
    
    const updatedTasks = [...tasks, newTask];
    onUpdateTasks(updatedTasks);
    setShowCreateTask(false);
  };

  const handleTaskStatusChange = (taskId, newStatus) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    onUpdateTasks(updatedTasks);
  };

  const handleTaskDelete = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    onUpdateTasks(updatedTasks);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Task Board</h2>
          <p className="text-gray-600">Manage all your tasks across projects</p>
        </div>
        <button
  onClick={() => setShowCreateTask(true)}
  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md"
>
  <Plus className="w-4 h-4" />
  <span>Add Task</span>
</button>

      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statuses.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={getTasksByStatus(status)}
            projects={projects}
            onTaskStatusChange={handleTaskStatusChange}
            onTaskDelete={handleTaskDelete}
          />
        ))}
      </div>

      {/* Create Task Modal */}
      {showCreateTask && (
        <CreateTaskModal
          onClose={() => setShowCreateTask(false)}
          onSubmit={handleCreateTask}
          projects={projects}
        />
      )}
    </div>
  );
};

export default TaskBoard;