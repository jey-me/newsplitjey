// src/store/useEventStore.js
import { create } from 'zustand';
import { supabase } from '../supabase/client';

export const useEventStore = create((set) => ({
  event: null,
  loading: false,
  error: null,

  setEventBySlug: async (eventslug, group_id) => {
    set({ loading: true });

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', eventslug)
      .eq('group_id', group_id)
      .maybeSingle();

    if (error || !data) {
      console.error('❌ Error fetching event:', error);
      set({ event: null, loading: false, error });
      return null;
    }

    set({ event: data, loading: false });
    return data;
  },
}));
