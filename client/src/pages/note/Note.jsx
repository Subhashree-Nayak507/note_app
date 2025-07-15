import { useState, useEffect } from 'react';
import { Plus, Save, X, Search, BookOpen, LogOut } from 'lucide-react';
import { NoteCard } from '../../components/NoteCard';
import { EditNoteForm } from '../../components/EditFormComponent';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import { createNote, getNotes, updateNote, deleteNote, clearError } from '../../redux/note/index';
import { logoutUser } from '../../redux/auth/index'; 

const Note = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notes, isLoading, error } = useSelector((state) => state.notes);
  const { user } = useSelector((state) => state.auth); 
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [newNote, setNewNote] = useState({ title: '', description: '' });
  
  console.log("notes", notes);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        await dispatch(getNotes()).unwrap();
      } catch (error) {
        console.error('Failed to fetch notes:', error);
        toast.error(error?.message || 'Failed to fetch notes');
      }
    };
    fetchNotes();
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error?.message || 'An error occurred');
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleAddNote = async () => {
    if (!newNote.title.trim() || !newNote.description.trim()) {
      toast.error('Please fill in both title and description');
      return;
    }
    try {
      await dispatch(createNote({
        title: newNote.title.trim(),
        description: newNote.description.trim()
      })).unwrap();

      setNewNote({ title: '', description: '' });
      setShowAddForm(false);
      toast.success('Note created successfully!');
    } catch (error) {
      console.error('Failed to create note:', error);
      toast.error(error?.message || 'Failed to create note');
    }
  };

  const handleEditNote = async (id, updatedNote) => {
    try {
      await dispatch(updateNote({
        id,
        noteData: updatedNote
      })).unwrap();
      setEditingNote(null);
      toast.success('Note updated successfully!');
    } catch (error) {
      console.error('Failed to update note:', error);
      toast.error(error?.message || 'Failed to update note');
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await dispatch(deleteNote(id)).unwrap();
      toast.success('Note deleted successfully!');
    } catch (error) {
      console.error('Failed to delete note:', error);
      toast.error(error?.message || 'Failed to delete note');
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully!');
      navigate('/login'); 
    } catch (error) {
      console.error('Failed to logout:', error);
      toast.error(error?.message || 'Failed to logout');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">My Notes</h1>
            <p className="text-sm sm:text-base text-blue-200">Capture your thoughts and ideas</p>
            
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 hover:text-red-200 rounded-lg font-medium transition-all duration-200 text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            disabled={isLoading}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Add New Note
          </button>

          {showAddForm && (
            <div className="mt-6 p-4 sm:p-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Add New Note</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Note title..."
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm disabled:opacity-50"
                />
                <textarea
                  placeholder="Note description..."
                  value={newNote.description}
                  onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm h-32 resize-none disabled:opacity-50"
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddNote}
                    disabled={isLoading}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isLoading ? 'Saving...' : 'Save Note'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewNote({ title: '', description: '' });
                    }}
                    disabled={isLoading}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl px-6 py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-blue-200">Loading...</p>
            </div>
          </div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {notes.length === 0 ? (
              <div className="col-span-full">
                <div className="text-center py-12 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl">
                  <BookOpen className="w-16 h-16 text-blue-300 mx-auto mb-4 opacity-50" />
                  <p className="text-blue-200 text-lg">
                    No notes yet. Create your first note!
                  </p>
                </div>
              </div>
            ) : (
              notes.map((note) => (
                <div key={note.id}>
                  {editingNote === note.id ? (
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6">
                      <EditNoteForm
                        note={note}
                        onSave={(updatedNote) => handleEditNote(note.id, updatedNote)}
                        onCancel={() => setEditingNote(null)}
                      />
                    </div>
                  ) : (
                    <NoteCard
                      note={note}
                      onEdit={() => setEditingNote(note.id)}
                      onDelete={() => handleDeleteNote(note.id)}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {!isLoading && notes.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-block backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl px-6 py-3">
              <p className="text-blue-200 text-sm sm:text-base">
                Total notes: <span className="text-white font-semibold">{notes.length}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Note;