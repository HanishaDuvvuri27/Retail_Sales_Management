 
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiCalendar } from "react-icons/fi";

const DateRangeFilter = ({ dateFrom, dateTo, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFrom, setTempFrom] = useState(dateFrom || "");
  const [tempTo, setTempTo] = useState(dateTo || "");
  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  const [popupStyle, setPopupStyle] = useState(null);

  useEffect(() => {
    setTempFrom(dateFrom || "");
    setTempTo(dateTo || "");
  }, [dateFrom, dateTo]);

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

  // Calculate popup position for viewport placement
  useEffect(() => {
    if (!isOpen) {
      setPopupStyle(null);
      return;
    }

    const updatePosition = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();

      // Use fixed positioning so popup floats relative to viewport
      const top = rect.bottom + 8; // distance from viewport top
      let left = rect.left - 8; // nudge left a bit

      // Determine popup width (measure or CSS fallback)
      const popupWidth = (popupRef.current && popupRef.current.offsetWidth) || 520;

      const minLeft = 8; // don't touch the very edge
      const maxLeft = window.innerWidth - popupWidth - 8;

      if (popupWidth >= window.innerWidth - 16) {
        // popup wider than viewport: pin to left with small padding
        left = minLeft;
      } else {
        // clamp inside viewport
        left = Math.min(Math.max(left, minLeft), Math.max(minLeft, maxLeft));
      }

      setPopupStyle({ position: "fixed", top: `${top}px`, left: `${left}px`, zIndex: 9999 });
    };

    // initial position
    updatePosition();

    // update on scroll/resize
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  const handleFromChange = (e) => {
    const value = e.target.value;
    setTempFrom(value);
    if (value && tempTo) {
      onChange({ dateFrom: value, dateTo: tempTo });
      setIsOpen(false);
    }
  };

  const handleToChange = (e) => {
    const value = e.target.value;
    setTempTo(value);
    if (tempFrom && value) {
      onChange({ dateFrom: tempFrom, dateTo: value });
      setIsOpen(false);
    }
  };

  const formatDisplayDate = () => {
    if (dateFrom && dateTo) {
      const from = new Date(dateFrom).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const to = new Date(dateTo).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return `${from} - ${to}`;
    }
    return "Date";
  };

  return (
    <div className="date-filter-wrapper">
      <button
        ref={buttonRef}
        type="button"
        className="date-filter-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiCalendar className="date-filter-icon" />
        <span className="date-filter-text">{formatDisplayDate()}</span>
      </button>

      {isOpen && popupStyle &&
        createPortal(
          <div ref={popupRef} className="date-filter-popup" style={popupStyle}>
            <div className="date-filter-calendars">
              <div className="date-filter-calendar">
                <label className="date-filter-label">From</label>
                <input
                  type="date"
                  className="date-filter-input"
                  value={tempFrom}
                  onChange={handleFromChange}
                  max={tempTo || undefined}
                />
              </div>
              <div className="date-filter-calendar">
                <label className="date-filter-label">To</label>
                <input
                  type="date"
                  className="date-filter-input"
                  value={tempTo}
                  onChange={handleToChange}
                  min={tempFrom || undefined}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default DateRangeFilter;

