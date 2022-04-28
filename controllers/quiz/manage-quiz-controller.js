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
        let quiz=await Quiz.find().populate("training").populate("technology")
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
        let quiz=await Quiz.findById(req.params.id).populate("training").populate("technology")
        if(!quiz) return res.status(400).send({error:"error fetching quiz"})

        return res.status(200).send({message:"quiz found",data:quiz})
    }
    catch(ex)
    {
        next(ex) 
    }

}

exports.newQuiz=async(req,res,next)=>{
    try
    {
       let training=await Training.findOne({_id:req.body.training,trainer:req.user._id})
       if(!training) return res.status(403).send({error:"Your are not the trainer"})

       var quiz=await Quiz.findOne({
           subject:req.body.subject,
           deadline:req.body.deadline,
           training:req.body.training,
           technology:req.body.technology
        })
        if(quiz) return res.status(400).send({error:"Quiz already exist"})

        quiz=new Quiz({
           subject:req.body.subject,
           deadline:req.body.deadline,
           training:req.body.training,
           questions:req.body.questions,
           technology:req.body.technology
        })
        
        training=await Training.findOneAndUpdate({_id:req.body.training,status:"closed"},{quiz:quiz._id},{new:true})
        if(!training) return res.status(400).send({error:"Error updating training"})

        let notifications=new Notification({title:"New Quiz started and you invited to paricipate",type:"quiz",notification:quiz._id})
        await notifications.save()

        let users=await User.updateMany({_id:{$in:training.presences}},
                                        {$push:{quiz:{quiz:quiz._id,mark:0,status:"not yet"},notifications:notifications._id}})

        if(!users) return res.status(400).send({error:"Error updating users"})

        quiz=await quiz.save()
        if(quiz) return res.status(201).send({message:"Create new quiz success",data:quiz})
        return res.status(400).send({error:"Failed create new quiz"})

    }
    catch(ex)
    {
      next(ex)
    }
}

exports.passQuiz=async(req,res,next)=>{
    
    function getScoreAnswer(idQuestion,idAnswer,quiz)
    {
       return quiz.questions.find(elem=>elem._id==idQuestion).answers.find(elem=>elem._id==idAnswer).score
    }
    try
    {
      let quiz=await Quiz.findById(req.params.id)
      let answers=req.body.answers.map(item=>item.answers.map(answer=>getScoreAnswer(item.question,answer,quiz)))
      var score=0
      answers.map(item=>{
          if(!item.some(elem=>elem==0)) score+=item.reduce((a,b)=>a+b,0)
      })
      let user=await User.findById(req.user._id)
      
      user.quiz=user.quiz.map(item=>{
          if (item.quiz==req.params.id) return {...item,mark:score,status:"passed"}
          else return item
      })
      await user.save()
      

      return res.status(200).send({message:"quiz passed"})
    }
    catch(ex)
    {
        next(ex)
    }
}

