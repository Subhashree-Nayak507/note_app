import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, 
  {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }  }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;