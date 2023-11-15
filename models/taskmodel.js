const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    manager_id:{
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    employee_id:{
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    numofsubtask:Number,
    title: String,
    status:{
      type: Number,
      default:3,
    },
    start_date: Date,
    due_date: Date,
    Priority:Number,
    description:String,
    file_upload:[String],
    parent_id:Number,
    action_name:String,
  },
  { timestamps: true }
);
taskSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'employee_id',
    select: 'name ',
  });
  next();
});
const setImageURL = (doc) => {
  if (doc.file_upload) {
    const imagesList = [];
    doc.file_upload.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/tasks/${image}`;
      imagesList.push(imageUrl);
    });
    doc.file_upload = imagesList;
  }
};
// findOne, findAll and update
taskSchema.post('init', (doc) => {
  setImageURL(doc);
});
// create
taskSchema.post('save', (doc) => {
  setImageURL(doc);
});
const Tasks = mongoose.model('Tasks', taskSchema);

module.exports = Tasks;