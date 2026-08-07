// A deliberately blank home — no greeting, no user name, no icons. Just a quiet,
// understated wordmark centered in the canvas so the landing feels considered
// rather than empty.
const HomeContent = () => {
  return (
    <div
      className="flex min-h-full w-full items-center justify-center bg-[#f8f9fb] px-6"
      style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="flex flex-col items-center gap-5 select-none">
        <span className="text-[11px] font-semibold uppercase tracking-[0.5em] text-muted-foreground/70">
          Binder OS
        </span>
        <span
          aria-hidden="true"
          className="h-px w-24 bg-linear-to-r from-transparent via-[#d5d6dc] to-transparent"
        />
        <span className="text-sm font-light tracking-wide text-muted-foreground/60">
          Your workspace is ready
        </span>
      </div>
    </div>
  );
};

export default HomeContent;
