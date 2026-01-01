import { useThemeStore } from '../../stores/themeStore';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  /** Force a specific logo variant regardless of theme */
  variant?: 'light' | 'dark';
}

const sizeMap = {
  sm: { logo: 'w-8 h-8', text: 'text-base' },
  md: { logo: 'w-10 h-10', text: 'text-lg' },
  lg: { logo: 'w-14 h-14', text: 'text-xl' },
  xl: { logo: 'w-20 h-20', text: 'text-2xl' },
};

const Logo = ({ size = 'md', showText = false, className = '', variant }: LogoProps) => {
  const { resolvedTheme } = useThemeStore();
  
  // Determine which logo to use:
  // - If variant is forced, use that
  // - Otherwise, use dark logo on light backgrounds, light logo on dark backgrounds
  const logoVariant = variant ?? (resolvedTheme === 'dark' ? 'light' : 'dark');
  const logoSrc = logoVariant === 'light' ? '/logo-light.png' : '/logo-dark.png';
  
  const sizes = sizeMap[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src={logoSrc} 
        alt="M.E. Truth Logo" 
        className={`${sizes.logo} object-contain`}
      />
      {showText && (
        <div>
          <h1 className={`font-semibold text-obsidian dark:text-white ${sizes.text}`}>
            Momentous Year
          </h1>
          <p className="text-xs text-obsidian-400 dark:text-obsidian-300">
            The Science of Mindful Evolution
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;
