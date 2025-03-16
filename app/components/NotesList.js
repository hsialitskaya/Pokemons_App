import React from "react";

const NotesList = ({ notes, onEdit, onDelete }) => (
  <div>
    {notes.map((note) => (
      <div key={note.id}>
        <h3>{note.tacticName}</h3>
        <p>{note.strategy}</p>
        <p>Skuteczność: {note.effectiveness}</p>
        <p>Data treningu: {note.trainingDate}</p>
        <button onClick={() => onEdit(note)}>Edytuj</button>
        <button onClick={() => onDelete(note.id)}>Usuń</button>
      </div>
    ))}
  </div>
);

export default NotesList;
