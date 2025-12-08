// src/components/CustomSelect.jsx
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const CustomSelect = ({ value, onChange, options, placeholder, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popupStyle, setPopupStyle] = useState(null);
  const buttonRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setPopupStyle(null);
      return;
    }

    const updatePosition = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();

      const top = rect.bottom + 4;
      const left = rect.left;
      const width = rect.width;

      setPopupStyle({
        position: "fixed",
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        zIndex: 9999,
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value) || null;
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        id={id}
        className="custom-select-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="custom-select-text">{displayText}</span>
        <svg
          className="custom-select-arrow"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="#707788"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && popupStyle && (
        <>
          {/* Transparent overlay */}
          {createPortal(
            <div
              className="custom-select-overlay"
              onClick={() => setIsOpen(false)}
              style={{ zIndex: 9998 }}
            />,
            document.body
          )}

          {/* Dropdown menu */}
          {createPortal(
            <div ref={popupRef} className="custom-select-dropdown" style={popupStyle}>
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`custom-select-option ${
                    value === option.value ? "custom-select-option-selected" : ""
                  }`}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>,
            document.body
          )}
        </>
      )}
    </>
  );
};

export default CustomSelect;

