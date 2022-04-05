const Training=require("../../models/training-model")
const {User}=require("../../models/user-model")
const Notification=require("../../models/notification-model")


exports.getAlltrainings=async(req,res,next)=>{
    try
    {
       let trainings=await Training.find().populate("trainer").populate("interested_members").populate("quiz")
       if(!trainings) return res.status(404).send({error:"failed fetching trainings"})

       if(trainings.length==0) return res.status(200).send({message:"no scheduled training"})

       return res.status(200).send({message:"training list",data:trainings})


    }
    catch(ex)
    {
        next(ex)
    }
}
exports.getMyTrainings=async(eq,res,next)=>{
    try{
       let trainings=await Training.find({trainer:req.user._id}).populate("quiz").populate("interested_members")
       if(!trainings) return res.status(400).send({error:"faield fetching trainings"})
       if(trainings.length==0) return res.status(200).send({message:"no training found"})
       return res.status(200).send({message:"list trainings",data:trainings})
    }
    catch(ex)
    { 
      next(ex)
    }
}
exports.getTraining=async(req,res,next)=>{
  try{
     let training=await Training.findById(req.params.id).populate("trainer").populate("interested_members").populate("quiz")
    if(!training) return res.status(404).send({error:"training not found",data:training})
    return res.status(200).send({message:"training found",data:training})
    }
  catch(ex)
  {
      next(ex)
  }
}

exports.interestTraining=async(req,res,next)=>{
    try{
      let training=await Training.findByIdAndUpdate(req.params.id,{$push:{interested_members:req.user._id}})
      if(!training) return res.status(400).send({error:"training not found"})
      return res.status(200).send({message:"interested training",data:training})
    }
    catch(ex)
    {
        next(ex)
    }
}
exports.startTraining=async(req,res,next)=>{
    try{
        let training=await Training.findOneAndUpdate({_id:req.params.id,trainer:req.user._id},{status:"in progress"})
        if(!training) return res.status(400).send({error:"training not found"})
        
        let notificationDevelopers=new new Notification({title:"training start ...",type:"training",notification:training._id})
        await notificationDevelopers.save()

        let users=await User.updateMany({_id:{$in:training.interested_members}},{$push:{notifications:notificationDevelopers._id}})
        if(!users) return res.status(400).send({error:"failed notify developers"})

        return res.status(200).send({message:"training stared successfully",data:training})

    }
    catch(ex)
    {
        next(ex)
    }
}
exports.newTraining=async(req,res,next)=>{
    try
    {
       let training=await Training.findOne({subject:req.body.subject,description:req.body.description,trainer:req.body.trainer})
       if(training) return res.status(400).send({eror:"trainings already exist"})

       training=new Training({
          subject:req.body.subject,
          description:req.body.description,
          date_begin:req.body.date_begin,
          room:req.body.room,
          trainer:req.body.trainer
       })
       training=await training.save()
       if(!training) return res.status(400).send({error:"failed create new training"})

       //trainer notification
       let notificationTrainer=new Notification({title:"your are invited to organise a training",type:"training",notification:training._id})
       await notificationTrainer.save()
       trainer=await User.findByIdAndUpdate(req.body.trainer,{$push:{trainings:training._id},$push:{notifications:notificationTrainer._id}})
       if(!trainer) return res.status(404).send({error:"failed to notify trainer"})

       //developers notification
       let notificationDevelopers=new new Notification({title:"new training is going to be held",type:"training",notification:training._id})
       await notificationDevelopers.save()
       let developers=await User.updateMany({_id:{$ne:req.body.trainer}},{$push:{notifications:notificationDevelopers._id}})
       if(!developers) return res.status(404).send({error:"failed to notify developers"})


       return res.status(201).send({message:"create new training success",data:training})
    }
    catch(ex)
    {
       next(ex)
    }
}
exports.cancelTraining=async(req,res,next)=>{
    try
    {
       let training=await Training.findByIdAndUpdate(req.params.id,{status:"canceled"})
       if(!training) return res.status(404).send({error:"training not found"})

       let notification=new Notification({title:"training canceled",type:"training",notification:training._id})
       await notification.save()

       let trainer=await User.findByIdAndUpdate(training.trainer,{$pull:{trainings:training._id},$push:{notifications:notification._id}})
       if(!trainer) return res.status(400).send({error:"trainer not updated"})

       let developers=await User.updateMany({_$id:{$in:training.interested_members}},{$push:{notifications:notification._id}})
       if(!developers) return res.status(400).send({error:"failed notify developers"})
       return res.status(200).send({message:"training canceled",data:training})
    }
    catch(ex)
    {
        next(ex)
    }
}
exports.closeTraining=async(req,res,next)=>{
    try
    {
       let training=await Training.findOneAndUpdate({_id:req.params.id,trainer:req.user._id},{status:"closed"},{new:true})
       if(!training) return res.status(404).send({error:"training not found"})

       let notification=new Notification({title:"training canceled",type:"training",notification:training._id})
       await notification.save()
 

       let developers=await User.updateMany({$_id:{$in:training.interested_members}},{$push:{notifications:notification._id}})
       if(!developers) return res.status(400).send({error:"failed notify developers"})

       return res.status(200).send({message:"training closed",data:training})

    }
    catch(ex)
    {
      next(ex)
    }
}
exports.markPresence=async(req,res,next)=>{
    try{
       let training=await Training.findByIdAndUpdate(req.params.id,{$push:{presences:req.body.presences},$push:{absences:req.body.absences}},{new:true})
       if(!training) return res.status(400).send({error:"failed mark presences"})
       return res.status(200).send({message:"success mark presences",data:training})
    }
    catch(ex)
    {
        next(ex)
    }
}
