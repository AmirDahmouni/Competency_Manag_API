const { required } = require("joi");
const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name:{type:String,required:true},
  phone:{type:String,minlength:8,required:true},
  email: {type: String, required: true, unique: true, index: true, dropDups: true},
  linkedIn:{type:String,required:false,default:""},
  avatar:{type:String,required:true,default:"public/images/clients/pardefault.png"},
  address:{
    city: { type: String, default: "" },
    country: { type: String, default: "" },
    zipcode: { type: String, default: "" },
  },
  projects:[{type:mongoose.Schema.Types.ObjectId,ref:"Project",required:false}]
});

const clientModel = mongoose.model('Client', clientSchema);
module.exports=clientModel;