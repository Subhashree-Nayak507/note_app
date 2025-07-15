import { Save,X } from "lucide-react";
import { useState } from "react";

export const EditNoteForm = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description);

  const handleSave = () => {
    if (title.trim() && description.trim()) {
      onSave({ title, description });
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
        placeholder="Note title..."
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm h-32 resize-none"
        placeholder="Note description..."
      />
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-gradient-to-r  bg-purple-500 to-purple-300 hover:from-blue-400 hover:to-pink-400 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </div>
  );
}