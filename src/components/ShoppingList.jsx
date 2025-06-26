import React, { useEffect, useState } from 'react';
import { useShoppingStore } from '../store/useShoppingStore';
import { useEventStore } from '../store/useEventStore';
import { FiCheckSquare, FiSquare, FiEdit, FiTrash } from 'react-icons/fi';
import { usePopupStore } from '../store/usePopupStore';

export default function ShoppingList() {
  const { eventId } = useEventStore();
  const { items, fetchItems, toggleBought, deleteItem, setItemToEdit } = useShoppingStore();
  const { openPopup } = usePopupStore();

  const [filters, setFilters] = useState({ store: null, assigned: null, use: null });

  useEffect(() => {
    if (eventId) fetchItems(eventId);
  }, [eventId]);

  const filteredItems = items.filter(item => {
    const storeMatch = !filters.store || item.store_tag === filters.store;
    const assignedMatch = !filters.assigned || item.assigned_to === filters.assigned;
    const useMatch = !filters.use || item.use_tag === filters.use;
    return storeMatch && assignedMatch && useMatch;
  });

  const getColorForTag = (tag) => {
    if (!tag) return null;
    const colors = {
      Store: 'rgba(0, 128, 128, 0.2)',
      Assigned: 'rgba(255, 215, 0, 0.2)',
      Use: 'rgba(255, 0, 128, 0.2)',
    };
    return colors[tag] || 'rgba(100,100,100,0.2)';
  };

  const clearFilters = () => setFilters({ store: null, assigned: null, use: null });

  return (
    <div>
      <h3>Shopping List</h3>

      {filteredItems.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <div>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`shopping-item ${item.bought ? 'bought' : ''}`}
            >
              <div className="item-row">
                <div className="item-left">
                  <span
                    className="checkbox-icon"
                    onClick={() => toggleBought(item.id)}
                  >
                    {item.bought ? <FiCheckSquare /> : <FiSquare />}
                  </span>
                  <span className="item-name">
                    <strong>{item.item_name}</strong> – {item.quantity}
                  </span>
                </div>
                <div className="item-actions">
                  <FiEdit
                    onClick={() => {
                      setItemToEdit(item);
                      openPopup('shopping');
                    }}
                    className="action-icon"
                  />
                  <FiTrash
                    onClick={() => deleteItem(item.id)}
                    className="action-icon"
                  />
                </div>
              </div>

              <div className="item-tag">
                {item.store_tag && (
                  <span style={{ background: getColorForTag('Store') }}>
                    {item.store_tag}
                  </span>
                )}
                {item.use_tag && (
                  <span style={{ background: getColorForTag('Use') }}>
                    {item.use_tag}
                  </span>
                )}
                {item.assigned_to && (
                  <span style={{ background: getColorForTag('Assigned') }}>
                    {item.assigned_to}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
