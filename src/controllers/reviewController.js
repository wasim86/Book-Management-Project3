
const bookModel= require('../models/bookModel')
const reviewModel= require('../models/reviewModel')
const {isIdValid,isValidString ,isValidName} =require('../validator/validator')


const createReview=async function(req,res){
    try{
    const bookId=req.params.bookId
    let data=req.body
    const {reviewedBy,rating}=data

    if(Object.keys(data).length==0) return res.status(400).send({status:false,message:"Request body doesn't be empty"})
    if(!isIdValid(bookId)) return res.status(400).send({status:false,message:"invalid bookId"})
    
    if(reviewedBy || reviewedBy==""){
    if(!isValidString(reviewedBy) || !isValidName(reviewedBy)) return res.status(400).send({status:false,message:"please provide reviewer's name in the correct format"})
    }

    if(!rating) return res.status(400).send({status:false,message:"rating is required"})
    if((rating<1 || rating>5) || typeof(rating) !=='number') return res.status(400).send({status:false,message:"rating must be a number betweeen 1 to 5"})

    let update= await bookModel.findOneAndUpdate({_id:bookId ,isDeleted: false},{ $inc: { reviews: 1 } },{new:true}).select({__v:0})
    if(!update) return res.status(404).send({status:false,message:"Book data is already deleted or doesn't exist"})

    data.reviewedAt=new Date() 
    data.bookId=update._id

    const addReview=await reviewModel.create(data)
   
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
       
        let {bookId,reviewId}= req.params 
        if(Object.keys(req.body).length==0) return res.status(400).send({status:false,message:"Request body cann't be empty"})
        
        let {reviewedBy,rating,review} =req.body
        if(rating || rating==""){
        if((rating<1 || rating>5) || typeof(rating) !=='number') return res.status(400).send({status:false,message:"rating must be a number betweeen 1 to 5."})
        }

        if(!isIdValid(bookId)) return res.status(400).send({status:false,message:"invalid bookId"})
        let data1= await bookModel.findOne({ _id:bookId, isDeleted:false}).select({__v:0}) 
        if(!data1)  return res.status(404).send({status:false,message:"Book data is already deleted or doesn't exist"})

        if(!isIdValid(reviewId)) return res.status(400).send({status:false,message:"invalid reviewId"})
        let data3= await reviewModel.findOneAndUpdate({bookId:bookId ,_id:reviewId , isDeleted:false},{reviewedBy,rating,review},{new:true}).select({isDeleted:0,__v:0,createdAt:0,updatedAt:0})
        if(!data3) return res.status(404).send({status:false,message:"review data is already deleted or doesn't exist"})

        let obj={...data1._doc,reviewData:[data3]}
 
        return res.status(200).send({status:true, message:'Success',data:obj})

    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }

}

const reviewDeleteById = async function (req, res) {
    try {
       
        let {bookId,reviewId} = req.params

        if(!isIdValid(bookId))  return res.status(400).send({ status: false, message: "please enter valid bookId"});
        if(!isIdValid(reviewId))  return res.status(400).send({ status: false, message: "enter valid reviewId"});

        let data = await bookModel.findById(bookId)
        if(!data) return res.status(404).send({ status: false, message: "Book not found in DB"});
        if(data.isDeleted==true)  return res.status(400).send({ status: false, message: "Book is already deleted"});
   
        const reviewExist = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId ,isDeleted:false},{isDeleted:true})
        if (!reviewExist) return res.status(404).send({ status: false, message: "Review data is already deleted or doesn't exist"});

        let bookExist = await bookModel.findByIdAndUpdate({ _id: bookId }, { $inc: { reviews: -1} })

        return res.status(200).send({ status: true, message: "Review deleted succesfully" })

    } catch( error) {
        return res.status(500).send({ status: false, message: error.message})
    
    }
}

module.exports={createReview,reviewUpdate,reviewDeleteById}