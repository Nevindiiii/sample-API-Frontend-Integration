import Page from '@/app/payments/page';
import AddUserTable from '@/app/payments/AddUser';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';

export const ROUTES = [
  { path: '/', component: Page },
  { path: '/add-user', component: AddUserTable },
  { path: '/dashboard', component: Dashboard },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/profile', component: Profile }
] as const;