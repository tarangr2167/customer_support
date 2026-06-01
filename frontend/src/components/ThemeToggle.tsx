import { useTheme } from '../context/ThemeContext';
import type { ThemePreference } from '../lib/theme';

const OPTIONS: { value: ThemePreference; label: string; title: string }[] = [
  { value: 'light', label: 'Light', title: 'Light theme' },
  { value: 'dark', label: 'Dark', title: 'Dark theme' },
  { value: 'system', label: 'System', title: 'Use system theme' },
];

function IconSun() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function IconSystem() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

const ICONS = { light: IconSun, dark: IconMoon, system: IconSystem };

interface ThemeToggleProps {
  className?: string;
  compact?: boolean;
}

export function ThemeToggle({ className = '', compact = false }: ThemeToggleProps) {
  const { preference, setPreference } = useTheme();

  return (
    <div
      className={`theme-toggle ${compact ? 'theme-toggle--compact' : ''} ${className}`.trim()}
      role="group"
      aria-label="Color theme"
    >
      {OPTIONS.map(({ value, label, title }) => {
        const Icon = ICONS[value];
        return (
          <button
            key={value}
            type="button"
            className={`theme-toggle__btn ${preference === value ? 'theme-toggle__btn--active' : ''}`}
            onClick={() => setPreference(value)}
            title={title}
            aria-pressed={preference === value}
          >
            <Icon />
            {!compact && <span>{label}</span>}
          </button>
        );
      })}
    </div>
  );
}
