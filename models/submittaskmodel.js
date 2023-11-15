const mongoose = require('mongoose');

const SubmittaskSchema = new mongoose.Schema(
  {
    task_id:{
      type: mongoose.Schema.ObjectId,
      ref: 'Tasks',
    },
    manager_id:{
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    title: String,
    e_name:String,
    description:[String],
    file_upload:[String],
    action_name:{
      type: String,
      default:"rejection",
    },
  },
  { timestamps: true }
);


const SubmitTasks = mongoose.model('SubmitTasks', SubmittaskSchema);

module.exports = SubmitTasks;