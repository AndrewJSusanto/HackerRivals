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
  // const [user, setUser] = useState(() => {
  //   const saved = localStorage.getItem('hr_user');
  //   return saved ? JSON.parse(saved) : null;
  // });
  const [user, setUser] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const showOnboarding = !user?.id;
  const [authReady, setAuthReady] = useState(false);
  const [onboardingError, setOnboardingError] = useState(null);
  const [onboardingLoading, setOnboardingLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showScanner, setShowScanner] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', points: 0 });

  const userNickname = user?.username ?? 'Alex';
  const userAvatar = user?.emoji ?? '🌊';
  const userQrToken = user?.qr_token;

  useEffect(() => {
    const saved = localStorage.getItem('hr_user');

    if (!saved) {
      setAuthReady(true);
      return;
    }

    const parsed = JSON.parse(saved);

    const rehydrate = async () => {
      try {
        const { data } = await api.post('/auth/badge', {
          token: parsed.qr_token,
        });

        setUser(data.user || null);
        persistUser(data.user || null);
      } catch {
        setUser(null);
        persistUser(null);
      } finally {
        setAuthReady(true);
      }
    };

    rehydrate();
  }, []);

  const refreshUser = useCallback(async (token) => {
    if (!token) return;

    try {
      const { data } = await api.post('/auth/badge', {
        token,
      });

      const freshUser = data?.user;
      if (!freshUser?.id) return;

      setUser(freshUser);
      persistUser(freshUser);

    } catch (err) {
      console.error('refreshUser failed:', err);
    }
  }, []);

  const refreshRank = useCallback(async (top = 0) => {
    if (!user?.id) return null;
    try {
      const { data } = await api.get(`/user/rank?userId=${user.id}${top ? `&top=${top}` : ''}`);
      setUserRank(data.rank);
      // console.log('REFRESH RANK:', data);
      return data;
    } catch {
      return null;
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    refreshUser(user?.qr_token);
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    refreshRank();
  }, [user?.id, activeTab]);

  const handleScan = () => setShowScanner(true);

  const handleOnboardingComplete = async ({ nickname, emoji }) => {
    setOnboardingError(null);
    setOnboardingLoading(true);

    try {
      const response = await fetch('/api/user/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: nickname,
          emoji: emoji
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data?.error || '';

        if (message.toLowerCase().includes('username')) {
          setOnboardingError('That nickname is already taken. Try another.');
        } else {
          setOnboardingError('Could not register. Please try again.');
        }
        return; // 🚨 stop execution
      }

      // ✅ success case
      setUser(data.user);
      persistUser(data.user);

    } catch (err) {
      // only runs for network issues
      setOnboardingError('Network error. Please try again.');
    } finally {
      setOnboardingLoading(false);
    }
  };

  const handlePairSuccess = (data) => {
    setSnackbar({
      open: true,
      message: `Paired with @${data.partner?.name ?? 'attendee'}!`,
      points: data.points ?? 0,
    });
    refreshUser(user?.qr_token);
    refreshRank();
  };

  const handleChallengeFound = (data) => {
    setSnackbar({
      open: true,
      message: data.title || 'Challenge found',
      points: data.points ?? 0,
    });
  };

  const logoutUser = () => {
    setUser(null);
    persistUser(null);
    setUserRank(null);
    setActiveTab('home');
    setShowScanner(false);
    localStorage.removeItem('hr_user');
  };

  if (!authReady) return null; // or loading screen

  const renderScreen = () => {
    // console.log('NEW USER:', user);
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
        return <Hunt
          onOpenScanner={handleScan} />;
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
            onLogout={logoutUser}
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
        {showOnboarding ? (
          <Onboarding
            onComplete={handleOnboardingComplete}
            error={onboardingError}
            loading={onboardingLoading}
          />
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
