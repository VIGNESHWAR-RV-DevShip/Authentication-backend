import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import {loginRoute} from "./controllers/login.js";
import {signupRoute} from "./controllers/signup.js";
import { dashboardRoute } from "./controllers/dashboard.js";
import { profileRoute } from "./controllers/profile.js";
import { signoutRoute } from "./controllers/signout.js";


dotenv.config();

const app = express();

const MongoURL = process.env.MongoDB_URL;
const port = process.env.PORT;

async function createConnection(){
    const client = await MongoClient.connect(MongoURL);
    console.log("database connected");
    return client;
}
export const client = await createConnection();

app.use(express.json());
app.use(cors());


app.use("/login",loginRoute);

 app.use("/signup",signupRoute);

 app.use("/dashboard",dashboardRoute);

  app.use("/profile",profileRoute);

  app.use("/profile",profileRoute);

  app.use("/signout",signoutRoute);
 


app.listen(port,console.log("server started at ",port));