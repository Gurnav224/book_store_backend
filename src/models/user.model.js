
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unqiue:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true});


userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return next()
    } catch (error) {
        return next(error)
    }
})

userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password)
} 

const User = mongoose.model('User', userSchema);




export default User