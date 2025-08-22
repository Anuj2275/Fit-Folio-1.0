import Note from "../models/note.model.js";
import { redisClient } from "../app.js";

export const createNote = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const newNote = await Note.create({
            title, content, user: req.user.id
        })

        await redisClient.del(`notes:${req.user.id}`);

        res.status(201).json(newNote);
    } catch (error) {
        next(error);
    }
}

export const getNotes = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cacheKey = `notes:${userId}`;
        const cachedNotes = await redisClient.get(cacheKey);

        if(cachedNotes) return res.status(200).json(JSON.parse(cachedNotes));

        const notes = await Note.find({
            user: req.user.id
        }).sort({ updatedAt: 'desc' })

        await redisClient.set(cacheKey,JSON.stringify(notes),'EX',3600);

        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
}

export const getNoteById = async (req, res, next) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            user: req.user.id
        })

        if (!note) return res.status(404).json({
            message:
                'Note not found'
        })

        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
}



export const updateNote = async (req, res, next) => {
    try {
        const { title, content } = req.body;

        const updatedNote = await Note.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { title, content, updatedAt: Date.now() },
            { new: true }
        )

        if (!updateNote) return res.status(404).json({ message: 'Note not found.' })

        await redisClient.del(`notes"${req.user.id}`);

        res.status(200).json(updateNote);
    } catch (error) {
        next(error);
    }
}

export const deleteNote = async (req, res, next) => {
    try {
        const deletedNote = await Note.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        })

        if (!deletedNote) return res.status(404).json({ message: 'Note not found' })

        await redisClient.del(`notes${req.user.id}`);

        res.status(200).json({ message: 'Note delete successfully.' })
    } catch (error) {
        next(error);
    }
}