import { Product } from "../Models/Product.js";
import {rm} from "fs";
// Add new product
export const createProduct = async(req, res )=>{
    try {
        if(req.user.role != "admin"){
            return res.status(403).json({
                message:"Unauthorized Access",
            })
        }
        const {title, description, category, price ,stock}= req.body;
        const image= req.file;
        /* if(!image){
            return res.status(400).json({
                message:"Please select the image",
            });
        }
 */
        //store to db
        const product = await Product.create({
            title,
            description,
            category,
            price,
            stock,
            image:image?.path,

        });
        res.status(201).json({
            message:"Product Details added successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

//fetch all products

export const fetchAllProducts = async (req, res)=>{
    try {
        const products= await Product.find();
        return res.status(200).json({
            message:"List of Products",products,
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}
// Fetch single products

export const fetchSingleProducts = async (req, res)=>{
    try {
        const id= req.params.id;
        const products= await Product.findById(id);
        return res.status(200).json({
            message:"Product Details",products,
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

// Delete Product

export const deleteProducts=async (req, res)=>{
    try{
    if(req.user.role != "admin"){
        return res.status(403).json({
            message:"Unauthorized Access",
        });
    }
    const product= await Product.findById(req.params.id);
    if(!product){
        return res.status(403).json({
            message:"Invalid Product Details",
        });
    }
    rm(product.image, ()=>{
        console.log("Image Deleted!")
    })
    await product.deleteOne();
    return res.json({
        message:"Product Deleted Successfully!",
    })

    }catch(error){
        return res.status(500).json({
            message: error.message,
        });
    };
    
};