import React, { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import NavMenu from "../NavMenu/NavMenu";
import { usePopupStore } from "../store/usePopupStore";
import { useGroupStore } from "../store/useGroupStore";
import { useMembersStore } from "../store/useMembersStore";
import { useEventStore } from "../store/useEventStore";
import { useExpensesStore } from "../store/useExpensesStore";
import { useShoppingStore } from "../store/useShoppingStore";


export default function LayoutWithNav() {
  const { currentPopup } = usePopupStore();
  const { groupSlug, eventSlug } = useParams();
  const { setGroupBySlug } = useGroupStore();
  const { setGroupId, fetchMembers } = useMembersStore();
  const { setEventBySlug, event } = useEventStore();

  useEffect(() => {
    const init = async () => {
      if (!groupSlug) return;

      const group = await setGroupBySlug(groupSlug);
      if (!group?.id) return;

      setGroupId(group.id);
      await fetchMembers();

      if (!eventSlug) return;

      const event = await setEventBySlug(eventSlug, group.id);
      if (!event?.id) {
        console.error('❌ Event not found or error loading');
        return;
      }

      useExpensesStore.getState().setEventId(event.id);
      useShoppingStore.getState().setEventId(event.id);

      await useExpensesStore.getState().fetchExpenses();
      await useShoppingStore.getState().fetchItems();
    };

    init();
  }, [groupSlug, eventSlug]);

  // ✅ Si hay eventSlug pero aún no tenemos el event cargado
  if (eventSlug && !event) {
    return <p>Loading event...</p>;
  }

  return (
    <>
      <Outlet />
      <NavMenu />
    </>
  );
}
