import React, { useState, useRef, FormEvent } from 'react';
import { Button, OGDialog, OGDialogTemplate } from '~/components';
import { FormProvider, useForm } from 'react-hook-form';
import PlayerForm from '~/components/Player/PlayerForm';
import { useLocalize } from '~/hooks';
import { usePlayerMutation } from '~/data-provider';

type HeaderProps = {
  onSearchPlayer: (name: string) => void;
};

export default function Header({ onSearchPlayer }: HeaderProps) {
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const localize = useLocalize();
  const mutation = usePlayerMutation();
  const methods = useForm();

  // 🔍 Handle search submit
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearchPlayer(query); // send query back to Root
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md px-6 py-4 shadow-md dark:border-gray-700 dark:bg-gray-900/80">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/logo1.png"
              alt="Logo"
              className="h-14 w-14 rounded-xl shadow-md object-contain transition-transform hover:scale-105"
            />
            <span className="text-2xl font-extrabold tracking-wide text-gray-900 dark:text-white">
              Rate&nbsp;My&nbsp;Players
            </span>
          </div>

          {/* Center: Search Bar */}
          <form onSubmit={handleSubmit} className="flex flex-1 justify-center px-6">
            <div className="relative w-full max-w-lg group">
              <input
                type="text"
                placeholder="Search players..."
                className="w-full rounded-full border border-gray-400 bg-white/90 px-5 py-3 pl-10 text-base text-gray-900 shadow-sm outline-none transition-all duration-300
                           focus:border-black focus:ring-2 focus:ring-black
                           dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-white"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              {/* Search Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>

              {/* Search Button */}
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-black bg-white px-5 py-2 text-sm font-semibold text-black shadow-sm 
                           transition-all duration-300 hover:bg-black hover:text-white 
                           active:scale-95 disabled:opacity-50
                           dark:border-white dark:bg-black dark:text-white 
                           dark:hover:bg-white dark:hover:text-black"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right: Buttons */}
          <div className="flex items-center gap-4">
            {/* Create Player button */}
            <Button
              onClick={() => setIsModalOpen(true)}
              className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-md transition-transform duration-300 hover:scale-105"
            >
              + Create Player
            </Button>

            {/* About Us button */}
            <button
              className="rounded-full border border-black px-5 py-2 text-sm font-medium text-black 
                         transition-all duration-300 hover:bg-black hover:text-white 
                         active:scale-95 dark:border-white dark:text-white 
                         dark:hover:bg-white dark:hover:text-black"
              onClick={() => alert('About Us page coming soon!')}
            >
              About Us
            </button>
          </div>
        </div>
      </header>

      {/* Space below header */}
      <div className="mt-6" />

      {/* ⚽ Player Creation Modal */}
      <OGDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <FormProvider {...methods}>
          <OGDialogTemplate
            title="Create Player"
            showCloseButton={true}
            className="w-6/12 md:max-w-xl"
            main={
              <PlayerForm
                setOpen={setIsModalOpen}
                mutation={mutation}
                formRef={formRef}
              />
            }
            buttons={
              <Button className="text-white bg-blue-600 hover:bg-blue-700 transition-all">
                {localize('com_ui_save')}
              </Button>
            }
          />
        </FormProvider>
      </OGDialog>
    </>
  );
}
