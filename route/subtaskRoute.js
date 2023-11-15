const express = require('express');

const {
    createSubtask,
    deleteSubtask,
    getallSubtask,
    getoneSubtask,
    updateSubtask,
    resizeSubTaskImages,
    uploadSubTaskImages,
    setmanagerId,
    createFilterObj,
    createFilterObj2,
    completetask
} = require('../services/subtaskServices');
const AuthServices=require("../services/authServices");

const router = express.Router({ mergeParams: true });
router
    .route('/')
    .post(
        AuthServices.protect,
        AuthServices.allowedTo("admin","user"),
        uploadSubTaskImages,
        resizeSubTaskImages,
        setmanagerId,
        createSubtask)
    .get(AuthServices.protect,createFilterObj,getallSubtask);
    router.get("/admin",AuthServices.protect,createFilterObj2,getallSubtask);
router
    .route('/:id')
    .get(getoneSubtask)
    .delete(deleteSubtask)
    .put(completetask,updateSubtask);


module.exports = router;