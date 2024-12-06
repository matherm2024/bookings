import jwt from 'jsonwebtoken'

// counsllor authentication middleware 

const authCounsellor = async (req,res, next) => {
    try {

        const {ctoken} = req.headers
        if (!ctoken) {
            return res.json({success:false, message:'Not Authorised Login Again'})
        }
        const token_decode = jwt.verify(ctoken, process.env.JWT_SECRET)
        req.body.docId = token_decode.id


        next()


    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
    
}

export default authCounsellor