import { useTheme } from '../../lib/providers/theme-provider';

// ... existing code ...

function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header>
      {/* ... existing header content ... */}
      <button onClick={toggleTheme} aria-label="Toggle light/dark mode">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </header>
  );
}

export default Header; 