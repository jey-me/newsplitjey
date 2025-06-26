import React, { useEffect, useRef, useState } from 'react';
import { usePopupStore } from '../../store/usePopupStore';
import { useShoppingStore } from '../../store/useShoppingStore';
import { useMembersStore } from '../../store/useMembersStore';
import { useGroupStore } from '../../store/useGroupStore';

export default function AddShoppingItemPopup() {
  const { closePopup } = usePopupStore();
  const {
    addItem,
    updateItem,
    itemToEdit,
    setItemToEdit,
    clearItemToEdit,
  } = useShoppingStore();
  const { members } = useMembersStore();
  const { group } = useGroupStore();

  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [storeTag, setStoreTag] = useState('');
  const [useTag, setUseTag] = useState('');

  const popupRef = useRef(null);

  useEffect(() => {
    if (itemToEdit) {
      setItemName(itemToEdit.item_name || '');
      setQuantity(itemToEdit.quantity || '');
      setAssignedTo(itemToEdit.assigned_to || '');
      setStoreTag(itemToEdit.store_tag || '');
      setUseTag(itemToEdit.use_tag || '');
    }
  }, [itemToEdit]);

  const handleSubmit = async () => {
    if (!itemName.trim()) return;

    const newItem = {
      item_name: itemName.trim(),
      quantity: quantity.trim(),
      assigned_to: assignedTo.trim(),
      store_tag: storeTag.trim(),
      use_tag: useTag.trim(),
      group_id: group?.id,
    };

    if (itemToEdit) {
      await updateItem({ ...newItem, id: itemToEdit.id });
    } else {
      await addItem(newItem);
    }

    handleClose();
  };

  const handleClose = () => {
    clearItemToEdit();
    closePopup();
  };

  // ✅ Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="popup-overlay">
      <div className="popup" ref={popupRef}>
        <h3>{itemToEdit ? 'Edit Item' : 'Add Shopping Item'}</h3>

        <label>
          Item name:
          <input value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="e.g. Aguacate" />
        </label>

        <label>
          Quantity:
          <input value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 1, 200 gsm" />
        </label>

        <label>
          Assigned to:
          <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
            <option value="">--</option>
            {members.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Store tag:
          <input value={storeTag} onChange={(e) => setStoreTag(e.target.value)} placeholder="e.g. Aldi, Mercadona" />
        </label>

        <label>
          Use tag:
          <input value={useTag} onChange={(e) => setUseTag(e.target.value)} placeholder="e.g. Dinner, Wednesday lunch" />
        </label>

        <div className="popup-actions">
          <button onClick={handleClose}>Cancel</button>
          <button onClick={handleSubmit}>{itemToEdit ? 'Update' : 'Add'}</button>
        </div>
      </div>
    </div>
  );
}
