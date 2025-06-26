// src/components/popups/AddExpensePopup.jsx
import React, { useEffect, useRef, useState } from "react";
import { usePopupStore } from "../../store/usePopupStore";
import { useExpensesStore } from "../../store/useExpensesStore";
import { useMembersStore } from "../../store/useMembersStore";

export default function AddExpensePopup() {
  const { closePopup } = usePopupStore();
  const { addExpense } = useExpensesStore();
  const { members } = useMembersStore();

  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitBetween, setSplitBetween] = useState([]);

  const handleSplitToggle = (memberId) => {
    setHasUnsavedChanges(true);
    setSplitBetween((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSubmit = async () => {
    if (!expenseName.trim() || !amount || !paidBy) return;

    const split =
      splitBetween.length > 0 ? splitBetween : members.map((m) => m.id);

    await addExpense({
      expense_name: expenseName.trim(),
      amount: parseFloat(amount),
      paid_by: paidBy,
      split_between: split,
    });

    closePopup();
  };

  const popupRef = useRef();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleClickOutside = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      if (hasUnsavedChanges) {
        const confirmLeave = window.confirm(
          "You have unsaved changes. Are you sure you want to close?"
        );
        if (!confirmLeave) return;
      }
      closePopup();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [hasUnsavedChanges]);

  const handleAnyChange = () => {
    if (!hasUnsavedChanges) setHasUnsavedChanges(true);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div ref={popupRef} className="popup">
          <h3>Add Expense</h3>

          <label>
            Paid by:
            <select style={{marginLeft: 4 }} stylevalue={paidBy} onChange={(e) => { setPaidBy(e.target.value); handleAnyChange(); }}>
              <option value="">Select member</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Description:
            <input
              value={expenseName}
              onChange={(e) => { setExpenseName(e.target.value); handleAnyChange(); }}
              placeholder="e.g. Aldi, Bebidas, Postre"
            />
          </label>

          <label>
            Amount (€):
            <input
              type="number"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); handleAnyChange(); }}
            />
          </label>

          <label>Split between:</label>
          {splitBetween.length === 0 && (
            <small>⚠️ Automatically split between all members</small>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {members.map((m) => {
              const isChecked = splitBetween.includes(m.id);
              return (
                <label
                  key={m.id}
                  className={`member-pill ${
                    isChecked ? "checked" : "unchecked"
                  }`}
                >
                  {m.name}
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleSplitToggle(m.id)}
                  />
                </label>
              );
            })}
          </div>

          <div className="popup-actions">
            <button onClick={closePopup}>Cancel</button>
            <button onClick={handleSubmit}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}
