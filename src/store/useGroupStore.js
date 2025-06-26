// src/store/useGroupStore.js
import { create } from 'zustand';
import { supabase } from '../supabase/client';

export const useGroupStore = create((set) => ({
  group: null,
  loading: false,
  error: null,

  // ✅ Buscar grupo por slug (ej: "fam")
  setGroupBySlug: async (slug) => {
    set({ loading: true });

    const { data, error } = await supabase
      .from('groups')
      .select('id, name, slug')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      console.error('❌ Error fetching group:', error);
      set({ group: null, loading: false, error });
      return null;
    }

    set({ group: data, loading: false });
    return data;
  },
}));
