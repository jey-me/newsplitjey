import React from 'react';
import { useMembersStore } from '../store/useMembersStore';

export default function MembersList() {
  const { members } = useMembersStore();
    return (
    <div>
      <h3>Members</h3>
      {members.length === 0 ? (
        <p>No members added yet.</p>
      ) : (
        <p>
          {members.map((m, i) => (
            <span key={m.id}>
              {m.name}
              {i < members.length - 1 && ", "}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}