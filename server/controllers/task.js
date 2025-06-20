import Task from "../models/Task.js";

export const createTask = async(request, response) => {
    try {
        const {project, name, description, status, tags, dueDate, assignedTo} = request.body;
        if(!project || !name) return response.status(400).send("project and task name is required");

        const task = new Task({
            project, name, description, status, tags, dueDate, assignedTo
        });
        const savedTask = await task.save();
        res.status(201).json(savedTask);
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
        if (!task) return res.status(404).send("Task not found");
        res.status(200).json(task);
    } catch (error) {
        console.log(error);
        response.status(500).send("Internal Server Error");
    }
};

export const updateTask = async(request, response) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
        req.params.taskId,
        req.body,
        { new: true, runValidators: true }
        );
        if (!updatedTask) return res.status(404).send("Task not found");
        res.status(200).json(updatedTask);
    } catch (error) {
        console.log(error);
        response.status(500).send("Internal Server Error");
    }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.taskId);
    if (!task) return res.status(404).send("Task not found");
    res.status(200).send("Task deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { status },
      { new: true }
    );
    if (!task) return res.status(404).send("Task not found");
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
