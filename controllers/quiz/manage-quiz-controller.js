const Training=require("../../models/training-model")
const {User}=require("../../models/user-model")
const Notification=require("../../models/notification-model")
const Quiz=require("../../models/quiz-model")

exports.getMyQuiz=async(req,res,next)=>{
    try{
        let quiz=await User.findById(req.user._id).populate("quiz.quiz")
        if(!quiz) return res.status(400).send({error:"error fetching my quiz "})
        if(quiz.length==0) return res.status(200).send({error:"quiz not found "})
        return res.status(200).send({message:"quiz found",data:quiz})
    }
    catch(ex)
    {
        next(ex)
    }
}

exports.getAllQuiz=async(req,res,next)=>{
    try
    {
        let quiz=await Quiz.find().populate("training")
        if(!quiz) return res.status(400).send({error:"error fetching quiz"})

        if(quiz.length==0) return res.status(200).send({message:"no quiz found"})

        return res.status(200).send({message:"quiz found",data:quiz})
       
    }
    catch(ex)
    {
      next(ex)
    }
}

exports.getQuiz=async(req,res)=>{
    try{
        let quiz=await Quiz.findById(req.params.id).populate("training")
        if(!quiz) return res.status(400).send({error:"error fetching quiz"})

        return res.status(200).send({message:"quiz found",data:quiz})
    }
    catch(ex)
    {
        next(ex) 
    }

}

exports.newQuiz=async(req,res,next)=>{
    try{
       var quiz=await Quiz.findOne({
           subject:req.body.subject,
           deadline:req.body.deadline,
           training:req.body.training
        })
        if(quiz) return res.status(400).send({error:"quiz already exist"})

        quiz=new Quiz({
            subject:req.body.subject,
           deadline:req.body.deadline,
           training:req.body.training,
           questions:req.body.questions
        })
        
        let training=await Training.findOneAndUpdate({_id:req.body.training,status:"closed"},{quiz:quiz._id},{new:true})
        if(!training) return res.status(400).send({error:"error updating training"})

        let users=await User.updateMany({_id:{$in:training.presences}},{$push:{quiz:{quiz:quiz._id,mark:0,status:"not yet"}}})
        if(!users) return res.status(400).send({error:"error updating users"})

        let notifications=new Notification({title:"new Quiz started and you invited to paricipate",type:"quiz",notification:quiz._id})
        await notifications.save()
        let developers=await User.updateMany({_id:{$in:training.presences}},{$push:{notifications:notifications._id}})
        if(!developers) return res.status(404).send({error:"failed to notify users"})

        quiz=await quiz.save()
        if(quiz) return res.status(201).send({message:"create new quiz success",data:quiz})
        return res.status(400).send({error:"failed create new quiz"})

    }
    catch(ex)
    {
      next(ex)
    }
}

