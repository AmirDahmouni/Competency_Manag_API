const clientManagerController=require("../controllers/client/manage-client-controller")
const checkAuth=require("../middlewares/checkAuth")
const checkAdmin=require("../middlewares/checkAdmin");
const validateObjectId = require('../middlewares/validateObjectId');
const express = require('express');
const router = express.Router();

router.get("/",checkAuth,checkAdmin,clientManagerController.getAllClient)
router.get("/:id",validateObjectId,checkAuth,clientManagerController.getClient)
router.post('/newClient',checkAuth,checkAdmin,clientManagerController.newClient);


module.exports = router;