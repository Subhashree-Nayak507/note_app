// controllers/notes.controller.js
import { createNote, deleteNoteManager, getUserNotes, updateNoteManager } from '../managers/note.manager.js';

export const createNoteController = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const notes = await createNote(title, description, req.user._id);

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
     const userId = req.user._id; 
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
    console.log('req.params:', req.params);
    console.log('req.user:', req.user);
    
    const { id } = req.params;
    const userId = req.user._id;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid note ID format'
      });
    }
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format'
      });
    }
    
    const updatedNote = await updateNoteManager(id, userId, req.body);
    
    res.status(200).json({
      success: true,
      data: updatedNote
    });
    
  } catch (error) {
    console.error('Update note error:', error);
    next(error);
  }
};



export const deleteNoteController = async (req, res, next) => {
  try {
        
    const { id } = req.params;
    const userId = req.user._id;
    console.log("user sanu", userId);
    console.log("noteId from params", id);
    console.log("userId type:", typeof userId);

    // Basic validation
    if (!id) {
      return res.status(400).json({ 
        success: false,
        message: "Note ID is required" 
      });
    }

    //const deletedNote = await deleteNoteManager(id, userId);

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      // data: {
      //   id: deletedNote._id,
      //   title: deletedNote.title
      // }
    });

  } catch (error) {
    console.error("Delete note failed:", error);
    next(error);
  }
};