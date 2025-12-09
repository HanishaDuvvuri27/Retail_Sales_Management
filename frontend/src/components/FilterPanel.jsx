 
import DateRangeFilter from "./DateRangeFilter";
import CustomSelect from "./CustomSelect";

const FilterPanel = ({
  filters,
  onChange,
  tagOptions = [],
  paymentOptions = [],
  categoryOptions = [],
}) => {
  const handleSelect = (key, value) => {
    const next = { ...filters };
    // Single-select controls except date range
    if (["regions", "genders", "categories", "tags", "paymentMethods"].includes(key)) {
      next[key] = value ? [value] : [];
      if (key === "categories") {
        next.tags = [];
      }
    } else if (key === "ageRange") {
      next.ageRange = value;
    }
    onChange(next);
  };

  const handleDateChange = ({ dateFrom, dateTo }) => {
    const next = { ...filters, dateFrom, dateTo };
    onChange(next);
  };

  return (
    <div className="filter-panel">
      <div className="filter-group">
        <CustomSelect
          id="region-select"
          value={filters.regions[0] || ""}
          onChange={(value) => handleSelect("regions", value)}
          placeholder="Customer Region"
          options={[
            { value: "", label: "Customer Region" },
            { value: "North", label: "North" },
            { value: "South", label: "South" },
            { value: "East", label: "East" },
            { value: "West", label: "West" },
          ]}
        />
      </div>

      <div className="filter-group">
        <CustomSelect
          id="gender-select"
          value={filters.genders[0] || ""}
          onChange={(value) => handleSelect("genders", value)}
          placeholder="Gender"
          options={[
            { value: "", label: "Gender" },
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
          ]}
        />
      </div>

      <div className="filter-group">
        <CustomSelect
          id="age-select"
          value={filters.ageRange || ""}
          onChange={(value) => handleSelect("ageRange", value)}
          placeholder="Age Range"
          options={[
            { value: "", label: "Age Range" },
            { value: "18-25", label: "18–25" },
            { value: "26-35", label: "26–35" },
            { value: "36-45", label: "36–45" },
            { value: "46-60", label: "46–60" },
          ]}
        />
      </div>

      <div className="filter-group">
        <CustomSelect
          id="category-select"
          value={filters.categories[0] || ""}
          onChange={(value) => handleSelect("categories", value)}
          placeholder="Product Category"
          options={
            categoryOptions && categoryOptions.length
              ? categoryOptions
              : [
                  { value: "", label: "Product Category" },
                  { value: "Clothing", label: "Clothing" },
                  { value: "Electronics", label: "Electronics" },
                  { value: "Grocery", label: "Grocery" },
                ]
          }
        />
      </div>

      <div className="filter-group">
        <CustomSelect
          id="tags-select"
          value={filters.tags[0] || ""}
          onChange={(value) => handleSelect("tags", value)}
          placeholder="Tags"
          options={
            tagOptions && tagOptions.length
              ? tagOptions
              : [
                  { value: "", label: "Tags" },
                  { value: "Sale", label: "Sale" },
                  { value: "New", label: "New" },
                  { value: "Seasonal", label: "Seasonal" },
                ]
          }
        />
      </div>

      <div className="filter-group">
        <CustomSelect
          id="payment-select"
          value={filters.paymentMethods[0] || ""}
          onChange={(value) => handleSelect("paymentMethods", value)}
          placeholder="Payment Method"
          options={
            paymentOptions && paymentOptions.length
              ? paymentOptions
              : [
                  { value: "", label: "Payment Method" },
                  { value: "Card", label: "Card" },
                  { value: "Cash", label: "Cash" },
                  { value: "UPI", label: "UPI" },
                ]
          }
        />
      </div>

      <div className="filter-group">
        <DateRangeFilter
          dateFrom={filters.dateFrom}
          dateTo={filters.dateTo}
          onChange={handleDateChange}
        />
      </div>
    </div>
  );
};

export default FilterPanel;
