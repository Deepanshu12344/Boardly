import User from "../models/User";

export const getMyProfile = async(request, response) => {
    try {
        const user = await User.findById(request.user.id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        request.status(500).send("Internal Server Error");
    }
};

export const getAllUsers = async (request, response) => {
  try {
    const users = await User.find().select('name email');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err });
  }
};