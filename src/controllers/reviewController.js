
const bookModel= require('../models/bookModel')
const reviewModel= require('../models/reviewModel')
const {isIdValid,isValidString ,isValidName} =require('../validator/validator')


const createReview=async function(req,res){
    try{
    const bookId=req.params.bookId
    const reviewBody=req.body
    const {reviewedBy,rating}=reviewBody

    if(!isIdValid(bookId)) return res.status(400).send({status:false,message:"please provide valid bookid."})
    if(Object.keys(reviewBody).length==0) return res.status(400).send({status:false,message:"data is required to create a review."})

    if(!reviewedBy) return res.status(400).send({status:false,message:"reviewedBy is required"})
    if(!rating) return res.status(400).send({status:false,message:"rating is required"})

    if(!isValidString(reviewedBy) || !isValidName(reviewedBy)) return res.status(400).send({status:false,message:"please provide reviewer's name in the correct format."})

   if((rating<1 || rating>5) || typeof(rating) !=='number') return res.status(400).send({status:false,message:"rating must betweeen 1 to 5."})

   const searchBook=await bookModel.findById({_id:bookId})
   if(!searchBook) return res.status(404).send({status:false,message:"Book not found."})

   reviewBody.bookId=searchBook._id
   reviewBody.reviewedAt=new Date() 

   if(searchBook.isDeleted==true) return res.status(400).send({status:false,message:"Book is already deleted."})

   const addReview=await reviewModel.create(reviewBody)

   let update= await bookModel.findOneAndUpdate({_id:bookId},{ $inc: { reviews: 1 } },{new:true}).select({__v:0})

   let obj1={}
   obj1.bookId=addReview.bookId
   obj1._id=addReview._id
   obj1.reviewedBy=addReview.reviewedBy
   obj1.reviewedAt=addReview.reviewedAt
   obj1.rating=addReview.rating
   obj1.review=addReview.review

   let obj={...update._doc,reviewData:[obj1]}

   return res.status(200).send({status:true,message:'success',data:obj})

}catch(error){
    return res.status(500).send({message:error.message})
}

}

const reviewUpdate =async function (req,res){

    try{
       
        let data= req.params 

        if(!isIdValid(data.bookId)) return res.status(400).send({status:false,message:"invalid bookId"})
        let data1= await bookModel.findOne({ _id:data.bookId, isDeleted:false}).select({__v:0}) 
        if(!data1)  return res.status(400).send({status:false,message:"book is deleted"})

        if(!isIdValid(data.reviewId)) return res.status(400).send({status:false,message:"invalid reviewId"})
        let data2= await reviewModel.find({ _id:data.reviewId, isDeleted:false}) 
        if(data2.length==0)  return res.status(400).send({status:false,message:"review is deleted"})

        if(Object.keys(req.body).length==0) return res.status(400).send({status:false,message:"Request body cann't be empty"})
        let {reviewedBy,rating,review} =req.body

        let data3= await reviewModel.findOneAndUpdate({bookId:data.bookId ,_id:data.reviewId , isDeleted:false},{reviewedBy,rating,review},{new:true}).select({isDeleted:0,__v:0,createdAt:0,updatedAt:0})
        if(!data3) return res.status(404).send({status:false,message:"No data found with this bookId and reviewId "})

        let obj={...data1._doc,reviewData:data3}
 
        return res.status(200).send({status:true, message:'Success',data:obj})

    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }

}

const reviewDeleteById = async function (req, res) {
    try {
       
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;

        if(!isIdValid(bookId))  return res.status(400).send({ status: false, message: "please enter valid bookId"});

        if(!isIdValid(reviewId))  return res.status(400).send({ status: false, message: "enter valid reviewId"});
        
        const bookExist = await bookModel.findOne({ _id: bookId, isDeleted: false})
        if(!bookExist) return res.status(404).send({ status: false, message: "book not found"});


        const reviewExist = await reviewModel.findOne({ _id: reviewId, bookId: bookId ,isDeleted:false})
        if (!reviewExist) return res.status(404).send({ status: false, message: "review not found"});
        
        if ( reviewExist.isDeleted == true)
           return res.status(400).send({ status: false, message: "review is already deleted" });


        await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, {$and:[{isDeleted:true},{ $inc: { reviews: -1} }]})
        return res.status(200).send({ status: true, message: "deleted succesfully" })

    } catch( error) {
        return res.status(500).send({ status: false, message: error.message})
    
    }
}


module.exports={createReview,reviewUpdate,reviewDeleteById}