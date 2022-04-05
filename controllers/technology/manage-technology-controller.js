const Technology=require("../../models/technology-model")
const _ = require("lodash");
const {uploadImage}=require("../../helpers/manage-file")



exports.newTechnology=async(req,res,next)=>{
    try{

        let technology=new Technology(_.pick(req.body, ["name","type","version","domain"]))
        if (req.files && req.files.logo) {
         req.files.logo.name=`logo.${req.files.logo.mimetype.split('/')[1]}`
         const new_image=await uploadImage(`public/images/technologies`,`${req.body.name}${req.body.version}`,req.files.logo, "image")
         if(new_image!=="error") technology.logo = new_image
         technology=await technology.save()
        }
        return res.status(201).send({message:"technology saved",data:technology})
    }
    catch(ex)
    {
        next(ex)
    }
}

exports.deleteTechnology=async(req,res,next)=>{
    try
    {
        let technology=await Technology.findByIdAndUpdate(req.params.id,{status:false})
        if(!technology) res.status(400).send({error:"technology not found"})
        return res.status(200).send({message:"technology deleted",data:technology})
    }
    catch(ex)
    {
        next(ex)
    }
}
