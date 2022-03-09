import express from "express";
import { generateHashedPassword } from "../services.js";
import { adding_new_user } from "../services.js";
const route = express.Router();

route.post("/", async (request,response)=>{
    const newUser = request.body;

    newUser.password = await generateHashedPassword(newUser.password);

    const userAdding = await adding_new_user(newUser);

    if(userAdding){
        return response.status(200).send({message:"added successfully"})
    }else{
       return response.status(400).send({message:"couldn't add for now , please try again later"});
    }
});

export const signupRoute = route;
