import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  Heart, 
  DollarSign, 
  Home, 
  Car, 
  Users, 
  Briefcase, 
  Brain,
  PawPrint,
  Plus,
  ChevronRight,
  Calendar,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useDataStore } from '../stores/dataStore';
import type { DomainType } from '../types';
import { EXAMPLE_DOMAIN_ITEMS } from '../constants/exampleContent';

const domainConfig: Record<DomainType, { icon: any; label: string; color: string; bg: string; description: string }> = {
  health: { 
    icon: Heart, 
    label: 'Health', 
    color: 'text-red-500', 
    bg: 'bg-red-50',
    description: 'Track appointments, medications, and wellness checkups' 
  },
  finance: { 
    icon: DollarSign, 
    label: 'Finances', 
    color: 'text-green-500', 
    bg: 'bg-green-50',
    description: 'Manage bills, budgets, and financial goals' 
  },
  home: { 
    icon: Home, 
    label: 'Home', 
    color: 'text-orange-500', 
    bg: 'bg-orange-50',
    description: 'Home maintenance and improvement tasks' 
  },
  auto: { 
    icon: Car, 
    label: 'Auto', 
    color: 'text-blue-500', 
    bg: 'bg-blue-50',
    description: 'Vehicle registration, insurance, and maintenance' 
  },
  relationships: { 
    icon: Users, 
    label: 'Relationships', 
    color: 'text-pink-500', 
    bg: 'bg-pink-50',
    description: 'Birthdays, anniversaries, and check-ins' 
  },
  career: { 
    icon: Briefcase, 
    label: 'Career', 
    color: 'text-indigo-500', 
    bg: 'bg-indigo-50',
    description: 'Reviews, goals, and professional development' 
  },
  wellness: { 
    icon: Brain, 
    label: 'Wellness', 
    color: 'text-teal-500', 
    bg: 'bg-teal-50',
    description: 'Mental health, self-care, and mindfulness' 
  },
  pets: { 
    icon: PawPrint, 
    label: 'Pets', 
    color: 'text-amber-500', 
    bg: 'bg-amber-50',
    description: 'Pet care, vet visits, and supplies' 
  },
};

const Domains = () => {
  const { domainType } = useParams<{ domainType?: string }>();
  const { domains, addDomainItem } = useDataStore();

  if (domainType && domainConfig[domainType as DomainType]) {
    return <DomainDetail domainType={domainType as DomainType} />;
  }

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-midnight mb-1">Life Domains</h1>
        <p className="text-midnight-300">
          Organize and track all areas of your life
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.entries(domainConfig) as [DomainType, typeof domainConfig[DomainType]][]).map(([type, config], index) => {
          const domain = domains.find((d) => d.type === type);
          const itemCount = domain?.items?.length || 0;

          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/app/domains/${type}`}
                className="card-interactive block h-full"
              >
                <div className={`w-12 h-12 rounded-2xl ${config.bg} flex items-center justify-center mb-4`}>
                  <config.icon className={`w-6 h-6 ${config.color}`} />
                </div>
                <h3 className="font-semibold text-midnight mb-1">{config.label}</h3>
                <p className="text-sm text-midnight-300 mb-4">{config.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-midnight-400">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </span>
                  <ChevronRight className="w-5 h-5 text-midnight-300" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Domain Detail View
const DomainDetail = ({ domainType }: { domainType: DomainType }) => {
  const config = domainConfig[domainType];
  const { domains, addDomainItem, deleteDomainItem } = useDataStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemType, setNewItemType] = useState('');

  const domain = domains.find((d) => d.type === domainType);
  const items = domain?.items || [];

  const getItemTypes = () => {
    switch (domainType) {
      case 'health': return ['appointment', 'medication', 'checkup', 'vital'];
      case 'finance': return ['bill', 'subscription', 'budget', 'savings'];
      case 'home': return ['maintenance', 'repair', 'project', 'cleaning'];
      case 'auto': return ['maintenance', 'registration', 'insurance', 'inspection'];
      case 'relationships': return ['birthday', 'anniversary', 'check-in', 'event'];
      case 'career': return ['review', 'goal', 'learning', 'networking'];
      case 'wellness': return ['therapy', 'self-care', 'meditation', 'exercise'];
      case 'pets': return ['vet', 'grooming', 'supplies', 'medication'];
      default: return ['item'];
    }
  };

  const handleAddItem = () => {
    if (!newItemTitle.trim()) return;
    addDomainItem(domainType, {
      type: newItemType || getItemTypes()[0],
      title: newItemTitle,
    });
    setNewItemTitle('');
    setNewItemType('');
    setShowAddModal(false);
  };

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/app/domains"
          className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-midnight rotate-180" />
        </Link>
        <div className={`w-12 h-12 rounded-2xl ${config.bg} flex items-center justify-center`}>
          <config.icon className={`w-6 h-6 ${config.color}`} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-midnight">{config.label}</h1>
          <p className="text-midnight-300">{items.length} items tracked</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <Plus className="w-5 h-5 mr-2" />
          Add
        </button>
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Header badge */}
          <div className={`flex items-center gap-2 px-4 py-2 ${config.bg} rounded-xl ${config.color} text-sm`}>
            <Sparkles className="w-4 h-4" />
            <span>Here's what your {config.label.toLowerCase()} items could look like:</span>
          </div>

          {/* Example items */}
          <div className="space-y-3 opacity-75 pointer-events-none">
            {(EXAMPLE_DOMAIN_ITEMS[domainType] || []).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card p-4 flex items-center gap-4"
              >
                <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                  <config.icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-midnight">{item.title}</h4>
                  <p className="text-sm text-midnight-300 capitalize">{item.type}</p>
                  {item.description && (
                    <p className="text-xs text-midnight-400 mt-0.5">{item.description}</p>
                  )}
                </div>
                {item.date && (
                  <div className="flex items-center gap-1 text-sm text-midnight-400">
                    <Calendar className="w-4 h-4" />
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                )}
                <div className="p-2 rounded-lg text-midnight-200">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center pt-2">
            <button onClick={() => setShowAddModal(true)} className="btn-primary">
              <Plus className="w-5 h-5 mr-2" />
              Add Your First {config.label} Item
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card p-4 flex items-center gap-4"
            >
              <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                <config.icon className={`w-5 h-5 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-midnight">{item.title}</h4>
                <p className="text-sm text-midnight-300 capitalize">{item.type}</p>
              </div>
              {item.date && (
                <div className="flex items-center gap-1 text-sm text-midnight-400">
                  <Calendar className="w-4 h-4" />
                  {new Date(item.date).toLocaleDateString()}
                </div>
              )}
              <button
                onClick={() => deleteDomainItem(domainType, item.id)}
                className="p-2 rounded-lg hover:bg-red-50 text-midnight-400 hover:text-red-500 transition-colors"
              >
                <AlertCircle className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 bg-midnight/30 backdrop-blur-sm z-50" onClick={() => setShowAddModal(false)} />
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 left-0 right-0 lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2
                       bg-white rounded-t-3xl lg:rounded-3xl shadow-2xl z-50 p-6 lg:w-full lg:max-w-md"
          >
            <h2 className="text-xl font-semibold text-midnight mb-6">Add to {config.label}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">Title</label>
                <input
                  type="text"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  placeholder={`Enter ${config.label.toLowerCase()} item...`}
                  className="input-field"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">Type</label>
                <div className="flex flex-wrap gap-2">
                  {getItemTypes().map((type) => (
                    <button
                      key={type}
                      onClick={() => setNewItemType(type)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all
                        ${newItemType === type 
                          ? `${config.bg} ${config.color}` 
                          : 'bg-slate-100 text-midnight-400 hover:bg-slate-200'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button onClick={handleAddItem} className="btn-primary flex-1">
                Add Item
              </button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Domains;
