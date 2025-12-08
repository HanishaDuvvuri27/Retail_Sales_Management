 
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="search-bar">
      <span className="search-icon">
        <FiSearch />
      </span>
      <input
        type="text"
        className="search-input"
        placeholder="Name, Phone no."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
