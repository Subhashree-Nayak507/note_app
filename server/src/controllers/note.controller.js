// controllers/notes.controller.js
import { createNote,  deleteNoteManager,  getUserNotes, updateNoteManager } from '../managers/note.manager.js';
import Note from '../models/note.model.js';

export const createNoteController = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const notes = await createNote(title, description, req.note._id);

    res.status(201).json({
        message:"Note created successfully",
        notes:{
            id:notes._id,
            title:notes.title,
            description:notes.description
        }

    })
  } catch (error) {
    next(error);
    console.error("Creating notes failed:",error);
  }
};

export const getNotes = async (req, res, next) => {
  try {
     const userId = req.note._id; 
     const notes = await getUserNotes(userId);
       res.status(200).json({
        message:"Note  fetched successfully",
        notes: notes.map(note => ({
        id: note._id,
        title: note.title,
        description: note.description
      }))
    })
  } catch (error) {
    next(error);
    console.error("Fetching notes Failed:",error);
  }
};

export const updateNoteController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const noteId = req.params.id;
    const { title, description } = req.body;

    if (!('title' in req.body) && !('description' in req.body)) {
      return res.status(400).json({
        success: false,
        message: "At least one field (title or description) must be provided"
      });
    }
    if (!noteId) {
      return res.status(400).json({
        success: false,
        message: "Note ID is required"
      });
    }
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const updateData = {};
    if ('title' in req.body) updateData.title = title;
    if ('description' in req.body) updateData.description = description;

    const result = await updateNoteManager(noteId, userId, updateData);
    return res.status(200).json(result);

  } catch (error) {
    console.error('Update note error:', error);
    next(error);
  }
};

export const deleteNoteController = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    const userId = req.note._id;

    if (!noteId) {
      return res.status(400).json({
        success: false,
        message: "Note ID is required"
      });
    }
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "UserId is not provided"
      });
    }
    
    const result = await deleteNoteManager(noteId, userId);

    return res.status(200).json({   
          success: true,    
          message: "Note deleted successfully"});

  } catch (error) {
    console.error("Delete note failed:", error);
    next(error);
  }
};
