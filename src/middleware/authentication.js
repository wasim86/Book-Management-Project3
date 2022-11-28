
const jwt= require('jsonwebtoken')

const authentication = function (req,res,next){

    try {
        let token = req.headers["x-api-key"]
        if (!token) return res.status(400).send({ status: false, message: "token is mandatory" })
        
         jwt.verify(token, "secretKey",function (err, decodedToken){
            if (err) {
              return res.status(400).send({ status: false, message: 'Invalid Token' })
            }
            req.id = decodedToken
            next()
        })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

module.exports.authentication=authentication







