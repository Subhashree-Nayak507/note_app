
const NoteCard = ({ note, onEdit, onDelete }) => {
  return (
    <div>
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-semibold text-gray-800">{note.title}</h2>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-blue-500 hover:text-blue-700 p-1 rounded transition-colors"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <p className="text-gray-600 mb-3 leading-relaxed">{note.description}</p>
      <p className="text-sm text-gray-400">Created: {note.createdAt}</p>
    </div>
  );
};