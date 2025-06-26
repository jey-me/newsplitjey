// src/pages/CreateGroupPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';

export default function CreateGroupPage() {
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const generateSlug = (name) =>
    name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleSubmit = async () => {
    if (!groupName.trim()) return;

    setLoading(true);
    const slug = generateSlug(groupName);

    const { error } = await supabase.from('groups').insert({
      name: groupName.trim(),
      slug,
    });

    setLoading(false);

    if (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group');
    } else {
      navigate(`/group/${newGroup.slug}`);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Create New Group</h2>

      <label>
        Group Name:
        <input
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="e.g., Runners, Friends, Trip"
          style={{ width: '100%', marginTop: 8 }}
        />
      </label>

      <div style={{ marginTop: 16 }}>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating...' : 'Create Group'}
        </button>
      </div>
    </div>
  );
}
