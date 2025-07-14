import Note from '../models/note.model.js';
import mongoose from 'mongoose';

export const createNote = async (title, description, userId) => {

    if (!title || !description){
        throw new Error("Title and description are required")
    }
    
    const note = await Note.create({
      title,
      description,
      user: userId
    });
    return note;

};

export const getUserNotes = async (userId) => {
  return await Note.find({ user: userId });
};

export const updateNoteManager = async (noteId, userId, updateData) => {
  const updateFields = {};
  
  if ('title' in updateData) updateFields.title = updateData.title;
  if ('description' in updateData) updateFields.description = updateData.description;
  
  console.log('noteId:', noteId, 'type:', typeof noteId);
  console.log('userId:', userId, 'type:', typeof userId);
  console.log('updateFields:', updateFields);
  
  const updatedNote = await Note.findOneAndUpdate(
    { _id: noteId, user: userId },
    updateFields,
    { new: true, runValidators: true }
  );
  
  if (!updatedNote) {
    throw new Error('Note not found or unauthorized');
  }
  
  return updatedNote;
}

export const deleteNoteManager = async (noteId, userId) => {
  try {
    // Validate and convert IDs
    const safeNoteId = toSafeObjectId(noteId);
    const safeUserId = toSafeObjectId(userId);

    // Check existence and ownership
    const note = await Note.findOne({
      _id: safeNoteId,
      user: safeUserId
    });

    if (!note) {
      throw new Error('Note not found or access denied');
    }

    // Perform deletion
    const result = await Note.deleteOne({ _id: safeNoteId });
    
    if (result.deletedCount === 0) {
      throw new Error('Deletion failed - document not found');
    }

    return note; // Return the found note before deletion

  } catch (error) {
    console.error('Manager error:', error);
    throw error;
  }
};