const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const taskModel=require("../models/taskmodel");
const calenderModel=require("../models/calendermodel");
const fs = require('fs');
const path = require('path');
const factory=require("./handlerfactory");
const { uploadmixImage } = require('../middelwares/uploadImageMiddelWare');

exports.uploadTaskImages = uploadmixImage([
    {
      name: 'file_upload',
      maxCount: 5,
    },
  ]);
  exports.resizeTaskImages = asyncHandler(async (req, res, next) => {
    if (req.files.file_upload) {
      req.body.file_upload = [];
      await Promise.all(
        req.files.file_upload.map(async (img, index) => {
            console.log(img);
          const imageName = `task-${uuidv4()}-${Date.now()}-${index + 1}.pdf`;
       const fullFilePath = path.join("uploads/tasks", imageName);
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
  if (req.user.role==="admin") filterObject = { manager_id: req.user._id };
  if (req.user.role==="user") filterObject = { employee_id: req.user._id ,status:3, due_date: { $gt: Date.now() }};
  req.filterObj = filterObject;
  next();
};
exports.createFilterObj2 = (req, res, next) => {
  let filterObject = {};
  if (req.user.role==="user") filterObject = { employee_id: req.user._id ,status:2};
  req.filterObj = filterObject;
  next();
};
exports.getalltask=factory.getAll(taskModel);
exports.getonetask=factory.getOne(taskModel);
exports.createtask=factory.createOne(taskModel,calenderModel);
exports.updatetask=factory.updateOne(taskModel);
exports.deletetask=factory.deleteOne(taskModel);