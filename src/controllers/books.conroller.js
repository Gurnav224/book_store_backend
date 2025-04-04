import { Book } from "../models/book.model.js"



export const getBooks = async (req, res) => {
    try {
        const books = await Book.find({});
        res.status(200).json(books)
    } catch (error) {
        console.error('failed to fetch books from database', error)
        res.status(500).json({error:'error to get books'})
    }
}