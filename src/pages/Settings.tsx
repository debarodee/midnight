import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  Shield,
  Download,
  Trash2,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Clock,
  Calendar,
  Heart,
  Car,
  Wallet,
  Home,
  Briefcase,
  Users,
  Brain,
  PawPrint,
  Check,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useDataStore } from '../stores/dataStore';

const Settings = () => {
  const { user, settings, updateSettings, signOut } = useAuthStore();
  const { goals, tasks, reminders, journal, habits } = useDataStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleExportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      user: { name: user?.displayName, email: user?.email },
      settings,
      goals,
      tasks,
      reminders,
      journalEntries: journal,
      habits,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `midnight-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const domainOptions = [
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'home', label: 'Home', icon: Home },
    { id: 'auto', label: 'Auto', icon: Car },
    { id: 'relationships', label: 'Relationships', icon: Users },
    { id: 'career', label: 'Career', icon: Briefcase },
    { id: 'wellness', label: 'Wellness', icon: Brain },
    { id: 'pets', label: 'Pets', icon: PawPrint },
  ];

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-6 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-midnight to-midnight-600 flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-midnight">Settings</h1>
              <p className="text-sm text-midnight-300">Customize your experience</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 lg:px-6 space-y-6">
        {/* Profile Section */}
        <SettingsSection title="Profile" icon={User}>
          <div className="flex items-center gap-4 p-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet to-champagne flex items-center justify-center text-white text-2xl font-bold">
              {user?.displayName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-midnight">{user?.displayName || 'Demo User'}</h3>
              <p className="text-sm text-midnight-300">{user?.email || 'demo@midnight.app'}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-midnight-300" />
          </div>
        </SettingsSection>

        {/* Appearance */}
        <SettingsSection title="Appearance" icon={Palette}>
          <SettingsRow
            label="Theme"
            description="Choose your preferred theme"
            action={
              <div className="flex gap-2">
                {(['light', 'dark', 'system'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => updateSettings({ theme })}
                    className={`p-2 rounded-lg transition-colors ${
                      settings?.theme === theme
                        ? 'bg-violet text-white'
                        : 'bg-slate-100 text-midnight-400 hover:bg-slate-200'
                    }`}
                  >
                    {theme === 'light' && <Sun className="w-5 h-5" />}
                    {theme === 'dark' && <Moon className="w-5 h-5" />}
                    {theme === 'system' && <Smartphone className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            }
          />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notifications" icon={Bell}>
          <SettingsToggle
            label="Push Notifications"
            description="Receive reminders and updates"
            enabled={typeof settings?.notifications === 'object' ? (settings?.notifications?.push ?? true) : (settings?.notifications ?? true)}
            onChange={(enabled) => {
              const current = typeof settings?.notifications === 'object' ? settings.notifications : {};
              updateSettings({ 
                notifications: { ...current, push: enabled } 
              });
            }}
          />
          <SettingsToggle
            label="Email Digest"
            description="Weekly summary of your progress"
            enabled={typeof settings?.notifications === 'object' ? (settings?.notifications?.email ?? false) : false}
            onChange={(enabled) => {
              const current = typeof settings?.notifications === 'object' ? settings.notifications : {};
              updateSettings({ 
                notifications: { ...current, email: enabled } 
              });
            }}
          />
          <SettingsRow
            label="Quiet Hours"
            description="No notifications during this time"
            action={
              <div className="flex items-center gap-2 text-sm text-midnight">
                <Clock className="w-4 h-4 text-midnight-300" />
                <span>10 PM - 7 AM</span>
              </div>
            }
          />
        </SettingsSection>

        {/* Life Domains */}
        <SettingsSection title="Life Domains" icon={Calendar}>
          <div className="p-4">
            <p className="text-sm text-midnight-400 mb-4">
              Choose which life areas to track
            </p>
            <div className="grid grid-cols-2 gap-2">
              {domainOptions.map((domain) => {
                const Icon = domain.icon;
                const isEnabled = settings?.enabledDomains?.includes(domain.id) ?? true;
                
                return (
                  <button
                    key={domain.id}
                    onClick={() => {
                      const current = settings?.enabledDomains || domainOptions.map((d: { id: string }) => d.id);
                      const updated = isEnabled
                        ? current.filter((d: string) => d !== domain.id)
                        : [...current, domain.id];
                      updateSettings({ enabledDomains: updated });
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                      isEnabled
                        ? 'border-violet bg-violet/5'
                        : 'border-slate-200 opacity-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isEnabled ? 'text-violet' : 'text-midnight-300'}`} />
                    <span className={`text-sm font-medium ${isEnabled ? 'text-midnight' : 'text-midnight-400'}`}>
                      {domain.label}
                    </span>
                    {isEnabled && <Check className="w-4 h-4 text-violet ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>
        </SettingsSection>

        {/* Data & Privacy */}
        <SettingsSection title="Data & Privacy" icon={Shield}>
          <button
            onClick={handleExportData}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-midnight-400" />
              <div className="text-left">
                <p className="font-medium text-midnight">Export Data</p>
                <p className="text-sm text-midnight-300">Download all your data</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-midnight-300" />
          </button>
          
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-red-500" />
              <div className="text-left">
                <p className="font-medium text-red-500">Delete All Data</p>
                <p className="text-sm text-midnight-300">Permanently remove everything</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-midnight-300" />
          </button>
        </SettingsSection>

        {/* About */}
        <SettingsSection title="About" icon={Heart}>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-midnight-400">Version</span>
              <span className="text-midnight font-medium">1.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-midnight-400">Build</span>
              <span className="text-midnight font-medium">2024.12.31</span>
            </div>
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <a 
                href="#" 
                className="flex items-center justify-between p-2 -mx-2 rounded-lg hover:bg-slate-50"
              >
                <span className="text-midnight">Privacy Policy</span>
                <ExternalLink className="w-4 h-4 text-midnight-300" />
              </a>
              <a 
                href="#" 
                className="flex items-center justify-between p-2 -mx-2 rounded-lg hover:bg-slate-50"
              >
                <span className="text-midnight">Terms of Service</span>
                <ExternalLink className="w-4 h-4 text-midnight-300" />
              </a>
            </div>
          </div>
        </SettingsSection>

        {/* Sign Out */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={signOut}
          className="w-full card p-4 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </motion.button>

        {/* Footer */}
        <div className="text-center pt-4">
          <p className="text-sm text-midnight-300">
            Made with ❤️ for your best year yet
          </p>
          <p className="text-xs text-midnight-200 mt-1">
            © 2024 Midnight. All rights reserved.
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-midnight text-center mb-2">
              Delete All Data?
            </h3>
            <p className="text-midnight-400 text-center mb-6">
              This will permanently delete all your goals, tasks, reminders, and journal entries. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-slate-100 font-medium hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Clear all data
                  localStorage.clear();
                  window.location.reload();
                }}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

// Settings Section Component
const SettingsSection = ({ 
  title, 
  icon: Icon, 
  children 
}: { 
  title: string; 
  icon: React.ElementType; 
  children: React.ReactNode;
}) => (
  <div className="card overflow-hidden">
    <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
      <Icon className="w-4 h-4 text-midnight-400" />
      <h2 className="text-sm font-semibold text-midnight-400 uppercase tracking-wide">
        {title}
      </h2>
    </div>
    <div className="divide-y divide-slate-100">
      {children}
    </div>
  </div>
);

// Settings Row Component
const SettingsRow = ({
  label,
  description,
  action,
}: {
  label: string;
  description?: string;
  action: React.ReactNode;
}) => (
  <div className="flex items-center justify-between p-4">
    <div>
      <p className="font-medium text-midnight">{label}</p>
      {description && <p className="text-sm text-midnight-300">{description}</p>}
    </div>
    {action}
  </div>
);

// Settings Toggle Component
const SettingsToggle = ({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) => (
  <div className="flex items-center justify-between p-4">
    <div>
      <p className="font-medium text-midnight">{label}</p>
      {description && <p className="text-sm text-midnight-300">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-7 rounded-full transition-colors ${
        enabled ? 'bg-violet' : 'bg-slate-200'
      }`}
    >
      <motion.div
        animate={{ x: enabled ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
      />
    </button>
  </div>
);

export default Settings;
