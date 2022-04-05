const Project=require("../../models/project-model")
const Client=require("../../models/client-models")
const {User}=require("../../models/user-model")
const Technology=require("../../models/technology-model")
const Notification=require("../../models/notification-model")
const {uploadImage}=require("../../helpers/manage-file")
const ConvertStrToObjectId=require("../../helpers/str-to-objectId")
const Mission=require("../../models/mission-model")


exports.getAllProjects=async(req,res,next)=>{
    try
    {
        let projects=await Project.find().populate("manager").populate("technologies").populate("developers").populate("client")
        if(!projects) return res.status(400).send({error:"error fetching projects"})

        if(projects.length==0) return res.status(200).send({message:"no project found"})

        return res.status(200).send({message:"projects found",data:projects})
       
    }
    catch(ex)
    {
      next(ex)
    }
}
exports.getProjectsManager=async(req,res,next)=>{
    try
    {
        let projects=await Project.find({manager:req.user._id}).populate("developers").populate("client").populate("technologies")
        if(!projects) return res.status(400).send({error:"error fetching projects"})
        if(projects.length==0) return res.status(200).send({message:"no projects found"})
        return res.status(200).send({message:"projects found",data:projects})
    }
    catch(ex)
    {
      next(ex)
    }
}
exports.getProjectsDeveloper=async(req,res,next)=>{
    try
    {
        let projects=await Project.find({developers:{$in:req.user._id}}).populate("developers").populate("manager").populate("technologies").populate("client")
        if(!projects) return res.status(404).send({error:"failed fetching projects"})
        if(projects.length==0) return res.status(200).send({message:"no project found"})
        return res.status(200).send({message:"projects found",data:projects})
    }
    catch(ex)
    {
        next(ex)
    }
}



exports.getProject=async(req,res,next)=>{
    try{
       let project=await Project.findById(req.params.id).populate("manager").populate("developers").populate("client").populate("technologies")
       if(!project) return res.status(404).send({error:"project not found"})
       return res.status(200).send({message:"project found",data:project})
    }
    catch(ex)
    {
      next(ex)
    }
}

exports.newProject=async(req,res,next)=>{
    try
    {

        var project=await Project.findOne({
            name:req.body.name,
            description:req.body.description,
            deadline:req.body.deadline
        })
        if(project) return res.status(400).send({error:"project already exist"})
     

        project=new Project({
            name:req.body.name,
            description:req.body.description,
            deadline:req.body.deadline,
            budget:req.body.budget,
            manager:req.body.manager,
            client:req.body.client,
            developers:ConvertStrToObjectId(req.body.developers),
            technologies:ConvertStrToObjectId(req.body.technos)
        })
         
        
        if (req.files && req.files.logo) {
            req.files.logo.name=`logo.${req.files.logo.mimetype.split('/')[1]}`
            const new_image=await uploadImage(`public/images/projects`,`${req.body.name}`,req.files.logo, "image")
            if(new_image!=="error") project.logo = new_image
        }
        
        let client=await Client.findByIdAndUpdate(req.body.client,{$push:{projects:project._id}})
        if(!client) return res.status(400).send({error:"failed to update client"})


        let technologies=await Technology.updateMany({_id:{$in:ConvertStrToObjectId(req.body.technos)}},{$push:{projects:project._id}})
        if(!technologies) return res.status(400).send({error:"failed to update technology"})


        let notificationManager=new Notification({title:"your are invited to lead a project",type:"project",notification:project._id})
        await notificationManager.save()
        

        let manager=await User.findByIdAndUpdate(req.body.manager,{$push:{projects:project._id,notifications:notificationManager._id},busy:true})
        if(!manager) return res.status(400).send({error:"failed to update and notify project manager "})

        //developers notification
        ids=ConvertStrToObjectId(req.body.developers)
        let notificationDevelopers=new Notification({title:"new project is going to start and you are member",type:"project",notification:project._id})
        await notificationDevelopers.save()
        let developers=await User.updateMany({_id:{$in:ids}},{$push:{notifications:notificationDevelopers._id}})
        if(!developers) return res.status(404).send({error:"failed to notify developers"})

        project=await project.save()
        if(project) return res.status(201).send({message:"create new project success",data:project})
        return res.status(400).send({error:"failed create new project"})

    }
    catch(ex)
    {
        next(ex)
    }
}
exports.closeProject=async(req,res,next)=>{
    try
    {
        let missions=await Mission.find({project:req.params.id,status:"started"})
        if(!missions) return res.status(400).send({error:"error fetching missions realted to this project"})
        if(missions.length!=0) return res.status(200).send({message:"cannot close project before closing all his missions"})
        
        let project=await Project.findOneAndUpdate({_id:req.params.id,manager:req.user._id},{status:"closed",progress:100},{new:true})
        if(!project) return res.status(400).send({message:"project not found"})

        let manager=await User.findByIdAndUpdate(project.manager,{busy:false})
        if(!manager) return res.status(400).send({error:"manage not found"})

        return res.status(200).send({message:"project closed",data:project})
    }
    catch(ex)
    {
        next(ex)
    }
}