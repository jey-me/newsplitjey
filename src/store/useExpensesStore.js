// src/store/useExpensesStore.js
import { create } from 'zustand';
import { supabase } from '../supabase/client';

export const useExpensesStore = create((set, get) => ({
  expenses: [],
  loading: false,
  error: null,
  eventId: null,
  setEventId: (id) => set({ eventId: id }),

  fetchExpenses: async () => {
    const { eventId } = get();
    if (!eventId) return;

    set({ loading: true });

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('event_id', eventId);

    if (error) {
      console.error('❌ Error fetching expenses:', error);
      return set({ error, loading: false });
    }

    set({ expenses: data, loading: false });
  },

  addExpense: async ({ expense_name, amount, paid_by, split_between }) => {
  const { eventId, expenses } = get();
  if (!eventId) return;

  const { data, error } = await supabase
    .from('expenses')
    .insert([{ expense_name, amount, paid_by, split_between, event_id: eventId }])
    .select()
    .single();

  if (error) {
    console.error('❌ Error inserting expense:', error);
    return;
  }

  set({ expenses: [...expenses, data] });
}

}));
