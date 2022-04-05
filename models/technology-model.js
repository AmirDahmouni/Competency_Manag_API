const mongoose = require("mongoose");

const technologySchema = new mongoose.Schema({
  name: { type: String, required:true },
  type:{type:String,required:true},
  version:{type:Number,required:true},
  logo:{type:String,required:false},
  domain:{type:String,required:true,enum: [
      "Web Developpement",
      "Mobile Developpement",
      "Machine Learning",
      "Data Scientist",
      "Devops",
      "Cloud Developpement",
      "Webdesign",
      "Cybersecurity",
      "Business Analyst",
      "Video-Game Developpement",
      "Testing",
      "software architecture"
      ,"Networking"
    ]},
  status:{type:Boolean,required:true,default:true},
  developers:[{type:mongoose.Schema.Types.ObjectId,ref:"User",required:false}],
  projects:[{type:mongoose.Schema.Types.ObjectId,ref:"Project",required:false}]
});

const technologyModel = mongoose.model('Technology', technologySchema);
module.exports=technologyModel;