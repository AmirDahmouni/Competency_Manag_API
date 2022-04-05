const projectManagerConroller=require("../controllers/project/manage-project-controller")
const checkAuth=require("../middlewares/checkAuth")
const checkAdmin=require("../middlewares/checkAdmin")
const checkManager=require("../middlewares/checkManager")
const checkDeveloper=require("../middlewares/checkDeveloper")
const validateObjectId=require("../middlewares/validateObjectId")
const error=require("../middlewares/error")
const express = require('express');
const router = express.Router();


router.get("/",checkAuth,checkAdmin,projectManagerConroller.getAllProjects,error)
router.get("/projectsManager",checkAuth,checkManager,projectManagerConroller.getProjectsManager,error)
router.get("/projectsDeveloper",checkAuth,checkDeveloper,projectManagerConroller.getProjectsDeveloper,error)
router.get("/:id",validateObjectId,checkAuth,projectManagerConroller.getProject,error);
router.post('/newProject',checkAuth,checkAdmin,projectManagerConroller.newProject,error);
router.put("/closeProject/:id",validateObjectId,checkAuth,checkManager,projectManagerConroller.closeProject,error);

module.exports = router;