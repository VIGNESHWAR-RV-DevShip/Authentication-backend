import express from "express";
import { getting_User_Details, updating_user_details } from "../services.js";
import { user_Auth } from "../Authorization_middleware.js";

const route = express.Router();

route.get("/",user_Auth,async(request,response)=>{

    const id= request.header("id");
    const token = request.header("token");

    const userInfo = await getting_User_Details(id,token);

    if(userInfo){
        return response.status(200).send(userInfo);
    }else{
        return response.status(400).send({message:"server busy,please try again later"});
    }

});

route.post("/",user_Auth,async (request,response)=>{

  const id= request.header("id");
  const token = request.header("token");

  const updatedFields = request.body;

  const updated = await updating_user_details(id, token,updatedFields);

  if(updated){
      return response.status(200).send(updated);
  }else{
      return response.status(400).send({message:"server busy,please try again later"});
  }
    
});

export const profileRoute = route;

