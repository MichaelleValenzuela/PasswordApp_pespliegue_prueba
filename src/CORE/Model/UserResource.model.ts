import mongoose from "mongoose";

const schema = new mongoose.Schema({
    user_id: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId
    },

    name: String,
    field: [{
        type: String,
        placeholder: String,
    }],
    type_resource: String
});
export default mongoose.model('Resource', schema);