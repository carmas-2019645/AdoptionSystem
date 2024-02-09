import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    race: {
        type: String,
        required: true
    }
})

//pre mongoose

export default mongoose.model('user', userSchema)