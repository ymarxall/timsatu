import { v4 as uuid } from 'uuid';

export const DashboardMenu = [
  {
    id: uuid(),
    title: 'Dashboard',
    icon: 'home',
    link: '/dashboard', // Ubah ke dashboard
  },
  {
    id: uuid(),
    title: 'Dashboard',
    grouptitle: true,
  },
  {
    id: uuid(),
    title: 'Authentication',
    icon: 'lock',
    children: [
      { id: uuid(), link: '/authentication/sign-up', name: 'Create Account' },
      // { id: uuid(), link: '/', name: 'Log Out' }, // Ubah ke Log Out
      // // { id: uuid(), link: '/authentication/forget-password', name: 'Forget Password' }
    ],
  },
  {
    id: uuid(),
    title: 'Layouts',
    icon: 'layout',
    link: '/layout-vertical',
  },
];

export default DashboardMenu;