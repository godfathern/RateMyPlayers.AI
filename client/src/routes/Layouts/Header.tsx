import React, { useState, FormEvent } from 'react';
import { useSearchPlayer } from '~/hooks/Players/useSearchPlayer';

export default function Header() {
  const [query, setQuery] = useState('');
  const { searchPlayers, loading } = useSearchPlayer();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchPlayers(query);
    }
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white px-4 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-2">
          <img
            src="/assets/LogoKing.png"
            alt="Logo"
            className="h-10 w-10 rounded-md object-contain"
          />
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            Rate my players
          </span>
        </div>

        {/* Right: Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-md items-center gap-2 rounded border border-gray-300 bg-white px-3 py-1 shadow-sm dark:border-gray-600 dark:bg-gray-800"
        >
          <input
            type="text"
            placeholder="Search players..."
            className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none dark:text-white dark:placeholder-gray-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="text-sm text-blue-600 hover:underline dark:text-blue-400 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>
      </div>
    </header>
  );
}
