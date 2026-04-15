const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    default: ''
  },
  taskNumber: {
    type: Number
  },
  key: {
    type: String,
    uppercase: true
    // Format: PROJECTKEY-123
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  type: {
    type: String,
    enum: ['task', 'bug', 'story', 'epic'],
    default: 'task'
  },
  labels: [{
    type: String,
    trim: true
  }],
  dueDate: {
    type: Date,
    default: null
  },
  estimatedHours: {
    type: Number,
    default: null
  },
  attachments: [{
    name: String,
    url: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  subtasks: [{
    title: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for performance
taskSchema.index({ project: 1, taskNumber: 1 }, { unique: true });
taskSchema.index({ organization: 1 });
taskSchema.index({ assignee: 1 });
taskSchema.index({ status: 1 });

// Auto-generate taskNumber and key before validation
taskSchema.pre('validate', async function(next) {
  try {
    if (!this.isNew) {
      return next();
    }

    if (!this.taskNumber || !this.key) {
      const lastTask = await this.constructor
        .findOne({ project: this.project })
        .sort({ taskNumber: -1 });

      this.taskNumber = lastTask ? lastTask.taskNumber + 1 : 1;

      const project = await mongoose.model('Project').findById(this.project);

      if (!project) {
        return next(new Error('Project not found while generating task key'));
      }

      this.key = `${project.key}-${this.taskNumber}`;
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Task', taskSchema);