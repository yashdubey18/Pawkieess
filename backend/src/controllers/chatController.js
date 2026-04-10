import Chat from '../models/Chat.js';
import User from '../models/User.js';

// Get all chats for the current user
export const getUserChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            participants: req.user._id
        })
            .populate('participants', 'name email role')
            .sort({ updatedAt: -1 });

        res.json(chats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get messages for a specific chat
export const getChatMessages = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chatId)
            .populate('messages.sender', 'name');

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        // Check if user is participant
        if (!chat.participants.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(chat.messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Create a new chat or get existing one
export const createChat = async (req, res) => {
    const { participantId } = req.body;

    try {
        // Check if chat already exists
        let chat = await Chat.findOne({
            participants: { $all: [req.user._id, participantId] }
        });

        if (chat) {
            return res.json(chat);
        }

        // Create new chat
        chat = new Chat({
            participants: [req.user._id, participantId],
            messages: []
        });

        await chat.save();
        await chat.populate('participants', 'name');

        res.status(201).json(chat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Send a message (HTTP fallback or initial message)
export const sendMessage = async (req, res) => {
    const { chatId, content } = req.body;

    try {
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        const newMessage = {
            sender: req.user._id,
            content,
            timestamp: new Date()
        };

        chat.messages.push(newMessage);
        chat.lastMessage = content;
        chat.updatedAt = new Date();

        await chat.save();

        // Populate sender for response
        const savedMessage = chat.messages[chat.messages.length - 1];

        res.status(201).json(savedMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
