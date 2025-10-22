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
import TermsAndConditionsModal from '~/components/ui/TermsAndConditionsModal';
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

  const handleAcceptTerms = () => {
    setShowTerms(false);
  };

  const handleDeclineTerms = () => {
    setShowTerms(false);
    logout('/login?redirect=false');
  };

  if (!isAuthenticated) {
    return null;
  }




  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    //searchPlayers(query);
  };

  const player = {
    first_name: 'Harry',
    last_name: 'Phan',
    position: 'RW',
    team: 'Stechco',
    weak_foot: 4,
    skill_moves: 5,
    preferred_foot: 'Left',
    height: "170 cm",
    weight: "72 kg",
    alt_positions: "CAM, CF",
    pace: 85,
    acceleration: 87,
    sprint_speed: 83,
    shooting: 92,
    passing: 91,
    dribbling: 95,
    defending: 38,
    physicality: 65,
    traits: [
      { name: "Playmaker", description: "Great vision and passing ability." },
      { name: "Finesse Shot", description: "Scores curlers from outside the box." },
    ]
  };

  return (
    <SetConvoProvider>
      <FileMapContext.Provider value={fileMap}>
        <AssistantsMapContext.Provider value={assistantsMap}>
          <AgentsMapContext.Provider value={agentsMap}>
            <Banner onHeightChange={setBannerHeight} />
            <Header />
            <div className="flex" style={{ height: `calc(100dvh - ${bannerHeight}px)` }}>
              <div className="relative z-0 flex h-full w-full overflow-hidden">
                <Nav navVisible={navVisible} setNavVisible={setNavVisible} />
                <div className="relative flex h-full max-w-full flex-1 flex-col overflow-hidden">
                    <PlayerProfile player={player} />
                  <MobileNav setNavVisible={setNavVisible} />
                  <Outlet context={{ navVisible, setNavVisible } satisfies ContextType} />
                </div>
              </div>
            </div>
          </AgentsMapContext.Provider>
        </AssistantsMapContext.Provider>
      </FileMapContext.Provider>
    </SetConvoProvider>
  );
}




