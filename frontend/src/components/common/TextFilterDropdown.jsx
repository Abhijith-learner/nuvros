import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const iconButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 16,
  background: 'transparent',
  border: 'none',
  padding: 0,
  margin: 0,
  cursor: 'pointer',
  color: 'inherit',
};

const menuBaseStyle = {
  position: 'fixed',
  zIndex: 9999,
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 255, 0.98) 100%)',
  border: '1px solid rgba(102, 126, 234, 0.2)',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
  padding: '16px',
  width: 280,
  maxHeight: 360,
  overflow: 'auto',
  backdropFilter: 'blur(8px)',
};

// Dark mode styles
const darkMenuBaseStyle = {
  ...menuBaseStyle,
  background: 'linear-gradient(135deg, rgba(45, 55, 72, 0.98) 0%, rgba(26, 32, 44, 0.98) 100%)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)',
};

const searchStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '8px 12px',
  marginBottom: '8px',
  borderRadius: '8px',
  border: '1px solid rgba(102, 126, 234, 0.3)',
  background: 'rgba(255, 255, 255, 0.9)',
  color: '#495057'
};

// Dark mode styles
const darkSearchStyle = {
  ...searchStyle,
  border: '1px solid rgba(255, 255, 255, 0.3)',
  background: 'rgba(45, 55, 72, 0.9)',
  color: '#f7fafc'
};

const listItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '6px 8px',
  cursor: 'pointer',
  lineHeight: 1.6
};

const checkboxStyle = { width: 16, height: 16, pointerEvents: 'none' };

const SlidersIcon = ({ active }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--primary-color, #5b7cfa)' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="4" y1="6" x2="20" y2="6" />
    <circle cx="14" cy="6" r="2" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <circle cx="8" cy="12" r="2" />
    <line x1="4" y1="18" x2="20" y2="18" />
    <circle cx="12" cy="18" r="2" />
  </svg>
);

export default function TextFilterDropdown({
  id,
  options = [],
  values = [],
  onChange,
  placeholder = 'Search...'
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
    };
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onDocClick = (e) => {
      const insideTrigger = containerRef.current && containerRef.current.contains(e.target);
      const insideMenu = menuRef.current && menuRef.current.contains(e.target);
      if (!insideTrigger && !insideMenu) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const updateMenuPos = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const width = Math.max(rect.width, 280);
    const padding = 12;

    // Default: align below, left-aligned with trigger
    let left = rect.left;
    let top = rect.bottom + 6; // small gap below trigger

    // If overflowing on the right, shift left to fit within viewport
    if (left + width + padding > viewportWidth) {
      left = Math.max(padding, viewportWidth - width - padding);
    }
    // Ensure not beyond left edge
    if (left < padding) left = padding;

    // Estimate available height below; if not enough, open above trigger
    const estimatedHeight = Math.min(360, viewportHeight - top - padding);
    if (top + estimatedHeight + padding > viewportHeight) {
      const aboveTop = rect.top - Math.min(360, rect.top - padding) - 6;
      top = Math.max(padding, aboveTop);
    }

    setMenuPos({ top, left, width });
  };

  useEffect(() => {
    if (!open) return;
    updateMenuPos();
    const onScroll = () => updateMenuPos();
    const onResize = () => updateMenuPos();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options.filter(Boolean);
    return (options || []).filter((opt) => (opt || '').toLowerCase().includes(q));
  }, [options, query]);

  const allSelected = values && options && values.length > 0 && values.length === options.length;

  const toggleValue = (val) => {
    const set = new Set(values || []);
    if (set.has(val)) set.delete(val); else set.add(val);
    onChange(Array.from(set));
  };

  const handleSelectAll = () => {
    if (allSelected) onChange([]);
    else onChange(options.filter(Boolean));
  };

  const active = (values || []).length > 0;

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div
        id={id}
        role="button"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen((o) => !o); }}
        style={iconButtonStyle}
        aria-label="Open text filter"
        title={active ? `${values[0]}${values.length > 1 ? ` +${values.length - 1}` : ''}` : 'Filter'}
      >
        <SlidersIcon active={active} />
      </div>
      {open && createPortal((
        <div
          ref={menuRef}
          style={{ ...(isDarkMode ? darkMenuBaseStyle : menuBaseStyle), top: menuPos.top, left: menuPos.left, width: menuPos.width }}
        >
          <input 
            style={isDarkMode ? darkSearchStyle : searchStyle} 
            type="text" 
            placeholder={placeholder} 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
          />
          <div style={{ ...listItemStyle, fontWeight: 600, color: isDarkMode ? '#f7fafc' : 'inherit' }} onClick={handleSelectAll}>
            <input type="checkbox" style={checkboxStyle} checked={allSelected} readOnly />
            Select All
          </div>
          {filtered.map((opt) => (
            <div key={opt} style={{ ...listItemStyle, color: isDarkMode ? '#f7fafc' : 'inherit' }} onClick={() => toggleValue(opt)}>
              <input type="checkbox" style={checkboxStyle} checked={(values || []).includes(opt)} readOnly />
              <span>{opt}</span>
            </div>
          ))}
        </div>
      ), document.body)}
    </div>
  );
}


