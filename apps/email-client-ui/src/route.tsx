import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import AuthLayout from './app/layout/auth';
import HomeLayout from './app/layout/home';
import HomePage from './app/layout/home/HomPage';
import NewAccount from './app/layout/auth/NewAccount';
import GoogleCallBack from './app/layout/callback/Google';
import CallBackLayout from './app/layout/callback';
import MicrosoftCallBack from './app/layout/callback/Microsoft';

const routes: RouteObject[] = [
  {
    element: <HomeLayout />,
    children: [{ path: '/', element: <HomePage /> }],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: 'auth/new-account', element: <NewAccount /> },
      {
        path: 'auth/oauth',
        element: <CallBackLayout />,
        children: [
          { path: 'google', element: <GoogleCallBack /> },
          { path: 'microsoft', element: <MicrosoftCallBack /> },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
