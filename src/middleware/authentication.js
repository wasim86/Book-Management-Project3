
const jwt= require('jsonwebtoken')

const authentication = function (req,res,next){

    try {
        let token = req.headers["x-api-key"]
        if (!token) return res.status(400).send({ status: false, message: "token is mandatory" })
        
        let decodedToken = jwt.verify(token, "secretKey")
        req.id = decodedToken["userId"]
        next()
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

module.exports.authentication=authentication







