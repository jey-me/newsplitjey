import { create } from 'zustand';
import { supabase } from '../supabase/client';
import { useGroupStore} from '../store/useGroupStore';

export const useShoppingStore = create((set, get) => ({
  items: [],
  loading: false,
  error: null,
  eventId: null,
  itemToEdit: null,

  setEventId: (id) => set({ eventId: id }),
  setItemToEdit: (item) => set({ itemToEdit: item }),
  clearItemToEdit: () => set({ itemToEdit: null }),

  fetchItems: async () => {
    const { eventId } = get();
    if (!eventId) return;

    set({ loading: true });

    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('event_id', eventId);

    if (error) {
      console.error('❌ Error fetching items:', error);
      return set({ error, loading: false });
    }

    set({ items: data, loading: false });
  },

addItem: async ({ item_name, quantity, store_tag, use_tag, assigned_to, group_id }) => {
  const { eventId, items } = get();
  if (!eventId || !group_id) {
    console.warn('⛔ Faltan eventId o group_id');
    return;
  }

  const { data, error } = await supabase
    .from('items')
    .insert([{ item_name, quantity, store_tag, use_tag, assigned_to, event_id: eventId, group_id }])
    .select()
    .single();

  if (error) {
    console.error('❌ Error inserting item:', error);
    return;
  }

  set({ items: [...items, data] });
},

  updateItem: async (updatedItem) => {
    const { items } = get();

    const { data, error } = await supabase
      .from('items')
      .update(updatedItem)
      .eq('id', updatedItem.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating item:', error);
      return;
    }

    const updatedItems = items.map((i) => (i.id === data.id ? data : i));
    set({ items: updatedItems, itemToEdit: null });
  },

  deleteItem: async (id) => {
    const { items } = get();

    const { error } = await supabase.from('items').delete().eq('id', id);
    if (error) {
      console.error('❌ Error deleting item:', error);
      return;
    }

    set({ items: items.filter((i) => i.id !== id) });
  },

toggleBought: async (id) => {

  const { items } = get();
  const target = items.find((i) => i.id === id);
  if (!target) return;
  console.log("🔍 toggleBought ID:", id, typeof id);

  const { data, error } = await supabase
    .from('items')
    .update({ bought: !target.bought })
    .eq('id', id)
    .select();

  const updatedItem = data?.[0]; // 👈 importante: seleccionamos el objeto individual
  console.log("🧠 toggleBought ID:", id);
console.log("🎯 target item:", target);
  if (error || !updatedItem) {
    console.error('❌ Error toggling bought status:', error);
    return;
  }

  set({
    items: items.map((i) => (i.id === id ? updatedItem : i)),
  });
},
}));
