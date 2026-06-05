import { decode } from 'jsonwebtoken';
import jwt from 'jsonwebtoken'

const adminAuth = async(req,res,next)=>{
    try {
        const token = req.headers.token;
        if(!token){
            return res.json({success:false,message:"not authorized! login again"});
        }
        const decoded_token = jwt.verify(token,process.env.JWT_SECRET);
        if(decoded_token != (process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) ){
            return res.json({success:false,message:"not authorized! login again"});
        }
        next();
    } catch (error) {
        return res.json({success:false,message:"not authorized! login again"});
    }
}
export default adminAuth;