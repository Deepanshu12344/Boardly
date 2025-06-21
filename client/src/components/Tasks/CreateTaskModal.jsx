import React, { useState } from 'react';
import { X, Plus, Calendar, Tag, FileText } from 'lucide-react';

const CreateTaskModal = ({ onClose, onSubmit, projects, projectId, projectName }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    projectId: projectId || '',
    status: 'Backlog',
    dueDate: '',
    tags: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const statuses = ['Backlog', 'In Discussion', 'In Progress', 'Done'];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Task name is required';
    else if (formData.name.trim().length < 3) newErrors.name = 'Task name must be at least 3 characters';
    if (!formData.description.trim()) newErrors.description = 'Task description is required';
    else if (formData.description.trim().length < 10) newErrors.description = 'Description must be at least 10 characters';
    if (!formData.projectId) newErrors.projectId = 'Please select a project';
    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (selectedDate < today) newErrors.dueDate = 'Due date cannot be in the past';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const taskData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };
      onSubmit(taskData);
    } catch (error) {
      setErrors({ submit: 'Failed to create task. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white/90 backdrop-blur-lg">
          <div className="flex items-center space-x-3">
            {/* <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div> */}
            <h2 className="text-xl font-semibold text-gray-900">
              Create New Task {projectName && `for ${projectName}`}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Name *</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter task name"
                  maxLength={100}
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Describe the task in detail..."
                maxLength={500}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              <p className="mt-1 text-sm text-gray-500">{formData.description.length}/500 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project *</label>
              <select
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                disabled={!!projectId}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.projectId ? 'border-red-500' : 'border-gray-300'} ${projectId ? 'bg-gray-100' : ''}`}
              >
                <option value="">Select a project</option>
                {projects?.map((project) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
              {errors.projectId && <p className="mt-1 text-sm text-red-600">{errors.projectId}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.dueDate ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="frontend, urgent, api (comma separated)"
                  maxLength={100}
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">Separate tags with commas</p>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}
          </div>

          <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
  type="submit"
  disabled={loading}
  className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
>
  {loading ? 'Creating...' : 'Create Task'}
</button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
