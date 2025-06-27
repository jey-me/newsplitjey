import React from 'react';
import MembersList from '../components/MembersList';
import ExpensesList from '../components/ExpensesList';
import ShoppingList from '../components/ShoppingList';
import { useGroupStore } from '../store/useGroupStore';
import { useEventStore } from '../store/useEventStore';
import { simplifyExpenses } from '../utils/simplifyExpenses';
import { useExpensesStore } from '../store/useExpensesStore';
import { useMembersStore } from '../store/useMembersStore';
import SimplifyExpensesDisplay from '../components/SimplifyExpensesDisplay';

export default function HomePage() {
  const { group } = useGroupStore();
  const { event } = useEventStore();

  const expenses = useExpensesStore((state) => state.expenses.list);
  const members = useMembersStore((state) => state.members.list);

  

  return (
    
    <div style={{ padding: '16px', paddingBottom: '80px' }}>
      
<h3 style={{textAlign: 'center', color: "var(--primary-color)" }}>
  {event?.event_name} <span style={{ fontWeight: 400, fontSize: 12 }}>by {group?.name}</span>
</h3>

      <SimplifyExpensesDisplay />
      <hr />
      <MembersList />
      <hr />
      <ExpensesList />
      <hr />
      <ShoppingList />
    </div>
  );
}
