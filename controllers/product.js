import express from "express";
import { ObjectId } from "mongodb";
import { user_Auth } from "../Authorization_middleware.js";
import {productModel} from "../productsSchema.js";
const route = express.Router();

route.get("/",async(request,response)=>{

    try{

        const products = await productModel.find({});
    
        if(products){
            return response.send(products);
        }
        return response.status(400).send({message:"no products"});
    }
    catch(error){
        console.log(error.message);
    }
})

route.post("/add",async(request,response)=>{

    try{
   
          const newProduct = request.body;
     
          const productToAdd = new productModel({...newProduct});
     
          const productAdded = await productToAdd.save();
     
         if(productAdded){
             return response.send(productAdded);
         }
         else{
             return response.status(400).send({message:"couldnt add"})
         }
   }
   catch(error){
        console.log(error.message);
   }

});

route.put("/edit", async(request,response)=>{
    try{
         const productId = request.header("id");
         const updatedProduct = request.body;

         const productUpdate = await productModel.findByIdAndUpdate({_id:ObjectId(productId)},
                                                                    {...updatedProduct});

        if(productUpdate){
            return response.send(productUpdate);
        }
        return response.status(400).send({message:"couldnt update"});
    }
    catch(error){
        console.log(error.message);
    }
});

route.delete("/remove",async(request,response)=>{

  try{
       const productTobeDeleted = request.header("id");
   
       const deleteProduct = await productModel.findByIdAndDelete({_id:ObjectId(productTobeDeleted)});
   
       if(deleteProduct){
           return response.send(deleteProduct);
       }
        return response.status(400).send({"message":"couldnt delete"});
  }
  catch(error){
    console.log(error.message);
  }    
});









export const productRoute = route;