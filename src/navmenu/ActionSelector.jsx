// src/components/NavMenu/ActionSelector.jsx
import React, { useEffect, useRef, useState } from "react";
import { usePopupStore } from "../store/usePopupStore";
import { GrAddCircle } from "react-icons/gr";

export default function ActionSelector() {
  const { openPopup } = usePopupStore();
  const [showOptions, setShowOptions] = useState(false);
  const containerRef = useRef(null);

  const toggle = () => setShowOptions(!showOptions);

  const handleOption = (popupType) => {
    openPopup(popupType);
    setShowOptions(false);
  };

  const handleClickOutside = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showOptions]);

  return (
    <div className="action-selector-container" ref={containerRef}>
      <button className="action-selector-main" onClick={toggle}>
        <GrAddCircle />
      </button>

      {showOptions && (
        <div className="action-selector-options">
          <button onClick={() => handleOption("expense")}>+ Expense</button>
          <button onClick={() => handleOption("shopping")}>+ Item</button>
        </div>
      )}
    </div>
  );
}
