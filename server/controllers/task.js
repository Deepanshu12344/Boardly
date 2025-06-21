import Task from "../models/Task.js";

export const createTask = async(request, response) => {
    try {
        const {project, name, description, status, tags, dueDate, assignedTo} = request.body;
        if(!project || !name) return response.status(400).send("project and task name is requestuired");

        const task = new Task({
            project, name, description, status, tags, dueDate, assignedTo
        });
        const savedTask = await task.save();
        response.status(201).json(savedTask);
    } catch (error) {
        console.log(error);
        response.status(500).send("Internal Server Error");
    }
};

export const getAllTasks = async(request, response) => {
    try {
        const {projectId} = request.query;
        const filter = projectId ? { project: projectId } : {};
        const tasks = await Task.find(filter).populate('assignedTo', 'name email');
        response.status(200).json(tasks)
    } catch (error) {
        console.log(error);
        response.status(500).send("Internal Server Error");
    }
};

export const getTaskById = async(request, response) => {
    try {
        const task = await Task.findById(request.params.taskId).populate('assignedTo', 'name email');
        if (!task) return response.status(404).send("Task not found");
        response.status(200).json(task);
    } catch (error) {
        console.log(error);
        response.status(500).send("Internal Server Error");
    }
};

export const updateTask = async(request, response) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
        request.params.taskId,
        request.body,
        { new: true, runValidators: true }
        );
        if (!updatedTask) return response.status(404).send("Task not found");
        response.status(200).json(updatedTask);
    } catch (error) {
        console.log(error);
        response.status(500).send("Internal Server Error");
    }
};

export const deleteTask = async (request, response) => {
  try {
    const task = await Task.findByIdAndDelete(request.params.taskId);
    if (!task) return response.status(404).send("Task not found");
    response.status(200).send("Task deleted successfully");
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
  }
};

export const updateTaskStatus = async (request, response) => {
  try {
    const { status } = request.body;
    const task = await Task.findByIdAndUpdate(
      request.params.taskId,
      { status },
      { new: true }
    );
    if (!task) return response.status(404).send("Task not found");
    response.status(200).json(task);
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
  }
};
