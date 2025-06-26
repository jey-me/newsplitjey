import React from 'react';
import { useExpensesStore } from '../store/useExpensesStore';
import { useMembersStore } from '../store/useMembersStore';

export default function ExpensesList() {
  const { expenses } = useExpensesStore();
  const { members } = useMembersStore();

  const getNameById = (id) => {
    const member = members.find((m) => m.id === id);
    return member?.name || '[unknown]';
  };

  const renderSplit = (split_between) => {
    if (!split_between || split_between.length === 0) return '—';
    if (split_between.length === members.length) return 'everyone';
    return split_between.map(getNameById).join(', ');
  };

  return (
    <div>
      <h3>Expenses</h3>

      {expenses.length === 0 ? (
        <p>No expenses yet.</p>
      ) : (
        expenses.map((expense) => (
          <div key={expense.id}>
            <strong>{getNameById(expense.paid_by)}</strong> paid{' '}
            <strong>€{expense.amount.toFixed(2)}</strong> for{' '}
            <em>{expense.expense_name}</em>.{' '}
            <span>
              Split between {renderSplit(expense.split_between)}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
