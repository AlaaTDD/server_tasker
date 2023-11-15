const express = require('express');

const {
    createtask,
    deletetask,
    getalltask,
    getonetask,
    updatetask,
    resizeTaskImages,
    uploadTaskImages,
    setmanagerId,
    createFilterObj,
    createFilterObj2
} = require('../services/taskServices');
const AuthServices=require("../services/authServices");
const subtaskRoute = require('./subtaskRoute');

const router = express.Router();

router.use('/:taskId/subtask', subtaskRoute);

router
    .route('/')
    .post(
        AuthServices.protect,
        AuthServices.allowedTo("admin"),
        uploadTaskImages,
        resizeTaskImages,
        setmanagerId,
        createtask)
    .get(AuthServices.protect,createFilterObj,getalltask);
    router
    .route('/all').get(AuthServices.protect,createFilterObj2,getalltask);
router
    .route('/:id')
    .get(getonetask)
    .delete(deletetask)
    .put(AuthServices.protect,
        AuthServices.allowedTo("admin"),
        uploadTaskImages,
        resizeTaskImages,updatetask);


module.exports = router;