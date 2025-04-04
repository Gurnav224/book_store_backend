
import express from 'express';
import { getBooks } from '../controllers/books.conroller.js';

const router = express.Router();


router.get('/', getBooks);


export default router;