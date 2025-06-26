import React from 'react';
import MembersList from '../components/MembersList';
import ExpensesList from '../components/ExpensesList';
import ShoppingList from '../components/ShoppingList';
import { useGroupStore } from '../store/useGroupStore';
import { useEventStore } from '../store/useEventStore';

export default function HomePage() {
  const { group } = useGroupStore();
  const { event } = useEventStore();

  return (
    <div style={{ padding: '16px', paddingBottom: '80px' }}>
<h3 style={{textAlign: 'center', color: '#6a4caf' }}>
  {event?.event_name} <span style={{ fontWeight: 400, fontSize: 12 }}>by {group?.name}</span>
</h3>
      <MembersList />
      <hr />
      <ExpensesList />
      <hr />
      <ShoppingList />
    </div>
  );
}
