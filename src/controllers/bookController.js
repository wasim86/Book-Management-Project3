
const bookModel=require('../models/bookModel')
const userModel=require('../models/userModel')
const {isValidDate,isValidISBN, isIdValid, isValidString,isValidName}= require('../validator/validator')

const bookController =async function (req,res){

    try{

        let data=req.body
        let {title,excerpt,userId,ISBN,category,subcategory,releasedAt} = data
        if(Object.keys(data).length==0)  return res.status(400).send({status:false,message:"Request body doesn't be empty"})
        
        if(!title)  return res.status(400).send({status:false,message:"title is required"})
        if(!isValidString(title))  return res.status(400).send({status:false,message:"Please enter the valid title"})
        let data1= await bookModel.findOne({title:title})
        if(data1) return res.status(400).send({status:false,message:"This title is already exist in books Database"})

        if(!excerpt)  return res.status(400).send({status:false,message:"excerpt is required"})
        if(!isValidString(excerpt))  return res.status(400).send({status:false,message:"Please enter the valid excerpt"})
        
        if(!userId)  return res.status(400).send({status:false,message:"userId is required"})
        if(!isIdValid(userId)) return res.status(400).send({status:false,message:"Please enter the valid userId"})
        let data2 = await userModel.findOne({_id:userId}) 
        if(!data2)  return res.status(404).send({status:false,message:"This userId is doesn't exist in users Database"})
        
        if(!ISBN)  return res.status(400).send({status:false,message:"ISBN is required"})
        if(!isValidISBN(ISBN)) return res.status(400).send({status:false,message:"Please enter the valid ISBN"})
        let data3= await bookModel.findOne({ISBN:ISBN})
        if(data3) return res.status(400).send({status:false,message:"This ISBN is already exist in books Database"})
        
        if(!category)  return res.status(400).send({status:false,message:"category is required"})
        if(!isValidString(category) || !isValidName(category))  return res.status(400).send({status:false,message:"Please enter the valid category"})

        if(!subcategory)  return res.status(400).send({status:false,message:"subcategory is required"})
        if(!isValidString(subcategory) || !isValidName(subcategory))  return res.status(400).send({status:false,message:"Please enter the valid subcategory"})
        
        if(!releasedAt)  return res.status(400).send({status:false,message:"releasedAt is required"})
        if(!isValidDate(releasedAt))  return res.status(400).send({status:false,message:"Please enter the valid releasedAT"})

        let bookdata= await bookModel.create(data)
        return res.status(201).send({status:true, message:'Success',data:bookdata})

    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }

}

const getBooks =async function (req,res){

    try{
        if(Object.keys(req.query).length==0){
            let data1= await bookModel.find({isDeleted:false}).select({title:1,excerpt:1,userId:1,category:1,releasedAt:1,reviews:1}).sort({title:1})
            if(data1.length==0) return res.status(404).send({status:false,message:"No books found"})
            return res.status(200).send({status:true, message:'Success',data:data1})
        }else{
            let data2= await bookModel.find({$and:[req.query,{isDeleted:false}]}).select({title:1,excerpt:1,userId:1,category:1,releasedAt:1,reviews:1}).sort({title:1})
            if(data2.length==0) return res.status(404).send({status:false,message:"No books found"})
            return res.status(200).send({status:true, message:'Success',data:data2})
        }
    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}

module.exports={bookController,getBooks}