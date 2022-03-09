import { client } from "./index.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export async function generateHashedPassword(password){
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    return hashedPassword;
  }; 


export async function adding_new_user(newUser) {
    return await client.db("devShip")
        .collection("authenticated_users")
        .insertOne(newUser);
};


export async function assigning_token(existingUser, token) {
    return await client.db("devShip")
        .collection("authenticated_users")
        .updateOne({ _id: existingUser._id },
            { $set: { token: token } });
}
export async function checking_existing_user(user) {
    return await client.db("devShip")
        .collection("authenticated_users")
        .findOne({ email: user.email });
}


export async function updating_user_details(id, token, firstName, lastName, email, gender) {
    return await client.db("devShip")
        .collection("authenticated_users")
        .updateOne({ _id: ObjectId(id), token: token },
            { $set: { firstName, lastName, email, gender } });
}
export async function getting_User_Details(id,token) {
    return await client.db("devShip")
        .collection("authenticated_users")
        .findOne({ _id: ObjectId(id), token: token },
            { projection: { _id: 0, password: 0, token: 0 } });
}

export async function signingOut(id, token) {
    return await client.db("devShip")
        .collection("authenticated_users")
        .updateOne({ _id: ObjectId(id), token: token }, { $unset: { token: "" } });
}