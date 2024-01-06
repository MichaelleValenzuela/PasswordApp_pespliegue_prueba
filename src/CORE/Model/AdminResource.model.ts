import mongoose from "mongoose";

const schema = new mongoose.Schema({
    user_id: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId
    },

    name_type: String,
    
    fields: [{
        name_field: String,
        type_field: String
    }]
});
export default mongoose.model('AdminResource', schema);