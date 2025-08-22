import mongoose, { mongo } from 'mongoose';

const shorUrlSchema = new mongoose.Schema({
    longUrl:{
        type:String,
        required:true,
    },
    shortCode:{
        type:String,
        required:true,
        unique:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    visits:{
        type:Number,
        default:0,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
})

const ShortUrl = mongoose.model('ShortUrl',shorUrlSchema);

export default ShortUrl;