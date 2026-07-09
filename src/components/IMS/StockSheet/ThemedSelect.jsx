import Select from "react-select";

/**
 * react-select themed with Tailwind to match the flat StockSheet design (grey borders,
 * small radius, orange primary for the selected option). Works with plain { value, label }
 * options; `value` is the raw value and `onChange` is called with the raw value ("" cleared).
 *
 * The menu is rendered inline (not portaled) on purpose so it scales with the StockSheet
 * root's `zoom`.
 */
const ThemedSelect = ({
  value,
  onChange,
  options = [],
  placeholder = "-- Select --",
  isDisabled = false,
  isClearable = false,
  isSearchable = true,
  inputId,
}) => {
  const selected = options.find((o) => o.value === value) || null;

  return (
    <Select
      inputId={inputId}
      unstyled
      isDisabled={isDisabled}
      isClearable={isClearable}
      isSearchable={isSearchable}
      placeholder={placeholder}
      options={options}
      value={selected}
      onChange={(opt) => onChange(opt ? opt.value : "")}
      menuPlacement="auto"
      classNames={{
        control: ({ isFocused, isDisabled: disabled }) =>
          [
            "min-h-[42px] w-full rounded-md border px-3 text-sm transition-colors",
            disabled
              ? "cursor-not-allowed bg-muted opacity-60 border-[#e2e3e8]"
              : isFocused
                ? "cursor-text border-primary ring-2 ring-primary/15 bg-white"
                : "cursor-pointer border-[#e2e3e8] hover:border-[#c9cad2] bg-white",
          ].join(" "),
        valueContainer: () => "gap-1 px-1 py-1",
        placeholder: () => "text-muted-foreground",
        singleValue: () => "text-foreground",
        input: () => "text-foreground",
        indicatorsContainer: () => "gap-1",
        dropdownIndicator: () =>
          "px-1 text-muted-foreground transition-colors hover:text-foreground",
        clearIndicator: () =>
          "px-1 text-muted-foreground transition-colors hover:text-foreground",
        indicatorSeparator: () => "hidden",
        menu: () =>
          "mt-1 overflow-hidden rounded-md border border-[#e2e3e8] bg-popover text-popover-foreground shadow-sm z-50",
        menuList: () => "max-h-60 p-1",
        option: ({ isFocused, isSelected }) =>
          [
            "cursor-pointer rounded-sm px-3 py-2 text-sm transition-colors",
            isSelected
              ? "bg-primary text-primary-foreground"
              : isFocused
                ? "bg-accent text-accent-foreground"
                : "text-foreground",
          ].join(" "),
        noOptionsMessage: () => "px-3 py-2 text-sm text-muted-foreground",
      }}
    />
  );
};

export default ThemedSelect;
