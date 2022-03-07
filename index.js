import express from "express";
import { MongoClient,ObjectId } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import {user_Auth} from "./Authorization_middleware.js";

dotenv.config();

const app = express();

const MongoURL = process.env.MongoDB_URL;
const port = process.env.PORT;

async function createConnection(){
    const client = await MongoClient.connect(MongoURL);
    console.log("database connected");
    return client;
}
const client = await createConnection();

app.use(express.json());
app.use(cors());

async function generateHashedPassword(password){
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    return hashedPassword;
  }; 

app.post("/login",async (request,response)=>{
    const user = request.body;

    const existingUser = await client.db("devShip")
                                     .collection("authenticated_Users")
                                     .findOne({userName:user.userName});

    if(existingUser){
        const  passwordCheck = await bcrypt.compare(user.password,existingUser.password); 

        if(passwordCheck){
            const token = jwt.sign({id:existingUser._id},process.env.SECRET_KEY);
            return response.status(200).send({id:(existingUser._id.toString()),token});
        }else{
            return response.status(400).send({message:"Invalid User"});
        }

    }else{
           return response.status(400).send({message:"Invalid User"});
    }
});

 app.post("/signUp", async (request,response)=>{
     const newUser = request.body;

     newUser.password = await generateHashedPassword(newUser.password);

     const userAdding = await client.db("devShip")
                                    .collection("authenticated_users")
                                    .insertOne(newUser);

     if(userAdding){
         return response.status(200).send({message:"added successfully"})
     }else{
        return response.status(400).send({message:"couldn't add for now , please try again later"});
     }
});

app.get("/dashboard",user_Auth,async(request,response)=>{
       const id = request.header("id");

       const userInfo = await client.db("devShip")
                                    .collection("authenticated_Users")
                                    .findOne({_id:ObjectId(id)})
                                    .projection({_id:0,firstName:1,lastName:1});

       if(userInfo){
           return response.status(200).send(userInfo);
       }else{
        return response.status(400).send({message:"server busy,please try again later"});
       }

})

  app.get("/profile",user_Auth,async(request,response)=>{

      const id= request.header("id");

      const userInfo = await client.db("devShip")
                                   .collection("authenticated_Users")
                                   .findOne({_id:ObjectId(id)})
                                   .projection({_id:0,password:0});

      if(userInfo){
          return response.status(200).send(userInfo);
      }else{
          return response.status(400).send({message:"server busy,please try again later"});
      }
  })
 


app.listen(port,console.log("server started at ",port));