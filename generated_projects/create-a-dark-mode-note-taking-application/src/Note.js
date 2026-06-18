import React, { useState } from "react";

/**
 * Note component manages a collection of notes.
 * It allows creating new notes, editing existing ones, and deleting notes.
 * This component is used by the App component and does not require any external props.
 */
const Note = () => {
  // State for the list of notes. Each note is an object { id, text }.
  const [notes, setNotes] = useState([]);
  // State for the current input value when adding a new note.
  const [newNoteText, setNewNoteText] = useState("");
  // State to keep track of which note is being edited (by id) and its temporary text.
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Add a new note to the list.
  const handleAddNote = () => {
    const trimmed = newNoteText.trim();
    if (!trimmed) return; // ignore empty notes
    const newNote = {
      id: Date.now(), // simple unique id
      text: trimmed,
    };
    setNotes([...notes, newNote]);
    setNewNoteText("");
  };

  // Delete a note by its id.
  const handleDelete = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
    // If we were editing this note, clear editing state.
    if (editingId === id) {
      setEditingId(null);
      setEditingText("");
    }
  };

  // Start editing a note.
  const handleEdit = (id, currentText) => {
    setEditingId(id);
    setEditingText(currentText);
  };

  // Save the edited note.
  const handleSave = (id) => {
    const trimmed = editingText.trim();
    if (!trimmed) {
      // If the edited text is empty, treat it as a delete.
      handleDelete(id);
      return;
    }
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, text: trimmed } : note))
    );
    setEditingId(null);
    setEditingText("");
  };

  // Cancel editing.
  const handleCancel = () => {
    setEditingId(null);
    setEditingText("");
  };

  return (
    <div className="note-app">
      <h2>Notes</h2>
      {/* Input for adding a new note */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter a new note"
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleAddNote();
          }}
        />
        <button onClick={handleAddNote}>Add</button>
      </div>

      {/* List of notes */}
      {notes.length === 0 ? (
        <p>No notes yet.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {notes.map((note) => (
            <li key={note.id} style={{ marginBottom: "0.5rem" }}>
              {editingId === note.id ? (
                <div>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleSave(note.id);
                    }}
                  />
                  <button onClick={() => handleSave(note.id)}>Save</button>
                  <button onClick={handleCancel}>Cancel</button>
                </div>
              ) : (
                <div>
                  <span>{note.text}</span>
                  <button onClick={() => handleEdit(note.id, note.text)} style={{ marginLeft: "0.5rem" }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(note.id)} style={{ marginLeft: "0.5rem" }}>
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Note;
