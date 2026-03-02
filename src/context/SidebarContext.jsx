// src/context/SidebarContext.jsx
import { createContext, useContext } from 'react';

export const SidebarContext = createContext({ isSidebarCollapsed: false });

export const useSidebar = () => useContext(SidebarContext);

/** Sidebar width when expanded (px) */
export const SIDEBAR_WIDTH_EXPANDED = 260;
/** Sidebar width when collapsed (px) */
export const SIDEBAR_WIDTH_COLLAPSED = 76;
