const {User,validate,validateSignin}=require("../../models/user-model");
const Certificate=require("../../models/certificate-model")
const _ = require("lodash");
const bcrypt = require("bcrypt");
const {uploadImage,uploadFile,deleteFile}=require("../../helpers/manage-file");




exports.getAllManagersFree=async(req,res,next)=>{
   try{
     const ManagersFree=await User.find({role:"project manager",busy:false})
     if(!ManagersFree) return res.status(404).send({error:"error fetching Managers"})
     if(ManagersFree.length==0) return res.status(200).send({message:"All Project Managaer Busy"})
     return res.status(200).send({message:"Managers Free found",data:ManagersFree})
   }
   catch(ex)
   {
     next(ex)
   }
}

exports.getAllDevelopersFree=async(req,res,next)=>{
    try{
      const developersFree=await User.find({role:"developper",busy:false})
      if(! developersFree) return res.status(404).send({error:"error fetching developers"})
      if( developersFree.length==0) return res.status(200).send({message:"All developers Busy"})
      return res.status(200).send({message:"developers Free found",data:developersFree})
    }
    catch(ex)
    {
      next(ex)
    }
 }

exports.singupAdmin=async(req,res,next)=>{
    try{
        const { error } = validate(req.body);
        if (error) return res.status(400).send({error:error.message});

        let user = await User.findOne({email: req.body.email});    
        if (user) return res.status(400).send({ error: 'email already exist' });

        user=await User.findOne({ phone:req.body.phone });
        if (user) return res.status(400).send({ error: 'phone already exist' });

        if(req.body.password!==req.body.rePassword) return res.status(400).send({error:"invalid rePassword "})

        
        user=new User({
            first_name:req.body.firstname,
            last_name:req.body.lastname,
            email:req.body.email,
            password:req.body.password,
            gender:req.body.gender,
            address:{zipcode:req.body.zipcode,country:req.body.country,city:req.body.city},
            phone:req.body.phone,
            role:"responsable",
            certificats:req.body.certificats,
            technologies:req.body.technologies
        })

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        
        
        if (req.files && req.files.avatar) {
            req.files.avatar.name=`avatar.${req.files.avatar.mimetype.split('/')[1]}`
            const new_image=await uploadImage(`public/images/avatars`,`${req.body.firstname}${req.body.lastname}`,req.files.avatar, "image")
            if(new_image!=="error") user.avatar = new_image
            
        }
        if(req.files && req.files.cv)
        {
            req.files.cv.name=`cv.${req.files.cv.mimetype.split('/')[1]}`
            const new_cv=await uploadFile(`public/cv`,`${req.body.firstname}${req.body.lastname}`,req.files.cv, "pdf")
            if(new_cv!=="error") user.cv = new_cv
        }
        user=await user.save()

        if(!user) return res.status(400).send({error:"failed save user"})
       
        return res.status(201).send({message:"user created",data:user})
    }
    catch(ex)
    {
        next(ex)
    }
}

exports.singup=async(req,res,next)=>{

    try{
    const { error } = validate(req.body);
    if (error) return res.status(400).send({error:error.message});

    let user = await User.findOne({email: req.body.email});
    
    if (user) return res.status(400).send({ error: 'email already exist' });

    if(req.body.password!==req.body.rePassword) return res.status(400).send({error:"invalid rePassword "})

    
    user=new User({
        first_name:req.body.firstname,
        last_name:req.body.lastname,
        email:req.body.email,
        password:req.body.password,
        gender:req.body.gender,
        address:{zipcode:req.body.zipcode,country:req.body.country,city:req.body.city},
        phone:req.body.phone,
        role:req.body.role,
        certificats:req.body.certificats,
        technologies:req.body.technologies
    })

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    
    
    if (req.files && req.files.avatar) {
        req.files.avatar.name=`avatar.${req.files.avatar.mimetype.split('/')[1]}`
        const new_image=await uploadImage(`public/images/avatars`,`${req.body.firstname}${req.body.lastname}`,req.files.avatar, "image")
        if(new_image!=="error") user.avatar = new_image
        
    }
    if(req.files && req.files.cv)
    {
        req.files.cv.name=`cv.${req.files.cv.mimetype.split('/')[1]}`
        const new_cv=await uploadFile(`public/cv`,`${req.body.firstname}${req.body.lastname}`,req.files.cv, "pdf")
        if(new_cv!=="error") user.cv = new_cv
    }
    user=await user.save()

    if(!user) return res.status(400).send({error:"failed save user"})
   
    return res.status(201).send({message:"user created",data:user})
    }
    catch(ex)
    {
        next(ex)
    }
}

exports.singin=async(req,res,next)=>{
    try{
        
        const { error } = validateSignin(req.body);
        if (error) return res.status(400).send({error:error.message});
        
        var user=null;
        
        if(req.body.login_method=="email")
        {
            user = await User.findOne({email: req.body.email,status:true});
            if (!user) return res.status(404).send({ error: 'invalid email' });
        }
        else if(req.body.login_method=="phone")
        {
            user = await User.findOne({phone: req.body.phone,status:true});
            if (!user) return res.status(404).send({ error: 'invalid phone' });
        }
        
        
        const validpassword = await bcrypt.compare(req.body.password, user.password)
        if(!validpassword) return res.status(401).send({ message: 'Invalid Password' })

        const token = user.generateAuth();
        return res.header("x-auth-token", token).send({message:"login successful",data:user})
    }
    catch(ex)
    {

    }
}

exports.remove=async(req,res,next)=>{
    try{
        let user = await User.findByIdAndUpdate(req.params.id,{busy:true,status:false})
        if(user) return res.status(200).send({message:"user removed"})
        return res.status(404).send({error:"user not found"})
    }
    catch(ex)
    {
        next(ex)
    }
}

//update personnal infos and technologies
exports.updateinfos=async(req,res,next)=>{
    try{

       let user=await User.findById(req.user._id).select("-password")
       let infos={
           first_name:req.body.firstname || user.first_name,
           last_name:req.body.lastname || user.last_name,
           email:req.body.email || user.email,
           phone:req.body.phone || user.phone,
           address:{
              country:req.body.country|| user.address.country,
              city:req.body.city|| user.address.city,
              zipcode:req.body.zipcode || user.address.zipcode
           },
           technologies:req.body.technologies || user.technologies
       }
       
       user=await User.findByIdAndUpdate(req.user._id,infos).select("-password")
       if(user) return res.status(200).send({message:"update success",data:user})
    }
    catch(ex)
    {
      next(ex)
    }
}

exports.updateCv=async(req,res,next)=>{
  try{
     var user=await User.findById(req.user._id)
     if(!user) return res.status(404).send({error:"user not found"})

     if (req.files && req.files.cv) {
        
        const result=await deleteFile(user.cv)
        
        req.files.cv.name=`cv.${req.files.cv.mimetype.split('/')[1]}`
        const new_cv=await uploadFile(`public/cv`,`${user.first_name}${user.last_name}`,req.files.cv, "pdf")
        if(new_cv!=="error") user.cv = new_cv

        user=await user.save()
        
        if(!user) return res.status(400).send({error:"failed updated cv"})
        return res.status(200).send({message:"cv updated",data:user})
    }
    return res.status(500).send({eror:"cv not found"})
  }
  catch(ex)
  {
      next(ex)
  }
}

exports.updateAvatar=async(req,res,next)=>{
    try{
        var user=await User.findById(req.user._id)
        if(!user) return res.status(404).send({error:"user not found"})
   
        if (req.files && req.files.avatar) {
           
           await deleteFile(user.avatar)
           
           req.files.avatar.name=`avatar.${req.files.avatar.mimetype.split('/')[1]}`
           const new_avatar=await uploadImage(`public/images/avatars`,`${user.first_name}${user.last_name}`,req.files.avatar, "image")
           if(new_avatar!=="error") user.avatar = new_avatar
   
           user=await user.save()
           
           if(!user) return res.status(400).send({error:"failed updated avatar"})
           return res.status(200).send({message:"avatar updated",data:user})
       }
       return res.status(500).send({eror:"avatar not found"})
     }
     catch(ex)
     {
         next(ex)
     }
}

exports.updatePassword=async(req,res,next)=>{
    try
    {
       
       let user=await User.findById(req.user._id)

       const validpassword = await bcrypt.compare(req.body.oldpassword, user.password)
       if(!validpassword) return res.status(401).send({ error: 'Invalid Password' })

       if(req.body.password!==req.body.rePassword)
         return res.status(400).send({error:"invalid new password"})

       const salt = await bcrypt.genSalt(10);
       user.password = await bcrypt.hash(req.body.password, salt);
       
       user=await user.save()
        
       if(user) return res.status(200).send({message:"password updated",data:user})

    }
    catch(ex)
    {

    }
}

exports.newProposal=async(req,res,next)=>{
    try{
    
        if(!req.body.title || !req.body.description)
         return res.status(400).send({error:"error title or description"})

        let proposal={
            title:req.body.title,
            description:req.body.description,
        }

        let user=await User.findByIdAndUpdate(req.user._id,{$push:{proposals:proposal}})
        if(!user) return res.status(404).send({error:"user not found"})

        return res.status(200).send({message:"proposal added",data:user})
    }
    catch(ex)
    {
        next(ex)
    }
}

exports.removeProposal=async(req,res,next)=>{
    try{
        console.log(req.params.id)
        let user=await User.findByIdAndUpdate(req.user._id,{$pull:{proposals:{_id:req.params.id}}})
        if(!user) return res.status(404).send({error:"user not found"})

        return res.status(200).send({message:"proposal removed",data:user})
    }
    catch(ex)
    {
        next(ex)
    }
}

exports.likeProposal=async(req,res,next)=>{
    try
    {
       let user=await User.findOne({$in:{proposals:{_id:req.params.id}}})
       let proposals=user.proposals.map(proposal=>{
           if(proposal._id==req.params.id)
             proposal.likes++
            return proposal
       })
       user.proposals=proposals
       user=await user.save()
       if(user) return res.status(200).send({message:"liked",data:user})
       
    }
    catch(ex)
    {
       next(ex)
    }
}

exports.disLikeProposal=async(req,res,next)=>{
    try
    {
       let user=await User.findOne({$in:{proposals:{_id:req.params.id}}})
       let proposals=user.proposals.map(proposal=>{
           if(proposal._id==req.params.id)
             proposal.likes--
            return proposal
       })
       user.proposals=proposals
       user=await user.save()
       if(user) return res.status(200).send({message:"disliked",data:user})
       
    }
    catch(ex)
    {
       next(ex)
    }
}

exports.newCertificate=async(req,res,next)=>{
    try{
        let user=await User.findById(req.user._id)
        if(!user) return res.status(404).send({error:"user ot found"})

        let certificate=await Certificate.findById(req.params.id)
        if(!certificate) return res.status(404).send({error:"certificate ot found"})
        

        if (req.files && req.files.certificate) {
            
            
            req.files.certificate.name=`${certificate.name}.${req.files.certificate.mimetype.split('/')[1]}`
            const new_certificate=await uploadFile(`public/certificats`,`${user.first_name}${user.last_name}`,req.files.certificate, "pdf")


            if(new_certificate!=="error") 
    
            user=await User.findByIdAndUpdate(req.user._id,{$push:{certificates:{certificate:req.params.id,document:new_certificate}}})
            
            certificate=await Certificate.findByIdAndUpdate(req.params.id,{$push:{owners:user._id}})
            if(!user || !certificate) return res.status(400).send({error:"failed updated cv"})
            return res.status(200).send({message:"cv updated",data:user})
        }
        return res.status(500).send({eror:"cv not found"})

    }
    catch(ex)
    {
        
    }
}

exports.removeCertificate=async(req,res,next)=>{
    try{
        var user=await User.findById(req.user._id)
        if(!user) return res.status(404).send({error:"user not found"})

        let pathCertificate=user.certificates.find(item=>item.certificate==req.params.id).document

        await deleteFile(pathCertificate)
        
        user=await User.findByIdAndUpdate(req.user._id,{$pull:{certificates:{certificate:req.params.id}}})
        
        if(user) return res.status(200).send({message:"certificate deleted",data:user})
      
        return res.status(400).send({error:"failed delete certificate"})
        
    }
    catch(ex)
    {
        next(ex)
    }
}
