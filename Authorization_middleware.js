import jwt from "jsonwebtoken";

export const user_Auth = (request,response,next)=>{
try{
    const token = request.header("token");
    jwt.verify(token,process.env.SECRET_KEY)
    next();
}
catch(err){
     response.status(400).send({message:"you should login first",error:err.message});
    }
}