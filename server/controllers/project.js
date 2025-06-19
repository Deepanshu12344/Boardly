import Project from "../models/Project";
import Task from "../models/Task";


export const addProject = async(request, response) => {
    try {
        const {name, description} = request.body;
        const userId = request.user?.id;
        if(!userId) return response.status(401).send("Unauthorized");
        if(!name || !description) return response.status(400).send("Name and Description must be provided");
        
        const project = new Project({
            name,
            description,
            owner:userId,
            members:[userId]
        });

        const savedProject = await project.save();
        response.status(201).send(savedProject);
    } catch (error) {
        console.log(error);
        response.status(500).send("Internal Server Error");
    }
};

export const getAllProjects = async(request, response) => {
    try {
        const userId = request.user.id;
        const projects = await Project.find({
      $or: [{ owner: userId }, { members: userId }]
    }).populate('members', 'name email');

    response.status(201).send(projects);
    } catch (error) {
        console.log(error);
        response.status(500).send("Internal Server Error");
    }
};

export const getProjectDetails = async(request, response) => {
    try {
        const {projectId} = request.params;
        const userId = request.user.id;

        const project = await Project.findOne({
            _id:projectId,
            $or: [{owner:userId}, {members:userId}],
        }).populate('members', 'name email');
        
        if(!project) return response.status(404).send("Project not found");

        const tasks = await Task.find({ project: projectId }).populate('assignedTo', 'name email');

        response.status(200).json({project, tasks});
    } catch (error) {
        console.log(error);
        response.status(500).send("Internal Server Error");
    }
}