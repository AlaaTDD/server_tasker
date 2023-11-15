const calenderModel=require("../models/calendermodel");
const factory=require("./handlerfactory");

exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.user.role==="admin") filterObject = { manager_id: req.user._id, due_date: { $gt: Date.now() },filterdate: req.params.filterdateId,  };
    if (req.user.role==="user") filterObject = { employee_id: req.user._id , due_date: { $gt: Date.now() },filterdate: req.params.filterdateId, };
    req.filterObj = filterObject;
    next();
  };
exports.getallCalender=factory.getAll(calenderModel);
exports.getoneCalender=factory.getOne(calenderModel);
exports.createCalender=factory.createOne(calenderModel);
exports.updateCalender=factory.updateOne(calenderModel);
exports.deleteCalender=factory.deleteOne(calenderModel);