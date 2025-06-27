// src/components/SimplifyExpensesDisplay.jsx
import React, { useState, useMemo } from 'react';
import { simplifyExpenses } from '../utils/simplifyExpenses';
import { useExpensesStore } from '../store/useExpensesStore';
import { useMembersStore } from '../store/useMembersStore';

export default function SimplifyExpensesDisplay() {
const members = useMembersStore((state) => state.members);
const expenses = useExpensesStore((state) => state.expenses);

  const [showBalances, setShowBalances] = useState(false);

  const settlements = useMemo(() => simplifyExpenses(expenses, members), [expenses, members]);

  return (
    <div style={{ marginTop: '1rem' }}>
      <button
        onClick={() => setShowBalances((prev) => !prev)}
        className='centered-button'
      >
        {showBalances ? 'Ocultar balances' : 'Mostrar balances'}
      </button>

      {showBalances && (
        <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '0.5rem' }}>
          {settlements.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#4b5563' }}>No hay deudas pendientes 🎉</p>
          ) : (
            settlements.map((s, index) => (
              <p key={index} style={{ fontSize: '0.95rem', margin: '0.25rem 0' }}>
                <strong>{s.from}</strong> paga <strong>{s.amount}€</strong> a <strong>{s.to}</strong>
              </p>
            ))
          )}
        </div>
      )}
    </div>
  );
}
