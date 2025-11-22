import React, { useState, useEffect, useMemo } from 'react';
import { Idea, IdeaFormData } from './types';
import IdeaCard from './components/IdeaCard';
import IdeaForm from './components/IdeaForm';
import { PlusIcon, SearchIcon, SparklesIcon } from './components/Icons';

// Dummy initial data for first load
const INITIAL_IDEAS: Idea[] = [
  {
    id: '1',
    title: 'Smart Garden Monitor',
    description: 'An IoT device that monitors soil moisture and sunlight, automatically watering plants when needed and sending updates to a mobile app.',
    tags: ['IoT', 'Gardening', 'SmartHome'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    title: 'VR Fitness Game',
    description: 'A high-intensity rhythm game for VR headsets that tracks calories burned and competes with friends in real-time.',
    tags: ['VR', 'Fitness', 'Gaming'],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  }
];

type SortOption = 'newest' | 'oldest' | 'alphabetical';

const App: React.FC = () => {
  // State
  const [ideas, setIdeas] = useState<Idea[]>(() => {
    const saved = localStorage.getItem('ideaforge-data');
    return saved ? JSON.parse(saved) : INITIAL_IDEAS;
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | undefined>(undefined);

  // Effects
  useEffect(() => {
    localStorage.setItem('ideaforge-data', JSON.stringify(ideas));
  }, [ideas]);

  // CRUD Handlers
  const handleCreate = (data: IdeaFormData) => {
    const newIdea: Idea = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setIdeas(prev => [newIdea, ...prev]);
    setIsFormOpen(false);
  };

  const handleUpdate = (data: IdeaFormData) => {
    if (!editingIdea) return;
    
    setIdeas(prev => prev.map(idea => 
      idea.id === editingIdea.id 
        ? { ...idea, ...data, updatedAt: Date.now() }
        : idea
    ));
    setEditingIdea(undefined);
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this idea?")) {
      setIdeas(prev => prev.filter(idea => idea.id !== id));
    }
  };

  const openCreateModal = () => {
    setEditingIdea(undefined);
    setIsFormOpen(true);
  };

  const openEditModal = (idea: Idea) => {
    setEditingIdea(idea);
    setIsFormOpen(true);
  };

  // Derived State
  const filteredIdeas = useMemo(() => {
    const lowerTerm = searchTerm.toLowerCase();
    
    // Filter
    const filtered = ideas.filter(idea => 
      idea.title.toLowerCase().includes(lowerTerm) ||
      idea.description.toLowerCase().includes(lowerTerm) ||
      idea.tags.some(tag => tag.toLowerCase().includes(lowerTerm))
    );

    // Sort
    return filtered.sort((a, b) => {
      if (sortOption === 'newest') return b.updatedAt - a.updatedAt;
      if (sortOption === 'oldest') return a.updatedAt - b.updatedAt;
      if (sortOption === 'alphabetical') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [ideas, searchTerm, sortOption]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <SparklesIcon className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-600">
              IdeaForge
            </h1>
          </div>

          {/* Desktop Search & Controls */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl mx-8">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <SearchIcon className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search ideas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
              />
            </div>
            
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="block w-40 pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">A-Z</option>
            </select>
          </div>

          <button
            onClick={openCreateModal}
            className="hidden md:flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-md shadow-indigo-200 transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <PlusIcon className="w-5 h-5" />
            <span>New</span>
          </button>
        </div>
        
        {/* Mobile Controls */}
        <div className="md:hidden px-4 py-3 border-t border-slate-100 bg-slate-50 space-y-3">
           <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <SearchIcon className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
          <div className="flex justify-between items-center">
             <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Sort by:</span>
             <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="block w-1/2 pl-2 pr-6 py-1.5 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="alphabetical">A-Z</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">
             {searchTerm ? 'Search Results' : 'Your Ideas'}
             <span className="ml-2 text-sm font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{filteredIdeas.length}</span>
          </h2>
        </div>

        {filteredIdeas.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
              <SparklesIcon className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No ideas found</h3>
            <p className="text-slate-500 mt-1 max-w-xs">
              {searchTerm 
                ? `No results matching "${searchTerm}".` 
                : "Get started by creating your first big idea!"}
            </p>
            {!searchTerm && (
               <button
                onClick={openCreateModal}
                className="mt-4 text-indigo-600 font-medium hover:text-indigo-700"
               >
                 Create now &rarr;
               </button>
            )}
             {searchTerm && (
               <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-indigo-600 font-medium hover:text-indigo-700"
               >
                 Clear search
               </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map(idea => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={openCreateModal}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-300 flex items-center justify-center z-40 hover:bg-indigo-700 active:scale-90 transition-transform"
      >
        <PlusIcon className="w-8 h-8" />
      </button>

      {/* Modal */}
      {isFormOpen && (
        <IdeaForm
          initialData={editingIdea}
          onSubmit={editingIdea ? handleUpdate : handleCreate}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default App;