const mongoose=require('mongoose')
const objectId=mongoose.Schema.Types.ObjectId

const reviewModel =new mongoose.Schema({

  bookId: {type:objectId, required:true, ref:"Book"},
  reviewedBy: {type:String,required:true, default: 'Guest'},
  reviewedAt: {type:Date,required:true},
  rating: {type:Number,required:true,min:1,max:5},
  review: {type:String},
  isDeleted: {type:Boolean, default: false}

},{timestamps:true})

module.exports=mongoose.model("Review",reviewModel)