import { Category } from "../models/category.model.js"



export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories)
    } catch (error) {
        console.error(error)
        res.status(500).json({error:'failed to get categories'})
    }
}