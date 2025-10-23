import React, { useRef, useState } from 'react';
import { Button, OGDialog, OGDialogTemplate } from '../ui';
import { FormProvider, useForm } from 'react-hook-form';
import PlayerForm from './PlayerForm';
import { useLocalize } from '~/hooks';
import { usePlayerMutation } from '~/data-provider';
export type Player = {
  first_name: string;
  last_name: string;
  position: string;
  team: string;
  weak_foot: number;
  skill_moves: number;
  preferred_foot: string;
  height: string;
  weight: string;
  alt_positions: string;
  pace: number;
  acceleration: number;
  sprint_speed: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physicality: number;
  traits: { name: string; description: string }[];
  photoUrl?: string; // 👈 new: optional player picture
};

const renderStars = (count: number) => {
  return [...Array(5)].map((_, i) => (
    <span key={i} className={`text-yellow-500 ${i + 1 > count ? 'opacity-30' : ''}`}>★</span>
  ));
};

const StatBar = ({ label, value }: { label: string; value: number }) => (
  <div className="mb-2">
    <div className="flex justify-between text-sm">
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <div className="w-full h-2 bg-gray-200 rounded">
      <div
        className="h-2 bg-blue-500 rounded"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const PlayerProfile = ({ player }: { player: Player }) => {
  const onCreate = () => { };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const localize = useLocalize();
  const mutation = usePlayerMutation();
  const methods = useForm();

  return (
    <div className="w-full max-w-25xl h-full mx-auto p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {player.first_name} {player.last_name} —  FC™ 25 Ratings - Player of the month
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left column: Photo */}
        <div className="flex justify-center">
          <img
            src={player.photoUrl || '/assets/KevinNgo.png'}
            alt={`${player.first_name} ${player.last_name}`}
            className="rounded-lg shadow-none border-none w-60 h-80 object-cover"
          />
        </div>

        {/* Middle column: Info */}
        <div>
          <div className="mb-4 text-lg font-semibold">Position: {player.position}</div>
          <div className="mb-4 text-lg font-semibold">Team: {player.team}</div>
          <div className="mb-2">Weak Foot: {renderStars(player.weak_foot)}</div>
          <div className="mb-2">Skill Moves: {renderStars(player.skill_moves)}</div>
          <div className="mb-1">Preferred Foot: {player.preferred_foot}</div>
          <div className="mb-1">Height: {player.height}</div>
          <div className="mb-1">Weight: {player.weight}</div>
          <div className="mb-1">Alt Positions: {player.alt_positions}</div>

          {/* Traits */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Traits</h3>
            <div className="space-y-2">
              {player.traits.map((trait, index) => (
                <div
                  key={index}
                  className="p-2 border rounded bg-gray-50"
                >
                  <h4 className="font-medium text-sm">{trait.name}</h4>
                  <p className="text-xs text-gray-700">{trait.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Stats */}
        <div>
          <StatBar label="Pace" value={player.pace} />
          <StatBar label="Acceleration" value={player.acceleration} />
          <StatBar label="Sprint Speed" value={player.sprint_speed} />
          <StatBar label="Shooting" value={player.shooting} />
          <StatBar label="Passing" value={player.passing} />
          <StatBar label="Dribbling" value={player.dribbling} />
          <StatBar label="Defending" value={player.defending} />
          <StatBar label="Physicality" value={player.physicality} />
        </div>

              {/* Bottom: Recent Matches table (Black & White theme) */}
<div className="col-span-3 mt-8">
  <div className="overflow-hidden rounded-xl border border-black/40 dark:border-white/30 bg-white dark:bg-gray-900 shadow-[0_0_15px_rgba(0,0,0,0.1)]">
    <div className="p-5">
      <h3 className="mb-4 text-lg font-extrabold text-gray-900 dark:text-white tracking-wide">
        Recent Matches
      </h3>

      <table className="w-full border-collapse text-sm md:text-base">
        <thead>
          <tr className="bg-black text-white dark:bg-white dark:text-black">
            <th className="py-2 px-4 text-left rounded-tl-lg">Opponent</th>
            <th className="py-2 px-4 text-center">Result</th>
            <th className="py-2 px-4 text-center">Goals</th>
            <th className="py-2 px-4 text-center rounded-tr-lg">Assists</th>
          </tr>
        </thead>

        <tbody className="text-gray-800 dark:text-gray-100">
          <tr className="odd:bg-gray-100 even:bg-white dark:odd:bg-gray-800 dark:even:bg-gray-900 transition-colors">
            <td className="py-3 px-4 font-semibold">St-Laurent FC</td>
            <td className="text-center font-semibold text-green-600 dark:text-green-400">
              3 – 1 ✅
            </td>
            <td className="text-center">2</td>
            <td className="text-center">1</td>
          </tr>

          <tr className="odd:bg-gray-100 even:bg-white dark:odd:bg-gray-800 dark:even:bg-gray-900 transition-colors">
            <td className="py-3 px-4 font-semibold">Toronto FC</td>
            <td className="text-center font-semibold text-red-600 dark:text-red-400">
              1 – 2 ❌
            </td>
            <td className="text-center">1</td>
            <td className="text-center">0</td>
          </tr>

          <tr className="odd:bg-gray-100 even:bg-white dark:odd:bg-gray-800 dark:even:bg-gray-900 transition-colors">
            <td className="py-3 px-4 font-semibold">Montreal United</td>
            <td className="text-center font-semibold text-green-600 dark:text-green-400">
              2 – 0 ✅
            </td>
            <td className="text-center">1</td>
            <td className="text-center">0</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>


            


      </div>
    </div>
  );
};

export default PlayerProfile;
