import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const MENU_WIDTH = 236;

/**
 * Triple-dot row actions menu.
 * Renders the popover with position: fixed so it is never clipped by
 * scrollable table wrappers, and flips upward when there is no room below.
 */
export default function RowMenu({ children, label = 'Row actions' }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: -9999, left: -9999 });
  const btnRef = useRef(null);
  const popRef = useRef(null);

  useLayoutEffect(() => {
    if (!open) return;
    const btn = btnRef.current;
    const pop = popRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const h = pop ? pop.offsetHeight : 260;
    let top = r.bottom + 6;
    if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 6);
    let left = r.right - MENU_WIDTH;
    if (left < 8) left = 8;
    if (left + MENU_WIDTH > window.innerWidth - 8) left = window.innerWidth - MENU_WIDTH - 8;
    setPos({ top, left });
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onDocDown = (e) => {
      if (popRef.current?.contains(e.target) || btnRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const close = () => setOpen(false);
    document.addEventListener('mousedown', onDocDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', onDocDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  return (
    <div className="row-menu">
      <button
        type="button"
        ref={btnRef}
        className="row-menu-btn"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        ⋮
      </button>
      {open && (
        <div
          ref={popRef}
          className="row-menu-pop"
          role="menu"
          style={{ top: pos.top, left: pos.left, width: MENU_WIDTH }}
          onClick={(e) => {
            // Keep the menu open while interacting with a <select>, close on action clicks.
            if (!e.target.closest('.row-menu-field')) setOpen(false);
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
