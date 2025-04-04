import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    ISBN:{
        type:String,
        required:true,
        unique:true
    },
    publicationYear:{
        type:Number,
    },
    price:{
        type:String
    },
    stockQuantity:{
        type:String
    },
    description:{
        type:String
    },
    category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Category'
    },
    publisher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Publisher'
    },
    imageURL:{
        type:String,
        required:true
    }
})


export const Book = mongoose.model('Book',bookSchema)