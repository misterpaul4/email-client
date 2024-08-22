import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import AuthLayout from './app/layout/auth';
import GoogleCallBack from './app/layout/callback/Google';
import HomeLayout from './app/layout/home';
import HomePage from './app/layout/home/HomPage';
import NewAccount from './app/layout/auth/NewAccount';
import CallBackLayout from './app/layout/callback';

const routes: RouteObject[] = [
  {
    element: <HomeLayout />,
    children: [{ path: '/', element: <HomePage /> }],
  },
  {
    element: <AuthLayout />,
    children: [{ path: 'auth/new-account', element: <NewAccount /> }],
  },
  {
    element: <CallBackLayout />,
    children: [{ path: 'auth/google', element: <GoogleCallBack /> }],
  },
];

const router = createBrowserRouter(routes);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
