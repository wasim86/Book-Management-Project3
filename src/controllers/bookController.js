
const bookModel=require('../models/bookModel')
const userModel=require('../models/userModel')
const reviewModel= require('../models/reviewModel')
const {isValidDate,isValidISBN, isIdValid, isValidString,isValidName}= require('../validator/validator')

const createBook =async function (req,res){

    try{

        let data=req.body
        let {title,excerpt,userId,ISBN,category,subcategory,releasedAt} = data
        if(Object.keys(data).length==0)  return res.status(400).send({status:false,message:"Request body doesn't be empty"})
        
        if(!title)  return res.status(400).send({status:false,message:"title is required"})
        if(!isValidString(title))  return res.status(400).send({status:false,message:"Please enter the valid title"})
        let data1= await bookModel.findOne({title:title })
        if(data1) return res.status(400).send({status:false,message:"This title is already exist in books Database"})

        if(!excerpt)  return res.status(400).send({status:false,message:"excerpt is required"})
        if(!isValidString(excerpt))  return res.status(400).send({status:false,message:"Please enter the valid excerpt"})
        
        if(!userId)  return res.status(400).send({status:false,message:"userId is required"})
        if(!isIdValid(userId)) return res.status(400).send({status:false,message:"Please enter the valid userId"})
        let data2 = await userModel.findOne({_id:userId, isDeleted:false}) 
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
            if(data1.length==0) return res.status(404).send({status:false,message:"book is already deleted or doesn't exist"})
            return res.status(200).send({status:true, message:'Success',data:data1})

        }else{

            let data2= await bookModel.find({$and:[req.query,{isDeleted:false}]}).select({title:1,excerpt:1,userId:1,category:1,releasedAt:1,reviews:1}).sort({title:1})
            if(data2.length==0) return res.status(404).send({status:false,message:"book is already deleted or doesn't exist"})
            return res.status(200).send({status:true, message:'Success',data:data2})

        }
    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}


const getBookReviewData = async function (req,res){
    try{
        let data=req.params.bookId
        if(Object.keys(req.params).length==0) return res.status(400).send({status:false,message:"BookId is required in path params"})

        if(!isIdValid(data))  return res.status(400).send({status:false,message:"invalid bookId"})
        let data2= await bookModel.findOne({_id:data , isDeleted:false}).select({__v:0})
        if(!data2) return res.status(404).send({status:false,message:"book is already deleted or doesn't exist"})

        let data1= await reviewModel.find({bookId:data , isDeleted:false}).select({isDeleted:0,__v:0,createdAt:0,updatedAt:0})
        let obj={...data2._doc,reviewsData:data1}

        return res.status(200).send({status:true, message:'Success',data:obj})

    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}

const updateBook = async function (req,res){
    try{
    let updatedBody = req.body;
    
    let bookId = req.params.bookId;
    if(!isIdValid(bookId)) return res.status(400).send({ status: false, message: "BookId is invalid" });

    let {title,excerpt,releasedAt, ISBN } = updatedBody

    if (Object.keys(updatedBody).length == 0) return res.status(400).send({ status: false, message: "Request body doesn't be empty" });

    let bookPresent = await bookModel.findById(bookId);
    if (!bookPresent) return res.status(400).send({ status: false, message: "Book id is Incorrect" });
    if (bookPresent["isDeleted"] == true) { return res.status(404).send({ status: false, message: "Book is already deleted" }) }

    let tit= await bookModel.findOne({title:title})
    if(tit) return res.status(400).send({status:false,message:"This title is already exist in Database"})

    let isb= await bookModel.findOne({ISBN:ISBN})
    if(isb) return res.status(400).send({status:false,message:"This ISBN is already exist in Database"})
    
    let updatedBook = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: {title, excerpt, releasedAt, ISBN }},{ new: true });
      
    res.status(200).send({ status: true, message: "Success", data: updatedBook });

    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}

const deleteBook = async function (req, res) {
    try {
      let bookId = req.params.bookId;

      if(Object.keys(req.params).length==0) return res.status(400).send({ status: false, message: "BookId is required" });
      if(!isIdValid(bookId)) return res.status(400).send({ status: false, message: "invalid bookId" });

      let data = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false },{ isDeleted: true, deletedAt: new Date(Date.now()) },{ new: true });
      if(!data) return res.status(404).send({ status: false, message: "Book is already deleted or doesn't exist" });
   
      return res.status(200).send({ status: true, message: "Book deleted succesfully" })
    } 
    catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  }


module.exports={createBook,getBooks,getBookReviewData,updateBook ,deleteBook}


