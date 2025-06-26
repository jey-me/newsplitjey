// src/pages/CreateEventPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase/client';

export default function CreateEventPage() {
  const [eventName, setEventName] = useState('');
  const [groupList, setGroupList] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      const { data, error } = await supabase.from('groups').select('id, name');
      if (error) {
        console.error('Error fetching groups:', error);
      } else {
        setGroupList(data);
      }
    };

    fetchGroups();
  }, []);

  const generateSlug = (name) =>
    name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleSubmit = async () => {
    if (!eventName.trim() || !selectedGroupId) return;

    setLoading(true);
    const slug = generateSlug(eventName);

    // 1. Crear el evento
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .insert({
        event_name: eventName.trim(),
        slug,
        group_id: selectedGroupId,
      })
      .select()
      .single();

    if (eventError || !eventData) {
      console.error('Error creating event:', eventError);
      alert('Failed to create event');
      setLoading(false);
      return;
    }

    const eventId = eventData.id;

    // 2. Obtener miembros del grupo
    const { data: groupMembers, error: memberError } = await supabase
      .from('members')
      .select('id')
      .eq('group_id', selectedGroupId);

    if (memberError) {
      console.error('Error fetching group members:', memberError);
      setLoading(false);
      return;
    }

    // 3. Agregar todos como event_members
    const eventMembersInserts = groupMembers.map((m) => ({
      event_id: eventId,
      member_id: m.id,
    }));

    const { error: insertError } = await supabase
      .from('event_members')
      .insert(eventMembersInserts);

    if (insertError) {
      console.error('Error inserting event members:', insertError);
    }

    setLoading(false);

// 4. Obtener el slug del grupo
const { data: groupData, error: groupError } = await supabase
  .from('groups')
  .select('slug')
  .eq('id', selectedGroupId)
  .maybeSingle();

if (groupError || !groupData) {
  console.error('❌ Error fetching group slug:', groupError);
  setLoading(false);
  return;
}

const groupSlug = groupData.slug;

// 5. Redirigir al HomePage del nuevo evento
navigate(`/${groupSlug}/${slug}/Home`);
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Create New Event</h2>

      <label>
        Event Name:
        <input
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="e.g., Summer Trip, Dinner Out"
          style={{ width: '100%', marginTop: 8 }}
        />
      </label>

      <label style={{ display: 'block', marginTop: 16 }}>
        Select Group:
        <select
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(e.target.value)}
          style={{ width: '100%', marginTop: 8 }}
        >
          <option value="">-- Select Group --</option>
          {groupList.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </label>

      <div style={{ marginTop: 16 }}>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <Link to="/create-group" style={{ color: '#6a4caf' }}>
          ➕ Create new group
        </Link>
      </div>
    </div>
  );
}
