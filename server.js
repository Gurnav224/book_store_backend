import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connetToDB } from "./src/config/connect.db.js";
import categoryRouter from './src/routes/category.routes.js'
import bookRouter from './src/routes/book.routes.js';

const PORT = process.env.PORT || 5000;

connetToDB()

const app = express();


app.use(express.json())
app.use(morgan("dev"));
app.use(cors())

app.get('/', (req, res) => {
    res.send('<h1>Welcome to the  Book store server</h1>')
})

app.use('/categories',categoryRouter);
app.use('/books', bookRouter)

app.listen(PORT, () => {
    console.log(`server started at http:localhost:${PORT}`)
})