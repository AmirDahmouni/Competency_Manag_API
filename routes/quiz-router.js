const quizManagerController=require("../controllers/quiz/manage-quiz-controller")
const checkAuth=require("../middlewares/checkAuth")
const checkAdmin=require("../middlewares/checkAdmin")
const validateObjectId=require("../middlewares/validateObjectId")
const error=require("../middlewares/error")
const express = require('express');
const router = express.Router();


router.get("/",checkAuth,checkAdmin,quizManagerController.getAllQuiz,error)
router.get("/:id",validateObjectId,checkAuth,quizManagerController.getQuiz,error)
router.get("/getMyQuiz",checkAuth,quizManagerController.getMyQuiz,error)
router.post("/newQuiz",checkAuth,quizManagerController.newQuiz,error)
router.put("/passQuiz/:id",validateObjectId,checkAuth,quizManagerController.passQuiz,error)

module.exports = router;