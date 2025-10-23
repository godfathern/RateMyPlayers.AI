import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import type { ContextType } from '~/common';
import {
  useAuthContext,
  useAssistantsMap,
  useAgentsMap,
  useFileMap,
  useSearchEnabled,
} from '~/hooks';
import {
  AgentsMapContext,
  AssistantsMapContext,
  FileMapContext,
  SetConvoProvider,
} from '~/Providers';
import { useUserTermsQuery, useGetStartupConfig } from '~/data-provider';
import { Nav, MobileNav } from '~/components/Nav';
import { useHealthCheck } from '~/data-provider';
import { Banner } from '~/components/Banners';
import PlayerProfile from '../components/Player/PlayerProfile';
import { useSearchPlayer } from '~/hooks/Players/useSearchPlayer';
import Header from './Layouts/Header';

export default function Root() {
  const [showTerms, setShowTerms] = useState(false);
  const [bannerHeight, setBannerHeight] = useState(0);
  const [navVisible, setNavVisible] = useState(() => {
    const savedNavVisible = localStorage.getItem('navVisible');
    return savedNavVisible !== null ? JSON.parse(savedNavVisible) : true;
  });
  const { results, loading, searchPlayers } = useSearchPlayer();

  const { isAuthenticated, logout } = useAuthContext();

  // Global health check - runs once per authenticated session
  useHealthCheck(isAuthenticated);

  const assistantsMap = useAssistantsMap({ isAuthenticated });
  const agentsMap = useAgentsMap({ isAuthenticated });
  const fileMap = useFileMap({ isAuthenticated });
  const [query, setQuery] = useState('');
  const { data: config } = useGetStartupConfig();
  const { data: termsData } = useUserTermsQuery({
    enabled: isAuthenticated && config?.interface?.termsOfService?.modalAcceptance === true,
  });

  useSearchEnabled(isAuthenticated);

  useEffect(() => {
    if (termsData) {
      setShowTerms(!termsData.termsAccepted);
    }
  }, [termsData]);

    const player1 = {
    first_name: 'Kevin',
    last_name: 'Ngo',
    position: 'ST',
    team: 'Stechco',
    weak_foot: 4,
    skill_moves: 5,
    preferred_foot: 'Left',
    height: "168 cm",
    weight: "68 kg",
    alt_positions: "ST, CF",
    pace: 93,
    acceleration: 87,
    sprint_speed: 83,
    shooting: 90,
    passing: 86,
    dribbling: 94,
    defending: 38,
    physicality: 65,
    traits: [
      { name: "Playmaker", description: "Great vision and passing ability." },
      { name: "Finesse Shot", description: "Scores curlers from outside the box." },
    ],
    photoUrl: "/assets/KevinNgo.png"
  };

   const player2 = {
    first_name: 'Harry',
    last_name: 'King',
    position: 'LW',
    team: 'SFC',
    weak_foot: 4,
    skill_moves: 5,
    preferred_foot: 'Left',
    height: "171 cm",
    weight: "68 kg",
    alt_positions: "ST, CF",
    pace: 92,
    acceleration: 88,
    sprint_speed: 83,
    shooting: 90,
    passing: 86,
    dribbling: 94,
    defending: 38,
    physicality: 65,
    traits: [
      { name: "First touch", description: "Best first touch in town." },
      { name: "Power shot", description: "Shoot like hulk" },
    ],
    photoUrl: "/assets/HarryKing.png"
  };

     const player3 = {
    first_name: 'Jean',
    last_name: 'Francois',
    position: 'LW',
    team: 'OttawaFc',
    weak_foot: 4,
    skill_moves: 5,
    preferred_foot: 'Left',
    height: "171 cm",
    weight: "68 kg",
    alt_positions: "ST, CF",
    pace: 92,
    acceleration: 88,
    sprint_speed: 83,
    shooting: 90,
    passing: 86,
    dribbling: 94,
    defending: 38,
    physicality: 65,
    traits: [
      { name: "Dribbler King", description: "Best first touch in town." },
      { name: "Power shot", description: "Shoot like shehulk" },
    ],
    photoUrl: "/assets/JeanFrancois.png"
  };

  const players = {
    kevin: player1,
    harry: player2,
    jean: player3,
  };

  // Current displayed player
  const [currentPlayer, setCurrentPlayer] = useState<any>(player1);

  // Search handler (will be passed to Header)
  const handlePlayerSearch = (name: string) => {
  const searchKey = name.trim().toLowerCase();

  // search by first or last name
  const foundPlayer = Object.values(players).find(
    (p) =>
      p.first_name.toLowerCase().includes(searchKey) ||
      p.last_name.toLowerCase().includes(searchKey)
  );

  if (foundPlayer) {
    setCurrentPlayer(foundPlayer);
  } else {
    alert(`Player "${name}" not found`);
  }
};




  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   searchPlayers(query);
  // };



  return (
    <SetConvoProvider>
      <FileMapContext.Provider value={fileMap}>
        <AssistantsMapContext.Provider value={assistantsMap}>
          <AgentsMapContext.Provider value={agentsMap}>
          <Header onSearchPlayer={handlePlayerSearch}/>
            <div className="flex" style={{ height: `calc(100dvh - ${bannerHeight}px)` }}>
              <div className="relative z-0 flex h-full w-full overflow-hidden">
                <Nav navVisible={navVisible} setNavVisible={setNavVisible} />
                <div className="relative flex h-full max-w-full flex-1 flex-row overflow-hidden">
                                    <div className="relative flex h-full max-w-full flex-1 flex-col overflow-hidden">
                    <MobileNav setNavVisible={setNavVisible} />
                    <Outlet context={{ navVisible, setNavVisible } satisfies ContextType}/>
                  </div>
                  <div className="w-300 overflow-y-auto flex-shrink-0">
                    <PlayerProfile player={currentPlayer || player1} />
                  </div>
                </div>
              </div>
            </div>
          </AgentsMapContext.Provider>
        </AssistantsMapContext.Provider>
      </FileMapContext.Provider>
    </SetConvoProvider>
  );
}




