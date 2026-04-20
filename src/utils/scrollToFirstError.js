/**
 * Scroll to (and focus) the first form field flagged as invalid.
 *
 * Resolution order for each error key:
 *   1. element with matching `name="<key>"`
 *   2. element with matching `id="<key>"`
 *   3. element with matching `data-field="<key>"`
 *
 * Among all resolved candidates, the one earliest in DOM order wins, so the
 * user lands on the topmost missing field rather than the first key in the
 * errors object.
 *
 * Falls back to the first `[aria-invalid="true"]` / `.field-error` /
 * `.border-destructive` / `.error` element if no key matches.
 *
 * Scrolls the nearest scrollable ancestor (e.g. a `.content-wrapper` with
 * `overflow: auto`) instead of the window, and applies a top offset so the
 * target isn't jammed against a sticky header.
 *
 * @param {Object|string[]} errors - Errors object (key → message) OR array of field keys.
 * @param {Object} [options]
 * @param {HTMLElement|Document} [options.root=document] - Search root.
 * @param {number} [options.topOffset=96] - Pixels of breathing room above the target.
 * @param {boolean} [options.focus=true] - Whether to focus the field after scroll.
 */
export function scrollToFirstError(errors, options = {}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const root = options.root || document;
  const topOffset = typeof options.topOffset === 'number' ? options.topOffset : 96;
  const shouldFocus = options.focus !== false;

  // Defer past React's commit phase (setErrors in the same tick hasn't
  // rendered yet). setTimeout 0 runs after microtasks, so the DOM has the
  // new aria-invalid / field-error class by the time we query.
  setTimeout(() => runScroll(root, errors, topOffset, shouldFocus), 0);
}

function runScroll(root, errors, topOffset, shouldFocus) {
  const keys = Array.isArray(errors)
    ? errors.filter(Boolean).map(String)
    : Object.keys(errors || {}).filter((k) => {
        const v = errors[k];
        if (v == null) return false;
        if (typeof v === 'string') return v.trim() !== '';
        return true;
      });

  const findElement = (key) => {
    const escaped = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(key) : key;
    return (
      root.querySelector(`[name="${escaped}"]`) ||
      root.querySelector(`#${escaped}`) ||
      root.querySelector(`[data-field="${escaped}"]`)
    );
  };

  let target = null;

  if (keys.length) {
    const candidates = keys.map(findElement).filter(Boolean);
    if (candidates.length) {
      target = candidates.reduce((earliest, el) => {
        if (!earliest) return el;
        const pos = earliest.compareDocumentPosition(el);
        return pos & Node.DOCUMENT_POSITION_PRECEDING ? el : earliest;
      }, null);
    }
  }

  if (!target) {
    const fallbackSelectors = [
      '[aria-invalid="true"]',
      '.field-error',
      '.border-destructive',
      '.border-red-600',
      '.border-red-500',
      '.border-red-400',
      '.error',
    ];
    for (const sel of fallbackSelectors) {
      const el = root.querySelector(sel);
      if (el) { target = el; break; }
    }
  }

  if (!target) return;

  // Prefer scrolling the enclosing field wrapper (so the label is visible),
  // but keep the focus target as the original input.
  const focusTarget = target;
  const scrollTarget = findFieldWrapper(target) || target;

  const scroller = findScrollableAncestor(scrollTarget);
  smoothScrollTo(scroller, scrollTarget, topOffset);

  if (shouldFocus) {
    // Delay focus so the browser's focus-scroll heuristics don't fight our
    // smooth scroll. preventScroll keeps the browser from snapping.
    setTimeout(() => {
      if (typeof focusTarget.focus === 'function') {
        try {
          focusTarget.focus({ preventScroll: true });
        } catch {
          focusTarget.focus();
        }
      }
    }, 350);
  }
}

function findFieldWrapper(el) {
  // Walk up to find a container that has a label + input (so scrolling shows
  // both). `.field-error` wraps in this app; otherwise look for any element
  // with class starting with `field` or a `<label>` parent.
  let node = el;
  let depth = 0;
  while (node && node !== document.body && depth < 6) {
    if (node.classList) {
      if (
        node.classList.contains('field-error') ||
        node.classList.contains('form-field') ||
        node.classList.contains('field')
      ) {
        return node;
      }
    }
    node = node.parentElement;
    depth++;
  }
  return null;
}

function findScrollableAncestor(el) {
  let node = el.parentElement;
  while (node && node !== document.body) {
    const style = window.getComputedStyle(node);
    const overflowY = style.overflowY;
    const canScroll =
      (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
      node.scrollHeight > node.clientHeight;
    if (canScroll) return node;
    node = node.parentElement;
  }
  // Root scrolling element (document) — matches window scroll.
  return document.scrollingElement || document.documentElement;
}

function smoothScrollTo(scroller, target, topOffset) {
  const targetRect = target.getBoundingClientRect();
  const isRoot =
    scroller === document.scrollingElement || scroller === document.documentElement;

  let top;
  if (isRoot) {
    top = targetRect.top + window.scrollY - topOffset;
  } else {
    const scrollerRect = scroller.getBoundingClientRect();
    top = scroller.scrollTop + (targetRect.top - scrollerRect.top) - topOffset;
  }

  top = Math.max(top, 0);

  try {
    if (isRoot) {
      window.scrollTo({ top, behavior: 'smooth' });
    } else {
      scroller.scrollTo({ top, behavior: 'smooth' });
    }
  } catch {
    // Fallback for older browsers that reject smooth behavior.
    if (isRoot) {
      window.scrollTo(0, top);
    } else {
      scroller.scrollTop = top;
    }
  }
}

export default scrollToFirstError;
