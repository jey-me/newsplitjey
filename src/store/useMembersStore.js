// src/store/useMembersStore.js
import { create } from 'zustand';
import { supabase } from '../supabase/client';

export const useMembersStore = create((set, get) => ({
  members: [],
  loading: false,
  error: null,
  groupId: null,

  setGroupId: (id) => set({ groupId: id }),

  // ✅ Fetch members for current group
  fetchMembers: async () => {
    const groupId = get().groupId;
    if (!groupId) return;

    set({ loading: true });

    const { data, error } = await supabase
      .from('members')
      .select('id, member_name')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ Error fetching members:', error);
      set({ error, loading: false });
      return;
    }

    const members = data.map((m) => ({
      id: m.id,
      name: m.member_name,
    }));

    set({ members, loading: false });
  },

  // ✅ Add new member, prevent duplicates
  addMember: async (name) => {
    const groupId = get().groupId;
    if (!groupId || !name.trim()) return;

    const trimmedName = name.trim();

    // 🚨 Check for existing member with same name in this group
    const existing = get().members.find(
      (m) => m.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (existing) {
      console.warn(`⚠️ Member "${trimmedName}" already exists in this group.`);
      return;
    }

    const { data, error } = await supabase
      .from('members')
      .insert([{ member_name: trimmedName, group_id: groupId }])
      .select()
      .single();

    if (error) {
      console.error('❌ Error inserting member:', error);
      return;
    }

    // ✅ Update local state
    set((state) => ({
      members: [...state.members, { id: data.id, name: data.member_name }],
    }));
  },

  // ✅ Delete member
  deleteMember: async (memberId) => {
    const groupId = get().groupId;
    if (!groupId) return;

    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', memberId)
      .eq('group_id', groupId);

    if (error) {
      console.error('❌ Error deleting member:', error);
      return;
    }

    set((state) => ({
      members: state.members.filter((m) => m.id !== memberId),
    }));
  },
}));
