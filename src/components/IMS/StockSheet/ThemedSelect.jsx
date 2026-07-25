import Select from "react-select";

/**
 * react-select themed with Tailwind to match the flat StockSheet design (grey borders,
 * small radius, orange primary for the selected option). Works with plain { value, label }
 * options; `value` is the raw value and `onChange` is called with the raw value ("" cleared).
 *
 * The menu is rendered inline by default (so it scales with a `zoom`ed root). Pass
 * `menuPortal` when the select sits inside a scroll/overflow container (e.g. a table
 * with `overflow-x-auto`) that would otherwise clip the open menu — this renders the
 * menu into <body> so every option is visible regardless of the container's clipping.
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
  menuPortal = false,
}) => {
  const selected = options.find((o) => o.value === value) || null;

  const portalProps = menuPortal
    ? {
        menuPortalTarget:
          typeof document !== "undefined" ? document.body : undefined,
        menuPosition: "fixed",
        styles: { menuPortal: (base) => ({ ...base, zIndex: 10000 }) },
      }
    : {};

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
      {...portalProps}
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
