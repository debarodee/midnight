import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Target, 
  Layers, 
  MessageCircle, 
  BookOpen, 
  Settings,
  Plus,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import QuickAdd from '../components/common/QuickAdd';
import Logo from '../components/common/Logo';

const navItems = [
  { path: '/app', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/app/goals', icon: Target, label: 'Goals' },
  { path: '/app/domains', icon: Layers, label: 'Life Domains' },
  { path: '/app/assistant', icon: MessageCircle, label: 'Assistant' },
  { path: '/app/journal', icon: BookOpen, label: 'Journal' },
  { path: '/app/settings', icon: Settings, label: 'Settings' },
];

const Layout = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const { signOut, user } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-obsidian-50 dark:bg-obsidian-800 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-obsidian-700 border-r border-obsidian-100 dark:border-obsidian-600 fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-obsidian-100 dark:border-obsidian-600">
          <Logo size="md" showText />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item-active' : ''}`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-obsidian-100 dark:border-obsidian-600">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan to-lavender flex items-center justify-center text-white font-medium">
              {user?.displayName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-obsidian dark:text-white truncate">{user?.displayName || 'User'}</p>
              <p className="text-xs text-obsidian-400 dark:text-obsidian-300 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-obsidian-400 dark:text-obsidian-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-obsidian-800/80 backdrop-blur-xl border-b border-obsidian-100 dark:border-obsidian-600">
        <div className="safe-top">
          <div className="flex items-center justify-between px-4 py-3">
            <Logo size="sm" />
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-obsidian-100 dark:hover:bg-obsidian-600 transition-colors"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)}
              className="lg:hidden fixed inset-0 bg-obsidian/20 dark:bg-obsidian/40 backdrop-blur-sm z-40"
              style={{ top: 'calc(56px + env(safe-area-inset-top, 0px))' }}
            />
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden fixed left-0 right-0 bg-white dark:bg-obsidian-700 border-b border-obsidian-100 dark:border-obsidian-600 z-50 p-4 space-y-1"
              style={{ top: 'calc(56px + env(safe-area-inset-top, 0px))' }}
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={() => setMobileNavOpen(false)}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? 'nav-item-active' : ''}`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
              <button
                onClick={handleSignOut}
                className="w-full nav-item text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* pt-[calc(56px+env(safe-area-inset-top))] for dynamic safe area on mobile */}
        <div className="pt-[calc(56px+env(safe-area-inset-top,0px))] lg:pt-0 pb-[calc(80px+env(safe-area-inset-bottom,0px))] lg:pb-8">
          <Outlet />
        </div>
      </main>

      {/* Floating Action Button - positioned above bottom nav with safe area */}
      <button
        onClick={() => setQuickAddOpen(true)}
        className="lg:hidden fixed z-30 w-14 h-14 rounded-full
                   bg-cyan
                   flex items-center justify-center shadow-glow
                   hover:scale-110 active:scale-95 transition-transform duration-200
                   right-4"
        style={{ bottom: 'calc(80px + env(safe-area-inset-bottom, 0px) + 12px)' }}
      >
        <Plus className="w-6 h-6 text-obsidian" />
      </button>
      
      {/* Desktop Floating Action Button */}
      <button
        onClick={() => setQuickAddOpen(true)}
        className="hidden lg:flex floating-action z-30"
      >
        <Plus className="w-6 h-6 text-obsidian" />
      </button>

      {/* Quick Add Modal */}
      <QuickAdd isOpen={quickAddOpen} onClose={() => setQuickAddOpen(false)} />

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-obsidian-800/95 backdrop-blur-xl border-t border-obsidian-100 dark:border-obsidian-600 z-30">
        <div className="flex items-center justify-around px-2 pt-2 pb-2 safe-bottom">
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${
                  isActive ? 'text-obsidian dark:text-white' : 'text-obsidian-300 dark:text-obsidian-400'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label.split(' ')[0]}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
