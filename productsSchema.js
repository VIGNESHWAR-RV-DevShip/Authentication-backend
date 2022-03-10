import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    status:{type:Boolean,required:true}
}) ;

export const productModel = mongoose.model("products",productSchema);