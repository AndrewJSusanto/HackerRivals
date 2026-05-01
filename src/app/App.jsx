import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { BottomNav } from './components/BottomNav';
import { Onboarding } from './components/Onboarding';
import { Homepage } from './components/Homepage';
import { Hunt } from './components/Hunt';
import { Leaderboard } from './components/Leaderboard';
import { Profile } from './components/Profile';
import { Scanner } from './components/Scanner';
import { UIStatesDemo } from './components/UIStatesDemo';
import Login from './components/Login';

export default function App() {
  const { user } = useAuth();
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showScanner, setShowScanner] = useState(false);
  const [showUIStates, setShowUIStates] = useState(false);

  const handleScan = () => {
    setShowScanner(true);
  };

  const handleScanFriend = () => {
    console.log('Scanning friend code');
    setShowScanner(false);
  };

  const handleScanMission = () => {
    console.log('Scanning mission code');
    setShowScanner(false);
  };

  const renderScreen = () => {
    if (showUIStates) {
      return <UIStatesDemo />;
    }

    switch (activeTab) {
      case 'home':
        return <Homepage userNickname={user?.username} userAvatar={user?.emoji} />;
      case 'hunt':
        return <Hunt />;
      case 'leaderboard':
        return <Leaderboard currentUserNickname={user?.username} currentUserAvatar={user?.emoji} />;
      case 'profile':
        return <Profile userNickname={user?.username} userAvatar={user?.emoji} />;
      default:
        return <Homepage userNickname={user?.username} userAvatar={user?.emoji} />;
    }
  };

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen w-full flex justify-center bg-slate-950">
      <div className="w-full max-w-[390px] min-h-screen bg-slate-950 relative">
        {isOnboarding ? (
          <Onboarding />
        ) : (
          <>
            {renderScreen()}
            {!showUIStates && (
              <BottomNav
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onScanClick={handleScan}
              />
            )}
          </>
        )}

        {/* Debug Toggle for UI States
        <button
          onClick={() => setShowUIStates(!showUIStates)}
          className="fixed top-4 left-4 z-50 px-3 py-1 rounded-full text-xs"
          style={{
            backgroundColor: showUIStates ? 'var(--golden-amber)' : 'var(--ocean-blue)',
            color: showUIStates ? '#000000' : '#ffffff',
            fontWeight: 500,
          }}
        >
          {showUIStates ? 'Exit Demo' : 'UI States'}
        </button> */}

        {/* Scanner Overlay */}
        {showScanner && (
          <Scanner
            onClose={() => setShowScanner(false)}
            onScanFriend={handleScanFriend}
            onScanMission={handleScanMission}
          />
        )}
      </div>
    </div>
  );
}
