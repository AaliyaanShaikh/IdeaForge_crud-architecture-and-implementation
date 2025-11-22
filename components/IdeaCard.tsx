import React from 'react';
import { Idea } from '../types';
import { PencilIcon, TrashIcon } from './Icons';

interface IdeaCardProps {
  idea: Idea;
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onEdit, onDelete }) => {
  return (
    <div className="group relative bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col overflow-hidden">
      <div className="p-6 flex-grow">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-900 leading-tight line-clamp-1" title={idea.title}>
            {idea.title}
          </h3>
        </div>
        
        <p className="text-slate-600 text-sm mb-5 line-clamp-3 leading-relaxed">
          {idea.description || <span className="italic text-slate-400">No description provided.</span>}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-auto">
          {idea.tags.map((tag, index) => (
            <span 
              key={index} 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span>{new Date(idea.updatedAt).toLocaleDateString()}</span>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <button 
            onClick={() => onEdit(idea)}
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            title="Edit"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(idea.id)}
            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Delete"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;
