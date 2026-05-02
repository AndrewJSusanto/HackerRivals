import { useState, useEffect, useCallback } from 'react';
import { BottomNav } from './components/BottomNav';
import { Onboarding } from './components/Onboarding';
import { Homepage } from './components/Homepage';
import { Hunt } from './components/Hunt';
import { Leaderboard } from './components/Leaderboard';
import { Profile } from './components/Profile';
import { Scanner } from './components/Scanner';
import { SuccessSnackbar } from './components/SuccessSnackbar';
import api from '../lib/api';

const persistUser = (u) => {
  if (u) localStorage.setItem('hr_user', JSON.stringify(u));
  else localStorage.removeItem('hr_user');
};

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hr_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [userRank, setUserRank] = useState(null);
  const [isOnboarding, setIsOnboarding] = useState(!user);
  const [onboardingError, setOnboardingError] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showScanner, setShowScanner] = useState(false);
  const [showUIStates, setShowUIStates] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', points: 0 });

  const userNickname = user?.username ?? 'Alex';
  const userAvatar = user?.emoji ?? '🌊';
  const userQrToken = user?.qr_token;

  const refreshUser = useCallback(async () => {
    if (!user?.qr_token) return;
    try {
      const { data } = await api.post('/auth/badge', { token: user.qr_token });
      const fresh = data.user;
      setUser(fresh);
      persistUser(fresh);
    } catch {
      // silent — keep cached user
    }
  }, [user?.qr_token]);

  const refreshRank = useCallback(async (top = 0) => {
    if (!user?.id) return null;
    try {
      const { data } = await api.get(`/user/rank?userId=${user.id}${top ? `&top=${top}` : ''}`);
      setUserRank(data.rank);
      return data;
    } catch {
      return null;
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    refreshUser();
    refreshRank();
  }, [user?.id, activeTab]);

  const handleScan = () => setShowScanner(true);

  const handleOnboardingComplete = async ({ nickname, emoji }) => {
    setOnboardingError(null);
    try {
      const { data } = await api.post('/user/create', { username: nickname, emoji });
      setUser(data.user);
      persistUser(data.user);
      setIsOnboarding(false);
    } catch (err) {
      setOnboardingError(err.response?.data?.error || 'Could not register. Please try again.');
    }
  };

  const handlePairSuccess = (data) => {
    setSnackbar({
      open: true,
      message: `Paired with @${data.partner?.name ?? 'attendee'}!`,
      points: data.points ?? 0,
    });
    refreshUser();
    refreshRank();
  };

  const handleChallengeFound = (data) => {
    setSnackbar({
      open: true,
      message: data.title || 'Challenge found',
      points: data.points ?? 0,
    });
  };

  const renderScreen = () => {
    // if (showUIStates) {
    //   return <UIStatesDemo />;
    // }

    switch (activeTab) {
      case 'home':
        return (
          <Homepage
            user={user}
            userNickname={userNickname}
            userAvatar={userAvatar}
            userRank={userRank}
            onOpenScanner={handleScan}
          />
        );
      case 'hunt':
        return <Hunt />;
      case 'leaderboard':
        return (
          <Leaderboard
            user={user}
            currentUserNickname={userNickname}
            currentUserAvatar={userAvatar}
            userRank={userRank}
            refreshRank={refreshRank}
          />
        );
      case 'profile':
        return (
          <Profile
            user={user}
            userNickname={userNickname}
            userAvatar={userAvatar}
            userQrToken={userQrToken}
            userRank={userRank}
          />
        );
      default:
        return (
          <Homepage
            user={user}
            userNickname={userNickname}
            userAvatar={userAvatar}
            userRank={userRank}
            onOpenScanner={handleScan}
          />
        );
    }
  };

  return (
    <div className="dark min-h-screen w-full flex justify-center bg-surface-1">
      <div className="w-full max-w-[390px] min-h-screen bg-surface-1 relative">
        {isOnboarding ? (
         <Onboarding onComplete={handleOnboardingComplete} error={onboardingError} />
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

        {/* Debug Toggle for UI States */}
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
        </button>

        {/* Scanner Overlay */}
        {showScanner && (
          <Scanner
            onClose={() => setShowScanner(false)}
            userId={user?.id}
            onPairSuccess={handlePairSuccess}
            onChallengeFound={handleChallengeFound}
          />
        )}

        <SuccessSnackbar
          open={snackbar.open}
          message={snackbar.message}
          points={snackbar.points}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        />
      </div>
    </div>
  );
}
