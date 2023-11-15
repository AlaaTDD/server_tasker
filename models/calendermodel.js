const mongoose = require('mongoose');

const CalendarSchema = new mongoose.Schema(
  {
    task_id:{
      type: mongoose.Schema.ObjectId,
      ref: 'Tasks',
    },
    manager_id:{
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    employee_id:{
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    filterdate:String,
    start_date: Date,
    due_date: Date,
  },
  { timestamps: true }
);
CalendarSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'task_id',
    select: 'title phone',
  });
  next();
});

const Calendar = mongoose.model('Calendars', CalendarSchema);

module.exports = Calendar;