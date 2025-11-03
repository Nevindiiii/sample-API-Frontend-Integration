import Page from '@/app/payments/page';
import AddUserTable from '@/app/payments/AddUser';
import Dashboard from '@/pages/Dashboard';

export const ROUTES = [
  { path: '/', component: Page },
  { path: '/add-user', component: AddUserTable },
  { path: '/dashboard', component: Dashboard }
] as const;