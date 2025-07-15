import { Edit, Trash2 } from 'lucide-react';

export const NoteCard = ({ note, onEdit, onDelete }) => {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-white truncate pr-4">
          {note.title}
        </h3>
        <div className="flex gap-2 opacity-70 hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 transition-colors"
          >
            <Edit className="w-4 h-4 text-blue-300" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-300" />
          </button>
        </div>
      </div>
      <p className="text-blue-200 text-sm sm:text-base mb-4 line-clamp-3">
        {note.description}
      </p>
      
    </div>
  );
}