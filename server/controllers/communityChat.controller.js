
import communityChat from "../models/communityChat.model.js";
import User from "../models/User.js";


// sendMessage function is used to send a message to the community chat
export const sendMessage = async (req, res) => {

    const {message,image} = req.body;
    const { userId } = req.params;

    const tagRegex = /#\w+/g;
    const tags = message.match(tagRegex);

    if(!userId || (!message && !image)){
        return res.status(400).json({message: "All fields are required"});
    }

    const findUser = await User.findById({_id:userId});
   
    if(!findUser){
        return res.status(404).json({message: "User Not Found"});
    }

    const findChat = await communityChat.findOne({userId});

    try{

       if(findChat){
            findChat.messages.push({
                message,
                image,
                tags,
            });
            await findChat.save();
            return res.status(201).json({message: "Message Sent"});
       }

        const newMessage = new communityChat({
            userId,
            sender : findUser.userName,
            messages : [{
                message,
                image,
                tags,
            }]
        });

        await newMessage.save();

        return res.status(201).json({message: "Message Sent"});
    }catch(error){
        return res.status(500).json({message: error.message});
    }

   
};

// getAllMessages function is used to get all the messages from a particular user
export const getAllMessages = async (req, res) => {

     const {userId} = req.params;

     if(!userId){
        return res.status(400).json({message: "User Id is required"});
     }

    try{
        const userExists = await User.findById({_id:userId});

        if(!userExists){
            return res.status(404).json({message: "User Not Found"});
        }

        const getAllPosts = await communityChat.findOne({userId});

        if(!getAllPosts){
            return res.status(404).json({message: "No Messages Found"});
        }

        return res.status(200).json(getAllPosts.messages);
    }catch(error){
        return res.status(500).json({message: error.message});
    }


}

// findSingleMessage function is used to find a single message from a particular user
const findSingleMessage = async (userId,messageId) => {

    if(!userId || !messageId){
        return res.status(400).json({message: "user id and messageId both are required"});
     }

    try{
        const userExists = await User.findById({_id:userId});

        if(!userExists){
            return res.status(404).json({message: "User Not Found"});
        }

        const getAllPosts = await communityChat.findOne({userId : userId});

        if(getAllPosts.messages.length === 0){
            return res.status(404).json({message: "No Messages Found"});
        }

        
        return getAllPosts;

    }catch(error){
        return res.status(500).json({message: error.message});
    }

}

export const getSingleMessage = async (req, res) => {
    const {userId,messageId} = req.params;

    const getAllPosts= await findSingleMessage(userId,messageId);

    const singleMessage = getAllPosts.messages.filter((message) => message._id == messageId);

        if(singleMessage.length === 0){
            return res.status(404).json({message: "Message Not Found"});
        }


    return res.status(200).json(singleMessage);

}

// updateMessage function is used to update a message from a particular user
export const updateMessage = async (req, res) => {
    const {userId,messageId} = req.params;
    const {message,image} = req.body;
    
    if(!userId || !messageId){
        return res.status(400).json({message: "user id and messageId both are required"});
     }

     const userExists = await communityChat.findOne({userId : userId}); 

        if(!userExists){
            return res.status(404).json({message: "User Not Found"});
        }
    
        const messageExists = userExists.messages.find((message) => message._id == messageId);

        if(!messageExists){
            return res.status(404).json({message: "Message Not Found"});
        }

    try{
        const updatedMessage = await communityChat.findOneAndUpdate(
            {userId : userId, "messages._id": messageId},
            {
                $set: {
                    "messages.$.message": message,
                    "messages.$.image": image,
                    "messages.$.tags": message.match(/#\w+/g) || "",
                },
            },
            {new: true}
        );

        return res.status(200).json(updatedMessage);
    }catch(error){
        return res.status(500).json({message: error.message});
    }
}

// deleteMessage function is used to delete a message from a particular user
export const deleteMessage = async (req, res) => {
    const {userId,messageId} = req.params;

    if(!userId || !messageId){
        return res.status(400).json({message: "user id and messageId both are required"});
     }

    try{
        const userExists = await User.findById({_id:userId});

        if(!userExists){
            return res.status(404).json({message: "User Not Found"});
        }

        const getAllPosts = await communityChat.findOne({userId : userId});

        if(getAllPosts.messages.length === 0){
            return res.status(404).json({message: "No Messages Found"});
        }

        const updatedChat = await communityChat.findByIdAndUpdate(getAllPosts._id, {
            $pull: { messages: { _id: messageId } }
        });

        if (!updatedChat) {
            return res.status(404).json({ message: "Message Not Found" });
        }

        return res.status(200).json({message: "Message Deleted"});  

        }catch(error){
            return res.status(500).json({message: error.message});
        }

}



