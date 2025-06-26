import React, { useEffect, useState } from "react";
import { usePopupStore } from "../../store/usePopupStore";
import { useEventStore } from "../../store/useEventStore";
import { supabase } from "../../supabase/client";

export default function ChangeEventNamePopup() {
  const { closePopup } = usePopupStore();
  const { event, setEventBySlug } = useEventStore();
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (event) {
      setNewName(event.event_name);  // Asumiendo que en tu store viene como event.event_name
    }
  }, [event]);

  const handleSave = async () => {
    if (!newName.trim()) return;

    const { error } = await supabase
      .from("events")
      .update({ event_name: newName.trim() })
      .eq("id", event.id);

    if (error) {
      console.error("❌ Error updating event name:", error);
      return;
    }

    // Refetch event to get latest data
    await setEventBySlug(event.slug, event.group_id);

    closePopup();
  };

  const handleCancel = () => {
    closePopup();
  };

  return (
    <div className="popup">
      <h3>Change Event Name</h3>

      <label>
        New Event Name:
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="e.g. Summer Trip"
        />
      </label>

      <div className="popup-actions">
        <button onClick={handleCancel}>Cancel</button>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}
