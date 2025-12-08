// src/components/SortingDropdown.jsx
import CustomSelect from "./CustomSelect";

const SortingDropdown = ({ sort, onChange }) => {
  const handleChange = (value) => {
    if (value === "date") {
      onChange({ sortBy: "date", sortOrder: "desc" });
    } else if (value === "quantity") {
      onChange({ sortBy: "quantity", sortOrder: "desc" });
    } else if (value === "customerName") {
      onChange({ sortBy: "customerName", sortOrder: "asc" });
    }
  };

  const currentValue =
    sort.sortBy === "date"
      ? "date"
      : sort.sortBy === "quantity"
      ? "quantity"
      : "customerName";

  return (
    <div className="sorting-dropdown">
      <span className="sorting-label">Sort by</span>
      <CustomSelect
        value={currentValue}
        onChange={handleChange}
        placeholder="Sort by"
        options={[
          { value: "customerName", label: "Customer Name (A–Z)" },
          { value: "date", label: "Date (Newest First)" },
          { value: "quantity", label: "Quantity" },
        ]}
      />
    </div>
  );
};

export default SortingDropdown;
