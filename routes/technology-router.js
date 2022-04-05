const technologyManagerController=require("../controllers/technology/manage-technology-controller")
const checkAuth=require("../middlewares/checkAuth")
const checkAdmin=require("../middlewares/checkAdmin")
const express = require('express');
const router = express.Router();


router.post('/newTechnology',checkAuth,checkAdmin,technologyManagerController.newTechnology);
router.put("/deleteTechnology/:id",checkAuth,checkAdmin,technologyManagerController.deleteTechnology)

module.exports = router;