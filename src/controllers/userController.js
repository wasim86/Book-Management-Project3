const userModel=require('../models/userModel')
const {isValidPassword, isValidEmail, isIdValid, isValidString,isValidName,isValidMobile}= require('../validator/validator')
const jwt=require('jsonwebtoken')

const createUser =async function (req,res){

    try{

        let data=req.body
        let {title,name,phone,email,password,address} =data
        if(Object.keys(data).length==0)  return res.status(400).send({status:false,message:"Request body doesn't be empty"})
        
        if(!title)  return res.status(400).send({status:false,message:"title is required"})
        if(!isValidString(title) || !isValidName(title))  return res.status(400).send({status:false,message:"Please enter the valid title"})
        let arr=["Mr", "Mrs", "Miss"]
        if(!arr.includes(title))  return res.status(400).send({status:false,message:"title is not given format"})
        
        if(!name)  return res.status(400).send({status:false,message:"name is required"})
        if(!isValidString(name) || !isValidName(name))  return res.status(400).send({status:false,message:"Please enter the valid name"})
        
        if(!phone)  return res.status(400).send({status:false,message:"phone is required"})
        if(!isValidMobile(phone)) return res.status(400).send({status:false,message:"Please enter the valid phone number"})
        let data1 = await userModel.findOne({phone:phone}) 
        if(data1)  return res.status(400).send({status:false,message:"This phone number is already exist in users Database"})
        
        if(!email)  return res.status(400).send({status:false,message:"email is required"})
        if(!isValidEmail(email)) return res.status(400).send({status:false,message:"Please enter the valid email"})
        let data2= await userModel.findOne({email:email})
        if(data2) return res.status(400).send({status:false,message:"This email is already exist in users Database"})
        
        if(!password)  return res.status(400).send({status:false,message:"password is required"})
        if(!isValidPassword(password))  return res.status(400).send({status:false,message:"Please enter the valid password"})

        let userdata= await userModel.create(data)
        return res.status(201).send({status:true, message:'Success',data:userdata})

    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }

}

const login =async function (req,res){

  try{
      
    let data= req.body
    let {email,password}=data
    if(Object.keys(data).length==0)  return res.status(400).send({status:false,message:"Request body doesn't be empty"})
    if(!email)  return res.status(400).send({status:false,message:"email is required"})
    if(!password)  return res.status(400).send({status:false,message:"password is required"})
    let userdata= await userModel.findOne({email:email,password:password})
    if(!userdata) return res.status(404).send({status:false,message:"Email and password doesn't match with users Database"})
    let encoded = jwt.sign({userId:userdata._id},"secretKey",{expiresIn: '10h'})
    return res.status(200).send({status:true, message:'Success',data:{token:encoded}})

  }catch(error){
    return res.status(500).send({status:false,message:error.message})
  }

}

module.exports={createUser,login}