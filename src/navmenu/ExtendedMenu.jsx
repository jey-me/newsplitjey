import React, { useState, useRef, useEffect } from "react";
import { usePopupStore } from "../store/usePopupStore";
import { RiMoreFill } from "react-icons/ri";
import { HiUserGroup, HiPencil, HiShare, HiHeart } from "react-icons/hi";
import ChangeEventNamePopup from "../components/popups/ChangeEventNamePopup";


export default function ExtendedMenu() {
  const { openPopup } = usePopupStore();
  const [showOptions, setShowOptions] = useState(false);
  const menuRef = useRef();

  const toggle = () => setShowOptions((prev) => !prev);

  const handleOption = (popupType) => {
    openPopup(popupType);
    setShowOptions(false);
  };

  // Click fuera del menú → cierra
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="extended-menu-container" ref={menuRef}>
      <button className="extended-menu-button" onClick={toggle}>
        <RiMoreFill />
      </button>

      {showOptions && (
        <div className="extended-menu-options">
          <button onClick={() => handleOption("manageMembers")}>
            <HiUserGroup /> Manage Members
          </button>
          <button onClick={() => handleOption("changeEventName")}>
            <HiPencil /> Change Event Name
          </button>
          <button onClick={() => handleOption("shareTrip")}>
            <HiShare /> Share Trip
          </button>
          <button onClick={() => handleOption("donate")}>
            <HiHeart /> Donate to Creator
          </button>
        </div>
      )}
    </div>
  );
}
