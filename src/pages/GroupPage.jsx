import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { useGroupStore } from '../store/useGroupStore';
import { useMembersStore } from '../store/useMembersStore';
import { usePopupStore } from '../store/usePopupStore';

export default function GroupPage() {
  const { groupSlug } = useParams();
  const navigate = useNavigate();
  const { group, setGroupBySlug } = useGroupStore();
  const { members, fetchMembers, deleteMember } = useMembersStore();
  const { openPopup, currentPopup } = usePopupStore();


  const [events, setEvents] = useState([]);
  const [newEventName, setNewEventName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingGroup, setFetchingGroup] = useState(false);

  // ✅ Load group by slug
  useEffect(() => {
    const fetchGroupIfNeeded = async () => {
      if (!group || group.slug !== groupSlug) {
        setFetchingGroup(true);
        const fetchedGroup = await setGroupBySlug(groupSlug);
        if (!fetchedGroup) {
          console.error('❌ Group not found');
          navigate('/');
        } else {
          fetchMembers(); // ✅ Fetch group members
        }
        setFetchingGroup(false);
      }
    };
    fetchGroupIfNeeded();
  }, [groupSlug, group, setGroupBySlug, navigate, fetchMembers]);

  // ✅ Load events for group
  useEffect(() => {
    if (group?.id) fetchEvents();
  }, [group?.id]);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('group_id', group.id)
      .order('created_at', { ascending: false });

    if (!error) setEvents(data);
    else console.error('❌ Error loading events:', error);
  };

  const handleCreateEvent = async () => {
    if (!newEventName.trim()) return;
    setLoading(true);

    const slugify = (text) =>
      text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');

    const eventSlug = slugify(newEventName.trim());

    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .insert([
        { event_name: newEventName.trim(), slug: eventSlug, group_id: group.id },
      ])
      .select()
      .single();

    if (eventError) {
      console.error('❌ Error creating event:', eventError);
      setLoading(false);
      return;
    }

    const { data: groupMembers, error: membersError } = await supabase
      .from('members')
      .select('id')
      .eq('group_id', group.id);

    if (membersError) {
      console.error('❌ Error fetching group members:', membersError);
      setLoading(false);
      return;
    }

    const eventMembers = groupMembers.map((m) => ({
      event_id: eventData.id,
      member_id: m.id,
    }));

    const { error: insertError } = await supabase
      .from('event_members')
      .insert(eventMembers);

    if (insertError) {
      console.error('❌ Error inserting event members:', insertError);
      setLoading(false);
      return;
    }

    setEvents((prev) => [eventData, ...prev]);
    setNewEventName('');
    setLoading(false);
  };

  const EVENT_HOME_ROUTE = 'Home';
  const goToEvent = (eventSlug) => {
    navigate(`/${groupSlug}/${eventSlug}/${EVENT_HOME_ROUTE}`);
  };

  const handleDeleteMember = async (memberId) => {
    await deleteMember(memberId);
    fetchMembers();
  };

  const handleAddMember = () => {
    openPopup('manageMembers');
  };

  if (fetchingGroup) return <p>Loading group info...</p>;

  console.log("✅ Popup State from GroupPage:", currentPopup);

console.log("✅ Event state in HomePage:", event);
  return (
    <div className="page" style={{ padding: '16px' }}>
      <h2>{group?.name || groupSlug}</h2>

      {/* ✅ Members List */}
      <h3>Members</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
        {members.map((m) => (
          <span
            key={m.id}
            style={{
              padding: '6px 10px',
              borderRadius: '16px',
              background: '#f0f0f0',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {m.name}
            <button
              onClick={() => handleDeleteMember(m.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#c00',
                fontSize: '16px',
                cursor: 'pointer',
                lineHeight: '1',
              }}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
<button onClick={() => {
  console.log("👉 CLICK + Add Member");
  openPopup("manageMembers");
}}>
  + Add Member
</button>


      {/* ✅ Create Event */}
      <h3>Create New Event</h3>
      <div style={{ marginBottom: '1rem' }}>
        <input
          placeholder="New event name"
          value={newEventName}
          onChange={(e) => setNewEventName(e.target.value)}
        />
        <button onClick={handleCreateEvent} disabled={loading}>
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </div>

      {/* ✅ Events List */}
      <h3>Events</h3>
      {events.length === 0 ? (
        <p>No events yet.</p>
      ) : (
        <ul>
          {events.map((e) => (
            <li key={e.id}>
              <button onClick={() => goToEvent(e.slug)}>{e.event_name}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
