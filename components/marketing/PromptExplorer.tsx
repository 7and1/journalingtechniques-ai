'use client';

import { useMemo, useState } from 'react';
import type {
  PromptCategory,
  PromptSortOption,
  PromptDifficulty,
} from '@/lib/prompts';
import { filterAndSortPrompts, getAllTechniques } from '@/lib/prompts';
import { PromptCard } from './PromptCard';

interface PromptExplorerProps {
  categories: PromptCategory[];
}

export function PromptExplorer({ categories }: PromptExplorerProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeDifficulty, setActiveDifficulty] = useState<
    PromptDifficulty | 'all'
  >('all');
  const [activeTechnique, setActiveTechnique] = useState<string>('all');
  const [sortBy, setSortBy] = useState<PromptSortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const allTechniques = useMemo(() => getAllTechniques(), []);

  const filteredPrompts = useMemo(() => {
    return filterAndSortPrompts({
      category: activeCategory === 'all' ? undefined : activeCategory,
      difficulty: activeDifficulty === 'all' ? undefined : activeDifficulty,
      technique: activeTechnique === 'all' ? undefined : activeTechnique,
      query: query || undefined,
      sortBy,
    });
  }, [query, activeCategory, activeDifficulty, activeTechnique, sortBy]);

  const hasActiveFilters =
    activeCategory !== 'all' ||
    activeDifficulty !== 'all' ||
    activeTechnique !== 'all';

  const resetFilters = () => {
    setActiveCategory('all');
    setActiveDifficulty('all');
    setActiveTechnique('all');
    setQuery('');
    setSortBy('newest');
  };

  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <label className="relative block">
            <span className="sr-only">Search prompts</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search prompts (anxiety, gratitude, CBT...)"
              className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3 text-base text-slate-800 shadow-sm outline-none ring-brand focus:border-brand focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-500"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-4 text-sm text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              >
                Clear
              </button>
            ) : null}
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                showFilters || hasActiveFilters
                  ? 'border-brand bg-brand/10 text-brand'
                  : 'border-slate-300 text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600'
              }`}
            >
              {showFilters ? 'Hide' : 'Show'} Filters{' '}
              {hasActiveFilters
                ? `(${[activeCategory !== 'all', activeDifficulty !== 'all', activeTechnique !== 'all'].filter(Boolean).length})`
                : ''}
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as PromptSortOption)}
              className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none hover:border-slate-400 focus:border-brand focus:ring-2 focus:ring-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600"
            >
              <option value="newest">Newest first</option>
              <option value="alphabetical">A to Z</option>
              <option value="difficulty">By difficulty</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/40">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  label="All"
                  active={activeCategory === 'all'}
                  onClick={() => setActiveCategory('all')}
                />
                {categories.map((category) => (
                  <FilterButton
                    key={category.slug}
                    label={category.name}
                    active={activeCategory === category.slug}
                    onClick={() => setActiveCategory(category.slug)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Difficulty
              </label>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  label="All levels"
                  active={activeDifficulty === 'all'}
                  onClick={() => setActiveDifficulty('all')}
                />
                <FilterButton
                  label="Easy"
                  active={activeDifficulty === 'easy'}
                  onClick={() => setActiveDifficulty('easy')}
                />
                <FilterButton
                  label="Moderate"
                  active={activeDifficulty === 'moderate'}
                  onClick={() => setActiveDifficulty('moderate')}
                />
                <FilterButton
                  label="Advanced"
                  active={activeDifficulty === 'advanced'}
                  onClick={() => setActiveDifficulty('advanced')}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Technique
              </label>
              <select
                value={activeTechnique}
                onChange={(e) => setActiveTechnique(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none hover:border-slate-400 focus:border-brand focus:ring-2 focus:ring-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600"
              >
                <option value="all">All techniques</option>
                {allTechniques.map((technique) => (
                  <option key={technique} value={technique}>
                    {technique}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm font-semibold text-slate-500 underline-offset-4 hover:text-slate-700 hover:underline dark:text-slate-400 dark:hover:text-slate-200"
              >
                Reset all filters
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">
          Showing {filteredPrompts.length}{' '}
          {filteredPrompts.length === 1 ? 'prompt' : 'prompts'}
        </p>
      </div>

      {filteredPrompts.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            No prompts match your filters
          </p>
          <p className="mt-2">
            Try adjusting your search or filters to find more prompts.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 rounded-full border-2 border-brand px-6 py-2 font-semibold text-brand transition hover:bg-brand hover:text-white"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} variant="compact" />
          ))}
        </div>
      )}
    </section>
  );
}

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterButton({ label, active, onClick }: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
        active
          ? 'border-brand bg-brand/10 text-brand'
          : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900'
      }`}
    >
      {label}
    </button>
  );
}
