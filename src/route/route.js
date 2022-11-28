const express=require('express') 
const { bookController, getBooks } = require('../controllers/bookController')
const router= express.Router()
const {authentication} =require('../middleware/authentication')
const {userController,login}=require('../controllers/userController')

router.post('/register',userController)

router.post('/login',login)

router.post('/books',authentication,bookController)

router.get('/books',authentication,getBooks)



router.all("/*",function (req,res){
    return res.status(404).send({status:false,message:"Page not found"})
})

module.exports=router