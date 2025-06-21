import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Backlog', 'In Discussion', 'In Progress', 'Done'],
      default: 'Backlog',
    },
    tags: [String],
    dueDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);
