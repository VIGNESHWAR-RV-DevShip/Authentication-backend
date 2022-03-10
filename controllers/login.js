import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { checking_existing_user, assigning_token } from "../services.js";

const route = express.Router();

route.post("/",async (request,response)=>{
    const user = request.body;

    const existingUser = await checking_existing_user(user);

    if(existingUser){
        const  passwordCheck = await bcrypt.compare(user.password,existingUser.password); 

        if(passwordCheck){
            const token = jwt.sign({id:existingUser._id},process.env.SECRET_KEY);

            const update = await assigning_token(existingUser, token);
           if(update){
               return response.status(200).send({id:(existingUser._id.toString()),token});
           }
            
        }else{
            return response.status(400).send({message:"Invalid User"});
        }

    }else{
           return response.status(400).send({message:"Invalid User"});
    }
});

export const loginRoute = route;


