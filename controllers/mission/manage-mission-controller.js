const Mission=require("../../models/mission-model")
const Project=require("../../models/project-model")
const {User}=require("../../models/user-model")
const Notification=require("../../models/notification-model")

exports.getAllmissions=async(req,res,next)=>{
    try{
       let missions=await Mission.find().populate("project").populate("developer").populate("technologies.technology")
       if(!missions) return res.status(400).send({error:"no mission found"})
       if(missions.length==0) return res.status(200).send({message:"no missions found"})
       return res.status(200).send({message:"All Missions Found",data:missions})
    }
    catch(ex)
    {
        next(ex)
    }
}

//get projects mission 
exports.getMissionsByProject=async(req,res,next)=>{
    try{
       let missions=await Mission.find({project:req.params.id}).populate("technologies.technology").populate("developer")
       if(!missions) return res.status(400).send({error:"Failed Fetching Missions"})
       if(missions.length==0) return res.status(400).send({message:"No Mission Found"})
       return res.status(200).send({message:"Missions Project Found",data:missions})
    }
    catch(ex)
    {
        next(ex)
    }
}

exports.newMission=async(req,res,next)=>{
    try
    {

       let project=await Project.findOne({_id:req.body.project,manager:req.user._id})
       if(!project) return res.status(400).send({error:"project not found"})
       let mission=new Mission({
        date_end:req.body.date_end,
        description:req.body.description,
        developer:req.body.developer,
        project:req.body.project,
        tasknumber:req.body.tasks,
        technologies:[]
       })
       req.body.technos.map(item=>mission.technologies.push({technology:item,cleancode:0,progressstate:0,fixbugs:0}))
       await mission.save()
       let notificationDeveloper=new Notification({title:"you have new mission",type:"mission",notification:mission._id})
       await notificationDeveloper.save()
       let developer=await User.findByIdAndUpdate(req.body.developer,{busy:true,$push:{notifications:notificationDeveloper._id}})
       if(!developer) return res.status(404).send({error:"failed to notify developer"})
       return res.status(201).send({message:"success add mission",data:mission})
    }
    catch(ex)
    {
        next(ex)
    }
}

exports.closeMission=async(req,res,next)=>{
    try
    {
      let mission=await Mission.findByIdAndUpdate(req.params.id,{technologies:req.body.technologies,status:"closed"},{new:true})
      if(!mission) return res.status(400).send({error:"failed update mission"})

      let project=await Project.findByIdAndUpdate(mission.project,{progress:req.body.progress})
      if(!project) return res.status(400).send({error:"failed update project"})

      let notification=new Notification({title:"your mission closed",type:"mission",notification:mission._id})
      await notification.save()
      let developer=await User.findByIdAndUpdate(mission.developer,{busy:false,$push:{notifications:notification._id}})
      if(!developer) return res.status(400).send({error:"failed notify developer"})

      return res.status(200).send({message:"mission closed",data:mission})

    }
    catch(ex)
    {
      next(ex)
    }
}