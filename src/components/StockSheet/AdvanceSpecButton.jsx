/**
 * Unified "Advance Spec" toggle used across every material type's spec section
 * (StockSheet Add-New editor and the factory-code wizard's shared field components).
 * Full-width, orange border, very light orange fill when active.
 */
const AdvanceSpecButton = ({ active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={
      "w-full rounded-md border px-4 py-2.5 text-sm font-semibold text-primary transition-colors " +
      (active
        ? "border-primary bg-primary/10"
        : "border-primary/40 bg-white hover:bg-primary/5")
    }
  >
    {active ? "▼ Advance Spec" : "▶ Advance Spec"}
  </button>
);

export default AdvanceSpecButton;
