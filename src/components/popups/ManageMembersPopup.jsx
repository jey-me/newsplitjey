import React, { useState } from 'react';
import { usePopupStore } from '../../store/usePopupStore';
import { useMembersStore } from '../../store/useMembersStore';

export default function ManageMembersPopup() {
  const { closePopup } = usePopupStore();
  const { members, addMember, deleteMember } = useMembersStore();
  const [input, setInput] = useState('');

  const handleAdd = async () => {
    const names = input
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean);
    for (const name of names) {
      await addMember(name);
    }
    setInput('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      await deleteMember(id);
    }
  };

  return (
    <div className="popup">
      <h3>Manage Members</h3>

      <div style={{ marginBottom: 12 }}>
        <strong>Current Members:</strong>
        <ul>
          {members.map((m) => (
            <li key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{m.name}</span>
              <button onClick={() => handleDelete(m.id)} style={{ color: 'red', fontSize: 12 }}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <label>
        Add new member(s):
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Comma-separated names"
        />
      </label>

      <div className="popup-actions">
        <button onClick={closePopup}>Close</button>
        <button onClick={handleAdd} disabled={!input.trim()}>
          Add
        </button>
      </div>
    </div>
  );
}
