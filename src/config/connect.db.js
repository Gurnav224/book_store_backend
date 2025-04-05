import mongoose from "mongoose"



export const connetToDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI,{dbName:'book_store_DB'});
        if(connection){
            console.log(`successfully connected to database ${connection.connection.db.databaseName}`)
        }

      
    } catch (error) {
        console.error('failed to connect database ', error)
    }
}