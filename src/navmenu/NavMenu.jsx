import React from "react";
import { FiList } from "react-icons/fi";
import { HiHome, HiOutlineHome, HiOutlineShoppingCart, HiShoppingCart } from "react-icons/hi";
import { RiMoneyEuroCircleFill, RiMoneyEuroCircleLine } from "react-icons/ri";
import { NavLink, useParams } from "react-router-dom";
import { usePopupStore } from '../store/usePopupStore';
import ActionSelector from "./ActionSelector";
import ExtendedMenu from "./ExtendedMenu";
export default function NavMenu() {
  const { groupSlug, eventSlug } = useParams();
  const { openPopup } = usePopupStore();

  const basePath = `/${groupSlug}/${eventSlug}`;

  return (
    <nav className="nav-menu">
      <NavLink to={`${basePath}/home`} className={({ isActive }) => (isActive ? "active" : "")}>
        {({ isActive }) => isActive ? <HiHome /> : <HiOutlineHome />}
      </NavLink>

      <NavLink to={`${basePath}/Shopping`} className={({ isActive }) => (isActive ? "active" : "")}>
      {({ isActive }) => isActive ? <HiShoppingCart /> : <HiOutlineShoppingCart />}
      </NavLink>

      <ActionSelector />

      <NavLink to={`${basePath}/Expenses`} className={({ isActive }) => (isActive ? "active" : "")}>
      {({ isActive }) => isActive ? <RiMoneyEuroCircleFill /> : <RiMoneyEuroCircleLine />}
      </NavLink>

      <ExtendedMenu />
    </nav>
  );
}
