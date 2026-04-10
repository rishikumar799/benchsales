import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function ThemeToggle({ theme, toggleTheme }: ThemeToggleProps) {
  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl glass hover:bg-app-surface transition-all group"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-app-muted group-hover:text-brand-violet transition-colors" />
      ) : (
        <Sun className="w-5 h-5 text-app-muted group-hover:text-yellow-400 transition-colors" />
      )}
    </button>
  );
}
