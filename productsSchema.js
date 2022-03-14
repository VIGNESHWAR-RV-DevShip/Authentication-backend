import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    email:{type:String,required:[true,"email is required"],validate:[ function(el) {
        const userEmailRegex = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$");
        console.log(userEmailRegex.test(el));
        return userEmailRegex.test(el);
      },
     { message: 'Enter a valid Email'}
    ]},
    gender:{type:String,required:true},
    password:{type:String,required:true}
})

export const userModel = mongoose.model("authenticated_users",userSchema);

const productSchema = new mongoose.Schema({
    title: {type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    status:{type:Boolean,required:true},
    image:{type:String,required:true},
    slug:{type:String,required:true},
    isBin:{type:Boolean,required:true}
}) ;

export const productModel = mongoose.model("products",productSchema);