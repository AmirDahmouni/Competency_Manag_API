const Certificate=require("../../models/certificate-model")
const _ = require("lodash");



exports.getAllCertificates=async(req,res,next)=>{
  try{
    let certificates=await Certificate.find({status:true})
    if(certificates) return res.status(200).send({message:"certificates found",data:certificates})

    return res.status(404).send({error:"certificates not found"})
  }
  catch(ex)
  {
    next(ex)
  }
}

exports.newCertificat=async(req,res,next)=>{
    try
    {
      let certificate=new Certificate(_.pick(req.body, ["name","type","domain"]))
      certificate=await certificate.save()
      if(certificate) return res.status(201).send({message:"certificate added",data:certificate})
      return res.status(500).send({error:"failed create certificate"})
    }
    catch(ex)
    {
        next(ex)
    }
}

exports.removeCertificate=async(req,res,next)=>{
  try{
     let certificate=await Certificate.findByIdAndUpdate(req.params.id,{status:false})
     if(certificate) return res.status(200).send({message:"certificate deleted",data:certificate})

     return res.status(404).send({error:"certificated not found"})
  }
  catch(ex)
  {

  }
}