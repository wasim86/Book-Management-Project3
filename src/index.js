const express=require('express')
const mongoose=require('mongoose')
const route=require('./route/route')
const app=express()
const multer = require("multer")
const {AppConfig} = require("aws-sdk")

app.use(express.json())

app.use(multer().any())

mongoose.connect("mongodb+srv://Wasim:sjdwsm86@mycluster.hazwc4e.mongodb.net/Project3",{useNewUrlParser:true})
.then(()=> console.log("MongoDB connected"))
.catch((err)=> console.log(err))
app.listen(3000,function(){
    console.log("Connected on Port 3000")
})

app.use('/',route)