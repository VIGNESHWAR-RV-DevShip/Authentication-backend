import express from "express";
import { user_Auth } from "../Authorization_middleware.js";
import { signingOut } from "../services.js";
const route = express.Router();

route.post("/",user_Auth,async (request,response)=>{
      
    const id = request.header("id");
    const token = request.header("token");

    const signedOut = await signingOut(id, token);

    if(signedOut){
        return response.status(200).send(signedOut);
    }else{
        return response.status(400).send({message:"server busy,please try again later"});
    }

})

export const signoutRoute = route;


