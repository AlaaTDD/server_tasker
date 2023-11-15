const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const SubtaskModel = require("../models/submittaskmodel");
const taskModel=require("../models/taskmodel");
const fs = require('fs');
const path = require('path');
const factory = require("./handlerfactory");
const { uploadmixImage } = require('../middelwares/uploadImageMiddelWare');

exports.uploadSubTaskImages = uploadmixImage([
  {
    name: 'file_upload',
    maxCount: 5,
  },
]);
exports.resizeSubTaskImages = asyncHandler(async (req, res, next) => {
  if (req.files.file_upload) {
    req.body.file_upload = [];
    await Promise.all(
      req.files.file_upload.map(async (img, index) => {
        console.log(img);
        const imageName = `task-${uuidv4()}-${Date.now()}-${index + 1}.pdf`;
        const fullFilePath = path.join("uploads/subtasks", imageName);
        fs.writeFileSync(fullFilePath, img.buffer);
        req.body.file_upload.push(imageName);
      })
    );
    next();
  }
});
exports.setmanagerId = (req, res, next) => {
  // Nested route (Create)
  if (!req.body.manager_id) req.body.manager_id = req.user._id;
  next();
};
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.user.role === "admin") filterObject = { manager_id: req.user._id , action_name: "rejection"};
  if (req.user.role === "user") filterObject = { task_id: req.params.taskId, action_name: "approve" };
  req.filterObj = filterObject;
  next();
};
exports.createFilterObj2 = (req, res, next) => {
  let filterObject = {};
  if (req.user.role === "admin") filterObject = { task_id: req.params.taskId, action_name: "approve" };
  console.log(req.params.taskId);
  req.filterObj = filterObject;
  next();
};
exports.completetask=asyncHandler(async (req, res, next) => {
if(req.body.action_name=="approve"){
  const subtask=await SubtaskModel.findById(req.params.id);
  const task=await taskModel.findById(subtask.task_id);
  const subAlltask=await SubtaskModel.find({task_id:subtask.task_id,action_name: "approve"});
  if (!task) {
    return next(new ApiError('task not exist', 401));
  }
  if(task.numofsubtask==subAlltask.length+1){
    const document = await taskModel.findByIdAndUpdate(subtask.task_id, {status:2}, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    document.save();
  }
}
console.log(req.body.action_name);
next();
});
exports.getallSubtask = factory.getAll(SubtaskModel);
exports.getoneSubtask = factory.getOne(SubtaskModel);
exports.createSubtask = factory.createOne(SubtaskModel);
exports.updateSubtask = factory.updateOne(SubtaskModel);
exports.deleteSubtask = factory.deleteOne(SubtaskModel);