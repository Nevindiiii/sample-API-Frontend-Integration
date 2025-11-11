import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ROUTES } from '@/constants/routes.constant';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

const queryClient = new QueryClient();

const publicRoutes = ['/login', '/register'];

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex">
          {isAuthenticated && <Navigation />}
          <main className={isAuthenticated ? "flex-1 ml-16" : "flex-1"}>
            <Suspense fallback={<div className="p-6">Loading...</div>}>
              <Routes>
                {ROUTES.map(({ path, component: Component }) => {
                  const isPublic = publicRoutes.includes(path);
                  return (
                    <Route
                      key={path}
                      path={path}
                      element={
                        isPublic ? (
                          isAuthenticated ? <Navigate to="/" replace /> : <Component />
                        ) : (
                          <ProtectedRoute>
                            <Component />
                          </ProtectedRoute>
                        )
                      }
                    />
                  );
                })}
              </Routes>
            </Suspense>
          </main>
        </div>
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
export default App;
