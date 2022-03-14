
import express from "express";
import { ObjectId } from "mongodb";
import * as fs from "fs";
import { __dirname } from "../index.js";
// import GridFsStorage from "multer-gridfs-storage";
 import { user_Auth } from "../Authorization_middleware.js";
// import { client2 } from "../index.js";
import { upload,uploadMulti } from "../services.js";
import {productModel} from "../productsSchema.js";
// import path from "path";
// import { fileURLToPath, pathToFileURL } from 'url';
// import {unlink} from "fs/promises";

const route = express.Router();

// const fileStorage = new GridFsStorage({db:client2,
//                                        file:(req,file)=>{
//                                            try{
//                                                return {
//                                                   filename : (file.originalname + "_" + Date.now()),
//                                                   bucketName: "images"
//                                                };
//                                            }catch(e){
//                                                console.log(e.message);
//                                            }
//                                        }});


route.get("/",user_Auth,async(request,response)=>{

    try{

        const products = await productModel.find({isBin:false});
    
        if(products){
            return response.send(products);
        }
        return response.status(400).send({message:"no products"});
    }
    catch(error){
        console.log(error.message);
    }
})

route.get("/bin",user_Auth,async(request,response)=>{

    try{

        const products = await productModel.find({isBin:true});
    
        if(products){
            return response.send(products);
        }
        return response.status(400).send({message:"no products"});
    }
    catch(error){
        console.log(error.message);
    }
})

route.post("/add",user_Auth,async(request,response)=>{

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

route.put("/edit",user_Auth ,async(request,response)=>{
    try{
         const productId = request.header("id");
         const updatedProduct = request.body;

         const productUpdate = await productModel.findOneAndUpdate({_id:ObjectId(productId)},
                                                                    {...updatedProduct},{runValidators:true});

        if(productUpdate){
            return response.send(productUpdate);
        }
        console.log(productUpdate);
        return response.status(400).send({message:"couldnt update"});
    }
    catch(error){
        console.log(error.message);
    }
});

route.delete("/delete",user_Auth,async(request,response)=>{

  try{

    const image_To_Be_Removed = request.header("image");

    if(image_To_Be_Removed){
        fs.unlink(`${__dirname}\\${image_To_Be_Removed}`,(error)=>{
            if(error){
                console.log(error.message);
            }
           // console.log(`successfully deleted image in path - ${request.header("oldPath")}`);
        })
     }
       
       const productTobeDeleted = request.body;
   
       const deleteProduct = await productModel.deleteOne({...productTobeDeleted});
   
       if(deleteProduct){
           return response.send(deleteProduct);
       }
        return response.status(400).send({"message":"couldnt delete"});
  }
  catch(error){
    console.log(error.message);
  }    
});

route.get("/:id",user_Auth,async(request,response)=>{

    const {id} = request.params;
try{
    const productDetails = await productModel.findOne({slug:id});

    if(productDetails){
        return response.send({productDetails});
    }
    else{
        return response.status(400).send({message:"no such products"});
    }
  }
catch(e){
      return response.status(400).send(e.message);
}
});

route.put("/:id",user_Auth,async (request,response)=>{
  try{
   
        const { id } = request.params;
        const detials_To_Be_Updated = request.body;

        if(detials_To_Be_Updated.image){
            fs.unlink(`${__dirname}\\${request.header("oldPath")}`,(error)=>{
                if(error){
                    console.log(error.message);
                }
               // console.log(`successfully deleted image in path - ${request.header("oldPath")}`);
            })
         }

        const updatedProduct = await productModel.updateOne({slug:id},
                                                             {$set:{...detials_To_Be_Updated}});
    
        if(updatedProduct){
            // console.log(updatedProduct);
            return response.send(updatedProduct);
        }
        else{
            return response.status(400).send({message:"Couldnt update as of now"});
        }

   }catch(error){
        return response.status(300).send({message:error.message});
   }

})

route.post("/uploadSingle",user_Auth,upload.single("image"),async(request,response)=>{

    try{
        
        return response.send({image:request.file.path});
    }
    catch(e){
        console.log(e.message);
        return response.status(400).send(e.message);
    }

});

// route.post("/uploadMultiple",uploadMulti.array("images",3),async(request,response)=>{


//     return response.send(request.files);
// })

 export const productRoute = route;