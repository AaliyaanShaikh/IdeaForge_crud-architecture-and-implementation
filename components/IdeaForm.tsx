import React, { useState, useEffect } from 'react';
import { Idea, IdeaFormData } from '../types';
import { SparklesIcon, XMarkIcon } from './Icons';
import { enhanceIdeaWithAI } from '../services/geminiService';

interface IdeaFormProps {
  initialData?: Idea;
  onSubmit: (data: IdeaFormData) => void;
  onCancel: () => void;
}

const IdeaForm: React.FC<IdeaFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [tags, setTags] = useState<string>(initialData?.tags.join(', ') || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!title.trim()) {
      setError("Please enter a title first to generate content.");
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await enhanceIdeaWithAI(title);
      setDescription(result.description);
      setTags(result.tags.join(', '));
    } catch (err) {
      setError("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    
    const tagArray = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    
    onSubmit({
      title,
      description,
      tags: tagArray
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Edit' : 'New'}
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
            <XMarkIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              placeholder="e.g., Sustainable Coffee Shop"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !title.trim()}
                className="flex items-center space-x-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <span>Generating...</span>
                ) : (
                  <>
                    <SparklesIcon className="w-3 h-3" />
                    <span>Auto-Fill with AI</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
              placeholder="Describe your idea..."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tags" className="block text-sm font-medium text-slate-700">Tags (comma separated)</label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              placeholder="business, green, local"
            />
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm shadow-indigo-200 transition-all transform active:scale-95"
          >
            {initialData ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaForm;
