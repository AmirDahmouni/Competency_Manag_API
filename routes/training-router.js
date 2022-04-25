const trainingManagerController=require("../controllers/training/manager-training-controller")
const checkAuth=require("../middlewares/checkAuth")
const checkAdmin=require("../middlewares/checkAdmin")
const validateObjectId=require("../middlewares/validateObjectId")
const error=require("../middlewares/error")
const express = require('express');
const router = express.Router();


router.get("/",checkAuth,trainingManagerController.getAlltrainings,error)
router.get("/myTrainings",checkAuth,trainingManagerController.getMyTrainings,error)
router.get("/:id",validateObjectId,checkAuth,trainingManagerController.getTraining,error)
router.post("/newTraining",checkAuth,checkAdmin,trainingManagerController.newTraining,error)
router.put("/closeTraining",checkAuth,trainingManagerController.closeTraining,error)
router.put("/cancelTraining",checkAuth,checkAdmin,trainingManagerController.cancelTraining,error)
router.put("/interest",checkAuth,trainingManagerController.interestTraining,error)
router.put("/start/:id",validateObjectId,checkAuth,trainingManagerController.startTraining,error)
router.put("/markPresence",checkAuth,trainingManagerController.markPresence,error)



module.exports = router;