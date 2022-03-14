// import { client } from "./index.js";
import { ObjectId } from "mongodb";
import { userModel } from "./productsSchema.js";
import bcrypt from "bcrypt";
import multer from "multer";

export async function generateHashedPassword(password){
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    return hashedPassword;
  }; 


export async function adding_new_user(newUser) {

    return await userModel.create(newUser);

};


export async function assigning_token(existingUser, token) {

    return await userModel.findOneAndUpdate({ _id: existingUser._id },
                                             { $set: { token: token } });

}
export async function checking_existing_user(user) {

    return await userModel.findOne({ email: user.email });

}


export async function updating_user_details(id, token,updatedFields) {
    return await userModel.findOneAndUpdate({ _id: ObjectId(id), token: token },
                                            {$set: {...updatedFields}});
}
export async function getting_User_Details(id,token) {
    return await userModel.findOne({ _id: ObjectId(id), token: token },
                                   { projection: { _id: 0, password: 0, token: 0 } });
}

export async function signingOut(id, token) {
    return await userModel.findOneAndUpdate({ _id: ObjectId(id), token: token }, { $unset: { token: "" } });
}


const fileStorageEngine = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'./images')
    },
    filename:(req,file,callback)=>{
        const name = file.originalname.split('.'); //splitting at dot
        const extension = name.pop();//poping last character
        callback(null,name.join(".")+"--"+Date.now()+"."+extension);
    },
});

 export const upload = multer({storage:fileStorageEngine});

const fileStorageEngineMulti = multer.diskStorage({
destination:(req,file,callback)=>{
    callback(null,'./images')
},
filename:(req,file,callback)=>{
    
    const name = file.originalname.split('.');
    callback(null,name[0]+"--"+Date.now()+"."+name[name.length-1]);
},
});

export const uploadMulti = multer({storage:fileStorageEngineMulti});