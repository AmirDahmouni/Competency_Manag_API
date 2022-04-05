const managerMissionController=require("../controllers/mission/manage-mission-controller")
const checkAuth=require("../middlewares/checkAuth")
const checkAdmin=require("../middlewares/checkAdmin")
const checkManager=require("../middlewares/checkManager")
const validateObjectId=require("../middlewares/validateObjectId")
const error=require("../middlewares/error")
const express = require('express');
const router = express.Router();

router.get("/",checkAuth,checkAdmin,managerMissionController.getAllmissions,error)
router.get("/:id",validateObjectId,checkAuth,managerMissionController.getMissionsByProject,error)
router.post("/newMission",checkAuth,checkManager,managerMissionController.newMission,error)
router.put("/closeMission/:id",checkAuth,checkManager,managerMissionController.closeMission,error)



module.exports = router;
