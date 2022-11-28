// const bookModel= require('../controllers/bookController')

// const authorisation =async function (req,res,next){

//     try{
        
//         const id = req.params.bookId
//             if (!idCharacterValid(id)) return res.status(400).send({ status: false, message: "Please provide the valid book id" })
    
//             const data = await bookModel.findById(id)
//             if (!data) return res.status(404).send({ status: false, message: "id not found in book DB" })

//             const book = data.bookId
//             const reqId = req.id
//             if (authorid != reqId) return res.status(400).send({ status: false, message: "Unauthorized User" })

//             next()

//         }catch(error){
//             return res.status(500).send({status:false,message:error.message})
//         }

// }

// module.exports.authorisation=authorisation