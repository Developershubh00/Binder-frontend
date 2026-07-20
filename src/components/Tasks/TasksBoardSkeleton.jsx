// Loading placeholder for the Kanban board — mirrors the real column/card layout
// so the page doesn't jump when tasks arrive. Purely presentational.
import { COLUMNS } from './tasksData';

// Number of placeholder cards per column (index-matched to COLUMNS) — varied so it
// reads like a real, unevenly-filled board rather than a grid.
const CARDS_PER_COLUMN = [3, 2, 3, 2];

const SkeletonCard = ({ withProgress }) => (
  <div className="rounded-lg border border-[#e2e3e8] bg-card p-3.5 shadow-sm">
    {/* Top row: priority pill + assignee avatar */}
    <div className="mb-3 flex items-start justify-between">
      <div className="h-5 w-16 rounded bg-[#e7e8ec]" />
      <div className="h-7 w-7 rounded-full bg-[#e7e8ec]" />
    </div>
    {/* Title */}
    <div className="h-3.5 w-4/5 rounded bg-[#e2e3e8]" />
    {/* Description */}
    <div className="mt-2 h-2.5 w-full rounded bg-[#eef0f3]" />
    <div className="mt-1.5 h-2.5 w-3/5 rounded bg-[#eef0f3]" />
    {/* Optional progress bar */}
    {withProgress && <div className="mt-3 h-1.5 w-full rounded-full bg-[#eef0f3]" />}
    {/* Footer meta */}
    <div className="mt-3 flex items-center gap-3">
      <div className="h-2.5 w-16 rounded bg-[#eef0f3]" />
      <div className="h-2.5 w-10 rounded bg-[#eef0f3]" />
    </div>
  </div>
);

const TasksBoardSkeleton = () => (
  <div
    className="tasks-board-scroll overflow-x-auto pb-4"
    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    aria-hidden="true"
  >
    <div className="flex animate-pulse gap-5">
      {COLUMNS.map((column, colIndex) => (
        <div key={column.key} className="flex w-80 shrink-0 flex-col">
          {/* Column header — keep the real dot colour, skeleton the rest */}
          <div className="mb-3 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${column.dot}`} />
              <div className="h-3 w-24 rounded bg-[#dcdde2]" />
              <span className="h-5 w-5 rounded-full bg-[#e7e8ec]" />
            </div>
            <div className="h-6 w-6 rounded-md bg-[#e7e8ec]" />
          </div>

          {/* Card list */}
          <div className="flex flex-1 flex-col gap-3 rounded-lg bg-[#ececee]/60 p-2.5">
            {Array.from({ length: CARDS_PER_COLUMN[colIndex] ?? 2 }).map((_, i) => (
              <SkeletonCard key={i} withProgress={i % 2 === 1} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TasksBoardSkeleton;
