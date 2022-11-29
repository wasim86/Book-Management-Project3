
const jwt= require('jsonwebtoken')
const {isIdValid}=require('../validator/validator')
const bookModel=require('../models/bookModel')

const authentication = function (req,res,next){

    try {
        let token = req.headers["x-api-key"]
        if (!token) return res.status(400).send({ status: false, message: "token is mandatory" })
        
         jwt.verify(token, "secretKey",function (err, decodedToken){
            if (err) {
              return res.status(400).send({ status: false, message: 'Invalid Token' })
            }
            req.id = decodedToken.userId
            next()
        })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

let authorisation=async function(req,res,next){

    try{ 
      let bookId=req.params.bookId
    
      if(!isIdValid(bookId))
      return res.status(400).send({status:false,message:"please provide valid object id."})
    
      let findBook=await bookModel.findById(bookId)
      if(!findBook)
      return res.status(404).send({status:false,message:"No such book found."})
    
      if(req.id != findBook.userId) return res.status(403).send({statusbar:false,message:"Not authorized."})
      next()
    }catch(error){
      return res.status(500).send({status:false,message:error.message})
    }

  }

  

module.exports={authentication,authorisation}







