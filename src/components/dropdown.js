import React, { useState, useRef, useEffect } from "react";
import "./dropdown.scss";

const Dropdown = ({ expandUpwards = false, searchEnabled = true }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cursor, setCursor] = useState(0);

  const options = [
    { value: "Selected Option", icon: null, disabled: false },
    { value: "Default Option", icon: null, disabled: false },
    { value: "Hovered Option", icon: null, disabled: false },
    { value: "Disabled Option", icon: null, disabled: true },
    { value: "Text Option", icon: null, disabled: false },
    { value: "Icon and Text Option", icon: "📃", disabled: false },
  ];

  const filteredOptions = options.filter((option) =>
    option.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const menuRef = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  // Handle opening/closing dropdown and resetting search term
  const handleClick = (e) => {
    e.preventDefault();
    setOpen(!open);
    if (!open) {
      setSearchTerm(""); // Reset search term when opening
      setCursor(0); // Reset cursor to the first option
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      setCursor((prevCursor) =>
        prevCursor < filteredOptions.length - 1 ? prevCursor + 1 : prevCursor
      );
    } else if (e.key === "ArrowUp") {
      setCursor((prevCursor) => (prevCursor > 0 ? prevCursor - 1 : prevCursor));
    } else if (e.key === "Enter") {
      const option = filteredOptions[cursor];
      if (option && !option.disabled) {
        setSelected(option.value);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false); // Close dropdown on Escape key
    }
  };

  return (
    <div className="dropdown">
      <div className="dropdown-wrapper" ref={menuRef}>
        <div
          className="dropdown-header"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex="0"
        >
          {open && searchEnabled ? (
            <input
              type="text"
              className="dropdown-search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCursor(0); // Reset cursor when filtering
              }}
              autoFocus
            />
          ) : (
            <div className="dropdown-title">
              {selected ? selected : "Default Dropdown"}
              <span className="dropdown-arrow">▼</span>
            </div>
          )}
        </div>
        {open && (
          <ul className={`list ${expandUpwards ? "expand-upwards" : ""}`}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, i) => (
                <li
                  key={option.value}
                  onClick={() => {
                    if (!option.disabled) {
                      setSelected(option.value);
                      setOpen(false);
                    }
                  }}
                  className={`${cursor === i ? "activeList" : "list-item"} ${
                    option.disabled ? "disabled" : ""
                  }`}
                >
                  {option.icon && (
                    <span className="item-icon">{option.icon}</span>
                  )}
                  <span className="item-text">{option.value}</span>
                  {selected === option.value && <span className="tick">✔</span>}
                </li>
              ))
            ) : (
              <li className="list-item">No results found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dropdown;

