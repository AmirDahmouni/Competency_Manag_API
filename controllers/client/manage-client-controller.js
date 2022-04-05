const Client=require("../../models/client-models")
const {uploadImage}=require("../../helpers/manage-file")


exports.getClient=async(req,res,next)=>{
   try{
     let client=await Client.findById(req.params._id).populate("projects")
     if(!client) return res.status(404).send({error:"client not found"})
     return res.status(200).send({message:"client found",data:client})
   }
   catch(ex)
   {
       next(ex)
   }
}


exports.getAllClient=async(req,res,next)=>{
    try{
       let clients=await Client.find().populate("projects")
       if(!clients) return res.status(404).send({error:"clients not found"})
       return res.status(200).send({message:"clients found",data:clients})
    }
    catch(ex)
    { 
      next(ex)
    }
}


exports.newClient=async(req,res,next)=>{
    try
    {
      let client=await Client.findOne({first_name:req.body.firstname,last_name:req.body.lastname,email:req.body.email,phone:req.body.phone})
      if(client) return res.status(400).send({error:"clien already exist"})
      client=new Client({
        first_name:req.body.firstname,
        last_name:req.body.lastname,
        phone:req.body.phone,
        email: req.body.email,
        linkedIn:req.body.linkedin,
        address:{
          city: req.body.city,
          country:req.body.country,
          zipcode: req.body.zipcode,
        }
      })
      
      if (req.files && req.files.avatar) {
        req.files.avatar.name=`avatar.${req.files.avatar.mimetype.split('/')[1]}`
        const new_image=await uploadImage(`public/images/clients`,`${req.body.firstname}${req.body.lastname}`,req.files.avatar, "image")
        if(new_image!=="error") client.avatar = new_image
        
      }
      newclient=await client.save()
    
      if(newclient) return res.status(201).send({message:"create client success",data:newclient})
      return res.status(400).send({error:"failed create client"})
    
    }
    catch(ex)
    {
      next(ex)
    }
}


