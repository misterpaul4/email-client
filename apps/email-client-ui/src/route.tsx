import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import AuthLayout from './app/layout/auth';
import HomeLayout from './app/layout/home';
import HomePage from './app/layout/home/HomPage';
import NewAccount from './app/layout/auth/NewAccount';

const routes: RouteObject[] = [
  {
    element: <HomeLayout />,
    children: [{ path: '/', element: <HomePage /> }],
  },
  {
    element: <AuthLayout />,
    children: [{ path: 'auth/new-account', element: <NewAccount /> }],
  }
];

const router = createBrowserRouter(routes);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
