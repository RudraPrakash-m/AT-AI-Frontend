import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useOutletContext } from 'react-router-dom';
import { AppLayout } from '@/layout/AppLayout';
import { AuthLayout } from '@/layout/AuthLayout';
import { AppLoader } from '@/components/common/ui/AppLoader';
import { ProtectedRoutes } from './ProtectedRoutes';
import { ROUTES } from './routeConfig';

// Lazy loaded page components
const ChatPage = lazy(() =>
  import('@/features/chat/pages/ChatPage').then((m) => ({ default: m.ChatPage }))
);
const ChatHistoryPage = lazy(() =>
  import('@/features/historyChat/pages/ChatHistoryPage').then((m) => ({
    default: m.ChatHistoryPage,
  }))
);
const SettingsPage = lazy(() =>
  import('@/features/settings/pages/SettingsPage').then((m) => ({
    default: m.SettingsPage,
  }))
);
const ProfilePage = lazy(() =>
  import('@/features/profile/pages/ProfilePage').then((m) => ({
    default: m.ProfilePage,
  }))
);
const LoginPage = lazy(() =>
  import('@/features/authentication/pages/LoginPage').then((m) => ({
    default: m.LoginPage,
  }))
);
const RegisterPage = lazy(() =>
  import('@/features/authentication/pages/RegisterPage').then((m) => ({
    default: m.RegisterPage,
  }))
);
const ForgotPasswordPage = lazy(() =>
  import('@/features/authentication/pages/ForgotPasswordPage').then((m) => ({
    default: m.ForgotPasswordPage,
  }))
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

// Wrapper to pass AppLayout outlet context down to ChatPage
const ChatPageWrapper: React.FC = () => {
  const context = useOutletContext<{ onOpenMobileMenu?: () => void }>();
  return <ChatPage onOpenMobileMenu={context?.onOpenMobileMenu} />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<AppLoader fullScreen message="Loading workspace..." />}>
      <Routes>
        {/* Public Authentication Routes */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        </Route>

        {/* Protected Application Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to={ROUTES.CHAT} replace />} />
            <Route path={ROUTES.CHAT} element={<ChatPageWrapper />} />
            <Route path={ROUTES.CHAT_CONVERSATION} element={<ChatPageWrapper />} />
            <Route path={ROUTES.HISTORY} element={<ChatHistoryPage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          </Route>
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
