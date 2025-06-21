import Project from "../models/Project.js";
import Task from "../models/Task.js";
import mongoose from "mongoose";

export const addProject = async (request, response) => {
  try {
    const { name, description } = request.body;
    const userId = request.user?.id;
    if (!userId) return response.status(401).send("Unauthorized");
    if (!name || !description)
      return response.status(400).send("Name and Description must be provided");

    const project = new Project({
      name,
      description,
      owner: userId,
      members: [userId],
    });

    const savedProject = await project.save();
    response.status(201).send(savedProject);
  } catch (error) {
    console.log(error);
    response.status(500).send("Internal Server Error");
  }
};

export const getAllProjects = async (request, response) => {
  try {
    const userId = request.user.id;
    const projects = await Project.find({
      $or: [{ owner: userId }, { members: userId }],
    }).populate("members", "name email");

    response.status(201).send(projects);
  } catch (error) {
    console.log(error);
    response.status(500).send("Internal Server Error");
  }
};

export const getProjectDetails = async (request, response) => {
  try {
    const { projectId } = request.params;
    const userId = request.user.id;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return response.status(400).send("Invalid project ID");
    }

    const project = await Project.findOne({
      _id: projectId,
      $or: [{ owner: userId }, { members: userId }],
    })
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!project) return response.status(404).send("Project not found");

    const tasks = await Task.find({ project: projectId }).populate(
      "assignedTo",
      "name email"
    );

    response.status(200).json({ ...project.toObject(), tasks });
  } catch (error) {
    console.log(error);
    response.status(500).send("Internal Server Error");
  }
};

export const deleteProject = async (request, response) => {
  try {
    const { projectId } = request.params;
    const userId = request.user.id;

    const project = await Project.findOne({ _id: projectId });

    if (!project) return response.status(404).send("Project not found");
    if (project.owner.toString() !== userId)
      return response
        .status(403)
        .send("Only the owner can delete this project");

    await Project.remove();
    response.status(200).send("Project and its tasks deleted");
  } catch (error) {
    console.log(error);
    response.status(500).send("Internal Server Error");
  }
};

export const updateProject = async (request, response) => {
  try {
    const { projectId } = request.params;
    const { name, description } = request.body;
    const userId = request.user.id;

    const project = await Project.findOne({ _id: projectId });

    if (!project) return response.status(404).send("Project not found");
    if (project.owner.toString() !== userId)
      return response
        .status(403)
        .send("Only the owner can update this project");

    project.name = name || project.name;
    project.description = description || project.description;

    const updated = await project.save();
    response.status(200).json(updated);
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
  }
};
