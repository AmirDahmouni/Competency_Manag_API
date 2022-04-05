const certificatManagerController=require("../controllers/certificate/manage-certificat-controller")
const checkAuth=require("../middlewares/checkAuth")
const checkAdmin=require("../middlewares/checkAdmin")
const validateObjectId=require("../middlewares/validateObjectId")
const error=require("../middlewares/error")
const express = require('express');
const router = express.Router();

router.get("/",checkAuth,certificatManagerController.getAllCertificates,error)
router.post('/newCertificate',checkAuth,checkAdmin,certificatManagerController.newCertificat);
router.put('/removeCertificate/:id',validateObjectId,checkAuth,checkAdmin,certificatManagerController.removeCertificate);

module.exports = router;