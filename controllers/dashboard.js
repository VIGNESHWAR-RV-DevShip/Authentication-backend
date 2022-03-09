import express from "express";
import { user_Auth } from "../Authorization_middleware.js";
import { getting_User_Details } from "../services.js";

const route = express.Router();

route.get("/",user_Auth,async(request,response)=>{
    const id = request.header("id");
    const token = request.header("token");

    const userInfo = await getting_User_Details(id,token);

    if(userInfo){
        return response.status(200).send(userInfo);
    }else{
     return response.status(400).send({message:"server busy,please try again later"});
    }
})

export const dashboardRoute = route;
