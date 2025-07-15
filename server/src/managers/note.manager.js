import Note from '../models/note.model.js';

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

export const deleteNoteManager = async (noteId, userId) => {
    if (!noteId) {
      throw new Error("Note ID is required");
    };
    if (!userId) {
      throw new Error("User ID is required");
    };

    const note = await Note.findById(noteId); 
    if (!note) {
     throw new Error("Note is not found.")
    }

    if (note.user.toString() !== userId.toString()) {
      throw new Error("You are not authorized to delete this note");
    }
    await Note.findByIdAndDelete(noteId);

    return {
      success: true,
      message: "Note deleted successfully"
    };

};

export const updateNoteManager = async (noteId, userId, updateData) => {
  if (!noteId) {
    throw new Error("Note ID is required");
  }
  if (!userId) {
    throw new Error("User ID is required");
  }
  if (!updateData ) {
    throw new Error("At least one field (title or description) must be provided");
  }

  let note = await Note.findById(noteId);
  if (!note) {
     throw new Error("Note not found");
  }
  if (note.user.toString() !== userId.toString()) {
    throw new Error("You are not authorized to update this note");

  }

  if ('title' in updateData) note.title = updateData.title;
  if ('description' in updateData) note.description = updateData.description;

  note = await note.save();
  return {
    success: true,
    message: "Note updated successfully",
    note
  };
}
