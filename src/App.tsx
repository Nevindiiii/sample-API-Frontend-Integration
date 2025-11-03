import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import { ROUTES } from '@/constants/routes.constant';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex">
          <Navigation />
          <main className="flex-1 ml-16">
            <Routes>
              {ROUTES.map(({ path, component: Component }) => (
                <Route key={path} path={path} element={<Component />} />
              ))}
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
export default App;
