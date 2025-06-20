// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Calendar, User, Plus, CheckCircle, Clock, AlertCircle, Circle } from 'lucide-react';
// import { useAuth } from '../../contexts/AuthContext';
// import CreateTaskModal from '../Tasks/CreateTaskModal';

// const ProjectDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [project, setProject] = useState(null);
//   const [tasks, setTasks] = useState([]);
//   const [showCreateTask, setShowCreateTask] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadProjectData();
//   }, [id]);

//   const loadProjectData = () => {
//     const projects = JSON.parse(localStorage.getItem('projects') || '[]');
//     const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    
//     const foundProject = projects.find(p => p.id === id);
//     const projectTasks = allTasks.filter(t => t.projectId === id);
    
//     setProject(foundProject);
//     setTasks(projectTasks);
//     setLoading(false);
//   };

//   const handleCreateTask = (taskData) => {
//     const newTask = {
//       id: Date.now().toString(),
//       ...taskData,
//       projectId: id,
//       createdBy: user.id,
//       createdAt: new Date().toISOString()
//     };
    
//     const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
//     const updatedTasks = [...allTasks, newTask];
//     localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    
//     setTasks(prevTasks => [...prevTasks, newTask]);
//     setShowCreateTask(false);
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'Done':
//         return <CheckCircle className="w-5 h-5 text-green-500" />;
//       case 'In Progress':
//         return <Clock className="w-5 h-5 text-blue-500" />;
//       case 'In Discussion':
//         return <AlertCircle className="w-5 h-5 text-yellow-500" />;
//       default:
//         return <Circle className="w-5 h-5 text-gray-400" />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Done':
//         return 'bg-green-100 text-green-800 border-green-200';
//       case 'In Progress':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'In Discussion':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (!project) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
//           <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
//           <button
//             onClick={() => navigate('/dashboard')}
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
//           >
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
//       {/* Header */}
//       <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center h-16">
//             <button
//               onClick={() => navigate('/dashboard')}
//               className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mr-4"
//             >
//               <ArrowLeft className="w-5 h-5" />
//               <span>Back to Dashboard</span>
//             </button>
//             <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Project Info */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 mb-8">
//           <div className="flex justify-between items-start mb-4">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h2>
//               <p className="text-gray-600">{project.description}</p>
//             </div>
//             <button
//               onClick={() => setShowCreateTask(true)}
//               className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] shadow-lg"
//             >
//               <Plus className="w-4 h-4" />
//               <span>Add Task</span>
//             </button>
//           </div>
          
//           <div className="flex items-center space-x-6 text-sm text-gray-500">
//             <div className="flex items-center space-x-2">
//               <Calendar className="w-4 h-4" />
//               <span>Created {formatDate(project.createdAt)}</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <User className="w-4 h-4" />
//               <span>Created by You</span>
//             </div>
//           </div>
//         </div>

//         {/* Tasks Section */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
//           <h3 className="text-xl font-semibold text-gray-900 mb-6">
//             Tasks ({tasks.length})
//           </h3>

//           {tasks.length === 0 ? (
//             <div className="text-center py-12">
//               <Circle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <h4 className="text-lg font-medium text-gray-900 mb-2">No Tasks Yet</h4>
//               <p className="text-gray-600 mb-4">
//                 Create your first task to start tracking project progress.
//               </p>
//               <button
//                 onClick={() => setShowCreateTask(true)}
//                 className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
//               >
//                 Add First Task
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {tasks.map((task) => (
//                 <div
//                   key={task.id}
//                   className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
//                 >
//                   <div className="flex items-start justify-between mb-3">
//                     <div className="flex items-start space-x-3">
//                       {getStatusIcon(task.status)}
//                       <div>
//                         <h4 className="font-medium text-gray-900">{task.name}</h4>
//                         <p className="text-sm text-gray-600 mt-1">{task.description}</p>
//                       </div>
//                     </div>
//                     <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
//                       {task.status}
//                     </span>
//                   </div>
                  
//                   <div className="flex items-center justify-between text-sm text-gray-500">
//                     <div className="flex items-center space-x-4">
//                       {task.dueDate && (
//                         <span>Due: {formatDate(task.dueDate)}</span>
//                       )}
//                       {task.assignedTo && (
//                         <span>Assigned to: {task.assignedTo}</span>
//                       )}
//                     </div>
//                     {task.tags && task.tags.length > 0 && (
//                       <div className="flex space-x-1">
//                         {task.tags.map((tag, index) => (
//                           <span
//                             key={index}
//                             className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
//                           >
//                             {tag}
//                           </span>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Create Task Modal */}
//       {showCreateTask && (
//         <CreateTaskModal
//           onClose={() => setShowCreateTask(false)}
//           onSubmit={handleCreateTask}
//           projectId={id}
//           projectName={project.name}
//         />
//       )}
//     </div>
//   );
// };

// export default ProjectDetails;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Plus, CheckCircle, Clock, AlertCircle, Circle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import CreateTaskModal from '../Tasks/CreateTaskModal';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjectData();
  }, [id]);

  const loadProjectData = () => {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    const foundProject = projects.find(p => p.id === id);
    const projectTasks = allTasks.filter(t => t.projectId === id);

    setProject(foundProject);
    setTasks(projectTasks);
    setLoading(false);
  };

  const handleCreateTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      projectId: id,
      createdBy: user.id,
      createdAt: new Date().toISOString()
    };

    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const updatedTasks = [...allTasks, newTask];
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    setTasks(prevTasks => [...prevTasks, newTask]);
    setShowCreateTask(false);
  };

  const getStatusIcon = (status) => {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Discussion':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/dashboard')}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h2>
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
              <span>Created by You</span>
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
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Tasks Yet</h4>
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
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(task.status)}
                      <div>
                        <h4 className="font-medium text-gray-900">{task.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      {task.dueDate && (
                        <span>Due: {formatDate(task.dueDate)}</span>
                      )}
                      {task.assignedTo && (
                        <span>Assigned to: {task.assignedTo}</span>
                      )}
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
