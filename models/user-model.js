const mongoose = require("mongoose");
const jwt=require('jsonwebtoken');
const Joi = require('joi');

const JoiObjectId=require("joi-objectid");



const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  avatar:{type:String,required:true,default:"public/images/avatars/pardefault.png"},
  email: {type: String, required: true, unique: true, index: true, dropDups: true},
  gender: { type: String, enum: ["male", "female"] },
  password: { type: String,minlength: 8, required: true },
  address:{
    city: { type: String, default: "" },
    country: { type: String, default: "" },
    zipcode: { type: String, default: "" },
  },
  phone:{type:String,minlength:8},
  role: { type: String,enum: ["developper", "project manager", "responsable"],default: "" },
  busy:{type:Boolean,required:true,default:false},
  cv:{type:String,required:true,default:""},
  status:{type: Boolean,required:true,default:true},
  certificates:[
    {
      certificate:{type:mongoose.Schema.Types.ObjectId,ref:"Certificat",required:false},
      document:{type:String,required:true}
    }
  ],
  proposals:[{
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    likes:{type:Number,default:0},
    date: { type: Date, default: Date.now }
  }],
  projects:[{type:mongoose.Schema.Types.ObjectId,ref:"Project",required:false}],
  technologies:[{type:mongoose.Schema.Types.ObjectId,ref:"Technology",required:true}],
  trainings:[{type:mongoose.Schema.Types.ObjectId,ref:"Training",required:false}],
  quiz:[{
    quiz:{ type:mongoose.Schema.Types.ObjectId,ref:"Quiz",required:false},
    mark:{type:Number,default:0},
    status:{type:String,enum:["not yet","passed","ignored"]} 
  }],
  notifications:[{type:mongoose.Schema.Types.ObjectId,ref:"Notification"}]
});

userSchema.methods.generateAuth = function () {
  
  return jwt.sign(
    {
      _id: this._id,
      username: this.first_name+" "+this.last_name,
      role: this.role,
      busy: this.busy,
    },
    process.env.JWT,
    {
      expiresIn: '24h',
    }
  );
};


function validateUser(userverify) {
  const schema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    role:Joi.string().valid("developper", "project manager", "responsable"),
    gender:Joi.string().valid("male","female"),
    email:Joi.string().email().required(),
    password: Joi.string().min(8).max(20).required(),
    rePassword: Joi.string().min(8).max(20).required(),
    country:Joi.string(),
    city: Joi.string(),
    zipcode: Joi.number(),
    technologies:Joi.any(),
    phone:Joi.string().min(8).max(14).regex(/^[0-9]+$/).required()
  });
  return schema.validate(userverify);
};

function validateSignin(loginverify) {
  const schema = Joi.object({
    login_method: Joi.string().valid('email', 'phone').required(),
    email:Joi.string().email(),
    phone:Joi.string().min(8).max(14),
    password: Joi.string().min(8).max(20).required(),
  }).xor('email', 'phone').required();
  
  return schema.validate(loginverify);
};


const userModel = mongoose.model('User', userSchema);

module.exports.validate = validateUser;
module.exports.validateSignin=validateSignin;
module.exports.User=userModel;