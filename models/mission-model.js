const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  date_begin: { type: Date, required: true,default: Date.now },
  date_end:{type:Date,required:true},
  description:{type:String,required:true},
  mark:{type:Number,required:true,default:0},
  developer:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
  project:{type:mongoose.Schema.Types.ObjectId,ref:"Project",required:true},
  tasknumber:{type:Number,default:0,required:true},
  status:{type:String,default:"started",enum:["started","closed"]},
  technologies:[{
    technology:{type:mongoose.Schema.Types.ObjectId,ref:"Technology",required:true},
    cleancode:{type:Number,default:0,required:true},
    progressstate:{type:Number,default:0,required:true},
    fixbugs:{type:Number,default:0,required:true}
  }]
});

const projectModel = mongoose.model('Mission', projectSchema);
module.exports=projectModel;