const userManagerController=require("../controllers/user/manage-user-controller")
const checkAuth=require("../middlewares/checkAuth")
const checkAdmin=require("../middlewares/checkAdmin")
const validateObjectId=require("../middlewares/validateObjectId")
const error=require("../middlewares/error")
const express = require('express');
const router = express.Router();

router.get("/managerFree",checkAuth,checkAdmin,userManagerController.getAllManagersFree)
router.get("/developersFree",checkAuth,checkAdmin,userManagerController.getAllDevelopersFree,error);
router.post("/signin",userManagerController.singin,error)
router.post('/signupAdmin',userManagerController.singupAdmin,error);
router.post('/signup',userManagerController.singup,error);
router.delete('/remove/:id',checkAuth,checkAdmin,validateObjectId,userManagerController.remove,error);
router.put("/updateinfos",checkAuth,userManagerController.updateinfos,error);
router.put("/updateCv",checkAuth,userManagerController.updateCv,error);
router.put("/updateAvatar",checkAuth,userManagerController.updateAvatar,error);
router.put("/updatePassword",checkAuth,userManagerController.updatePassword,error);
router.put("/newProposal",checkAuth,userManagerController.newProposal,error);
router.put("/removeProposal/:id",validateObjectId,checkAuth,userManagerController.removeProposal,error);
router.put("/likeProposal/:id",validateObjectId,checkAuth,userManagerController.likeProposal,error);
router.put("/disLikeProposal/:id",validateObjectId,checkAuth,userManagerController.disLikeProposal,error);
router.put("/newCertificate/:id",validateObjectId,checkAuth,userManagerController.newCertificate,error);
router.put("/removeCertificate/:id",validateObjectId,checkAuth,userManagerController.removeCertificate,error);


module.exports = router;