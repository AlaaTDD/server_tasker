const express = require('express');

const {
    createCalender,
    deleteCalender,
    getallCalender,
    getoneCalender,
    updateCalender,
    createFilterObj
} = require('../services/calenderServices');
const AuthServices=require("../services/authServices");

const router = express.Router();
router
    .route('/')
    .post(
        AuthServices.protect,
        AuthServices.allowedTo("admin"),
        createCalender);
    router
    .route('/:filterdateId').get(AuthServices.protect,createFilterObj,getallCalender)
router
    .route('/:id')
    .get(getoneCalender)
    .delete(deleteCalender)
    .put(updateCalender);


module.exports = router;