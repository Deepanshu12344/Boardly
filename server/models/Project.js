import mongoose from 'mongoose';
import Task from './Task.js';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

projectSchema.pre('remove', async function (next) {
  await Task.deleteMany({ project: this._id });
  next();
});

export default mongoose.model('Project', projectSchema);
