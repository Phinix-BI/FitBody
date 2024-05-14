import mongoose from "mongoose";

const communityChatSchema = new mongoose.Schema({

    userId : {type: String, ref: 'User' , required: true},
    sender : {type: String, ref: 'User'},
    messages :[{
        message : {type: String},
        image : {type: String},
        like : {type: Number , default:0}, // Number of likes 
        comment : [{
            userId : {type: String, ref: 'User'}, 
            comment : {type: String},
            time : {type: Date, default: Date.now}
        }],
       
        time : {type: Date, default: Date.now},
        tags : [{type: String}],
    }],

}, {timestamps: true});


const communityChat = mongoose.model("CommunityChat", communityChatSchema);

export default communityChat;