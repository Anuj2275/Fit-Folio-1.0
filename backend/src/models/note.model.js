import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Note title is required'],
        trim: true,
        minlength: [1, 'Title cannot be empty'],
    },
    content: {
        type: String,
        required: [true, 'Note content is required'],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Note = mongoose.model('Note', noteSchema);

export default Note;
