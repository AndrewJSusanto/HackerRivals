import { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { Onboarding } from './components/Onboarding';
import { Homepage } from './components/Homepage';
import { Hunt } from './components/Hunt';
import { Leaderboard } from './components/Leaderboard';
import { Profile } from './components/Profile';
import { Scanner } from './components/Scanner';

export default function App() {
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [showScanner, setShowScanner] = useState(false);
  const [userNickname] = useState('Alex');
  const [userAvatar] = useState('🌊');

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
    switch (activeTab) {
      case 'home':
        return <Homepage userNickname={userNickname} userAvatar={userAvatar} />;
      case 'hunt':
        return <Hunt />;
      case 'leaderboard':
        return <Leaderboard currentUserNickname={userNickname} currentUserAvatar={userAvatar} />;
      case 'profile':
        return <Profile userNickname={userNickname} userAvatar={userAvatar} />;
      default:
        return <Homepage userNickname={userNickname} userAvatar={userAvatar} />;
    }
  };

  return (
    <div className="dark min-h-screen w-full flex justify-center bg-surface-1">
      <div className="w-full max-w-[390px] min-h-screen bg-surface-1 relative">
        {isOnboarding ? (
         <Onboarding onComplete={() => setIsOnboarding(false)} />
        ) : (
          <>
            {renderScreen()}
            {(
              <BottomNav
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onScanClick={handleScan}
              />
            )}
          </>
        )}
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
