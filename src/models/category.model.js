import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({
    category:{
        type:String
    },
    img:{
        type:String
    }
},{timestamps:true});


export const Category = mongoose.model('Category', categorySchema);

