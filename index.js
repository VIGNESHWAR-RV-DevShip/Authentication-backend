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
                                     .collection("authenticated_users")
                                     .findOne({email:user.email});

    if(existingUser){
        const  passwordCheck = await bcrypt.compare(user.password,existingUser.password); 

        if(passwordCheck){
            const token = jwt.sign({id:existingUser._id},process.env.SECRET_KEY);

            const update = await client.db("devShip")
                                       .collection("authenticated_users")
                                       .updateOne({_id:existingUser._id},
                                                  {$set:{token:token}});
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

 app.post("/signup", async (request,response)=>{
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
       const token = request.header("token");

       const userInfo = await client.db("devShip")
                                    .collection("authenticated_users")
                                    .findOne({_id:ObjectId(id),token:token},
                                              {projection:{_id:0,firstName:1,lastName:1}})

       if(userInfo){
           return response.status(200).send(userInfo);
       }else{
        return response.status(400).send({message:"server busy,please try again later"});
       }
})

  app.get("/profile",user_Auth,async(request,response)=>{

      const id= request.header("id");
      const token = request.header("token");

      const userInfo = await client.db("devShip")
                                   .collection("authenticated_users")
                                   .findOne({_id:ObjectId(id),token:token},
                                             {projection:{_id:0,password:0,token:0}});

      if(userInfo){
          return response.status(200).send(userInfo);
      }else{
          return response.status(400).send({message:"server busy,please try again later"});
      }
  });

  app.post("/profile",user_Auth,async (request,response)=>{

    const id= request.header("id");
    const token = request.header("token");

    const {firstName,lastName,email,gender} = request.body;

    const updated = await client.db("devShip")
                                 .collection("authenticated_users")
                                 .updateOne({_id:ObjectId(id),token:token},
                                           {$set:{firstName,lastName,email,gender}});

    if(updated){
        return response.status(200).send(updated);
    }else{
        return response.status(400).send({message:"server busy,please try again later"});
    }
      
  })

  app.post("/signout",user_Auth,async (request,response)=>{
      
      const id = request.header("id");
      const token = request.header("token");

      const signedOut = await client.db("devShip")
                                   .collection("authenticated_users")
                                   .updateOne({_id:ObjectId(id),token:token},{$unset:{token:""}});

      if(signedOut){
          return response.status(200).send(signedOut);
      }else{
          return response.status(400).send({message:"server busy,please try again later"});
      }

  })
 


app.listen(port,console.log("server started at ",port));