import express from "express";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import {loginRoute} from "./controllers/login.js";
import {signupRoute} from "./controllers/signup.js";
import { dashboardRoute } from "./controllers/dashboard.js";
import { profileRoute } from "./controllers/profile.js";
import { signoutRoute } from "./controllers/signout.js";
import { productRoute } from "./controllers/product.js";


dotenv.config();

const app = express();

const MongoURL = process.env.MongoDB_URL;
const dbName = process.env.DB_NAME;
const port = process.env.PORT;

async function createConnection(){
    const client = await MongoClient.connect(MongoURL);
    console.log("database connected");
    return client;
}
export const client = await createConnection();

async function createMongooseConnection(){
  try{
  const client = await mongoose.connect(MongoURL,{dbName});
  console.log("database connected with mongoose");
  return client;
  }
  catch(e){
    console.log(e.message);
  }
}
export const client2 = await createMongooseConnection();


app.use(express.json());
app.use(cors());


app.use("/login",loginRoute);

 app.use("/signup",signupRoute);

 app.use("/dashboard",dashboardRoute);

  app.use("/profile",profileRoute);

  app.use("/signout",signoutRoute);
 
  app.use("/products",productRoute);

app.listen(port,console.log("server started at ",port));