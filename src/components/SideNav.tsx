"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDarkMode } from "../contexts/DarkModeContext";
import {
  RiHome2Line,
  RiAccountCircleLine,
  RiMoneyDollarCircleLine,
  RiTableAltLine,
  RiAlarmWarningLine,
  RiGlobalLine,
  RiTwitterFill,
  RiTiktokFill,
  RiInstagramLine,
  RiYoutubeLine,
  RiCollapseDiagonalFill,
  RiToggleLine,
  RiExchange2Fill,
} from "react-icons/ri";

const SideNav: React.FC = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [collapsed, setCollapsed] = useState(false); // Start with sidebar open
  const [portfolioSubmenuOpen, setPortfolioSubmenuOpen] = useState(false); // State to manage submenu visibility

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const togglePortfolioSubmenu = () => {
    setPortfolioSubmenuOpen(!portfolioSubmenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      // Set collapsed state based on screen width
      if (window.innerWidth < 1025) {
        setCollapsed(true); // Close sidebar on smaller screens
      } else {
        setCollapsed(false); // Open sidebar on larger screens
      }
    };

    // Initial check on mount
    handleResize();

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Clean up the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav
      className={`fixed bottom-0 left-0 w-full lg:w-auto bg-gray-200 border-t border-gray-300 lg:border-r ${
        darkMode ? "dark:bg-gray-800" : ""
      } lg:static lg:border-l transform lg:translate-x-0 ${
        collapsed ? "lg:flex lg:flex-col lg:w-20" : "lg:w-64"
      }`}
      style={{ transition: "width 0.3s ease, transform 0.3s ease" }}
    >
      {/* Collapse Icon */}
      <div className="flex top-4 right-0 lg:top-4 lg:right-0">
        <button
          onClick={toggleSidebar}
          className={`p-2 ${darkMode ? "dark:text-white" : "text-black"} hover:bg-gray-300 rounded-full ${
            darkMode ? "dark:hover:bg-gray-700" : ""
          }`}
        >
          <RiCollapseDiagonalFill />
        </button>
      </div>

      <ul className="flex lg:block lg:space-y-1 mt-4 lg:mt-4 gap-y-1">
        {/* Navigation Items */}
        <li
          className={`px-2 py-2 w-full lg:w-auto ${
            darkMode ? "text-white" : "text-black"
          } hover:bg-gray-300 ${darkMode ? "dark:hover:bg-gray-700" : ""}`}
        >
          <Link href="/" legacyBehavior>
            <a
              className="flex items-center text-xs lg:text-base"
              title={!collapsed ? "Home" : "Home"}
            >
              <div className="flex items-center">
                <RiHome2Line
                  className={`${collapsed ? "icon-collapse" : "text-base"} mr-2 h-6 w-6`}
                />
                {!collapsed && <span>Home</span>}
              </div>
            </a>
          </Link>
        </li>
        <li
  className={`px-2 py-2 w-full lg:w-auto ${
    darkMode ? "text-white" : "text-black"
  } hover:bg-gray-300 ${darkMode ? "dark:hover:bg-gray-700" : ""}`}
>
  <div
    className="flex items-center cursor-pointer"
    onClick={togglePortfolioSubmenu}
    title={!collapsed ? "Portfolio" : "Portfolio"}
  >
    <RiAccountCircleLine
      className={`${collapsed ? "icon-collapse" : "text-base"} mr-2 h-6 w-6`}
    />
    {!collapsed && <span>Portfolio</span>}
  </div>
  {/* Submenu */}
  {portfolioSubmenuOpen && (
    <ul className="ml-8">
      <li className={`py-1 ${darkMode ? "text-white" : "text-black"} hover:bg-gray-300 ${darkMode ? "dark:hover:bg-gray-700" : ""}`}>
        <Link href="/profile" legacyBehavior>
          <a className="flex items-center text-xs lg:text-sm">
            <RiAccountCircleLine
              className={`${collapsed ? "icon-collapse" : "text-base"} mr-2 h-6 w-6`}
            />
            My Profile
          </a>
        </Link>
      </li>
      <li className={`py-1 ${darkMode ? "text-white" : "text-black"} hover:bg-gray-300 ${darkMode ? "dark:hover:bg-gray-700" : ""}`}>
        <Link href="/portfolio" legacyBehavior>
                    <a className="flex items-center text-xs lg:text-sm">
            <RiMoneyDollarCircleLine
              className={`${collapsed ? "icon-collapse" : "text-base"} mr-2 h-6 w-6`}
            />
            Portfolio
          </a>
        </Link>
      </li>
    </ul>
  )}
</li>
        <li
          className={`px-2 py-2 w-full lg:w-auto ${
            darkMode ? "text-white" : "text-black"
          } hover:bg-gray-300 ${darkMode ? "dark:hover:bg-gray-700" : ""}`}
        >
          <Link href="/refer" legacyBehavior>
            <a
              className="flex items-center text-xs lg:text-base"
              title={!collapsed ? "Referrals" : "Referrals"}
            >
              <div className="flex items-center">
                <RiExchange2Fill
                  className={`${collapsed ? "icon-collapse" : "text-base"} mr-2 h-6 w-6`}
                />
                {!collapsed && <span>Referrals</span>}
              </div>
            </a>
          </Link>
        </li>
        <li
          className={`px-2 py-2 w-full lg:w-auto ${
            darkMode ? "text-white" : "text-black"
          } hover:bg-gray-300 ${darkMode ? "dark:hover:bg-gray-700" : ""}`}
        >
          <Link href="/explorer" legacyBehavior>
            <a
              className="flex items-center text-xs lg:text-base"
              title={!collapsed ? "Explorer" : "Explorer"}
            >
              <div className="flex items-center">
                <RiTableAltLine
                  className={`${collapsed ? "icon-collapse" : "text-base"} mr-2 h-6 w-6`}
                />
                {!collapsed && <span>Explorer</span>}
              </div>
            </a>
          </Link>
        </li>
        <li
          className={`px-2 py-2 w-full lg:w-auto ${
            darkMode ? "text-white" : "text-black"
          } hover:bg-gray-300 ${darkMode ? "dark:hover:bg-gray-700" : ""}`}
        >
          <Link href="/defi" legacyBehavior>
            <a
              className="flex items-center text-xs lg:text-base"
              title={!collapsed ? "Defi" : "Defi"}
            >
              <div className="flex items-center">
                <RiMoneyDollarCircleLine
                  className={`${collapsed ? "icon-collapse" : "text-base"} mr-2 h-6 w-6`}
                />
                {!collapsed && <span>Defi</span>}
              </div>
            </a>
          </Link>
        </li>
        <li
          className={`px-2 py-2 w-full lg:w-auto ${
            darkMode ? "text-white" : "text-black"
          } hover:bg-gray-300 ${darkMode ? "dark:hover:bg-gray-700" : ""}`}
        >
          <Link href="/alerts" legacyBehavior>
            <a
              className="flex items-center text-xs lg:text-base"
              title={!collapsed ? "Alerts" : "Alerts"}
            >
              <div className="flex items-center">
                <RiAlarmWarningLine
                  className={`${collapsed ? "icon-collapse" : "text-base"} mr-2 h-6 w-6`}
                />
                {!collapsed && <span>Alerts</span>}
              </div>
            </a>
          </Link>
        </li>
        <li
          className={`px-2 py-2 w-full lg:w-auto ${
            darkMode ? "text-white" : "text-black"
          } hover:bg-gray-300 ${darkMode ? "dark:hover:bg-gray-700" : ""}`}
        >
          <Link href="/developers" legacyBehavior>
            <a
              className="flex items-center text-xs lg:text-base"
              title={!collapsed ? "Developers" : "Developers"}
            >
              <div className="flex items-center">
                <RiGlobalLine
                  className={`${collapsed ? "icon-collapse" : "text-base"} mr-2 h-6 w-6`}
                />
                {!collapsed && <span>Developers</span>}
              </div>
            </a>
          </Link>
        </li>
      </ul>

      {/* Social Media Icons - Displayed inline */}
      {!collapsed && (
        <div className="mt-4 px-4 flex space-x-4 justify-center">
          <a
            href="https://twitter.com/BloxSolutions"
            target="_blank"
            rel="noopener noreferrer"
            className={`${darkMode ? "text-white" : "text-black"} hover:text-gray-600 flex items-center`}
          >
            <RiTwitterFill className="icon-size" />
          </a>
          <a
            href="https://tiktok.com/@bloxsolutions"
            target="_blank"
            rel="noopener noreferrer"
            className={`${darkMode ? "text-white" : "text-black"} hover:text-gray-600 flex items-center`}
          >
            <RiTiktokFill className="icon-size" />
          </a>
          <a
            href="https://instagram.com/bloxsolutions"
            target="_blank"
            rel="noopener noreferrer"
            className={`${darkMode ? "text-white" : "text-black"} hover:text-gray-600 flex items-center`}
          >
            <RiInstagramLine className="icon-size" />
          </a>
          <a
            href="https://youtube.com/@bloxsolutions"
            target="_blank"
            rel="noopener noreferrer"
            className={`${darkMode ? "text-white" : "text-black"} hover:text-gray-600 flex items-center`}
          >
            <RiYoutubeLine className="icon-size" />
          </a>
        </div>
      )}

      {/* Policies, Toggle, and Copyright */}
      <div className="mt-4 px-4 text-xs text-center text-white-600">
        {!collapsed && (
          <>
            <div className="mt-4">
              <Link href="/privacy-policy" legacyBehavior>
                <a className="hover:text-gray-600 block">Privacy Policy</a>
              </Link>
              <Link href="/terms-of-service" legacyBehavior>
                <a className="hover:text-gray-600 block">Terms of Service</a>
              </Link>
              <button
                onClick={toggleDarkMode}
                className={`p-2 ${darkMode ? "dark:text-white" : "text-black"} text-base mt-4`}
              >
                <RiToggleLine className="icon-size" />
              </button>
            </div>
            <div className="mt-4">
              <p>© Blox Solutions, LLC 2024</p>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default SideNav;