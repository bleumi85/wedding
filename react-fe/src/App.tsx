import * as React from 'react';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { ErrorPage, PrivateRoute, Root } from './components/main';
import './index.scss';
import AuthLayout from './features/auth/AuthLayout';
import AdminLayout from './features/admin/AdminLayout';

const Home = () => <div data-testid="page_Home">You are home!</div>;
const Guests = () => <div data-testid="page_Guests">You are on the guests page</div>;

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
      {/* private */}
      <Route element={<PrivateRoute />}>
        <Route index element={<Home />} />
        <Route path="guests" element={<Guests />} />
      </Route>
      {/* private - ADMIN */}
      <Route element={<PrivateRoute />}>
        <Route path="admin/*" element={<AdminLayout />} />
        {/* <Route path="admin" element={<AdminLayout />}>
          <Route index element={<div>Bitte wähle einen Bereich</div>} />
          <Route path="invitations" element={<div>Einladungen</div>} />
        </Route> */}
      </Route>
      {/* public */}
      <Route path="auth/*" element={<AuthLayout />} />
    </Route>,
  ),
);

const App: React.FunctionComponent = () => {
  return <RouterProvider router={router} />;
};

export default App;
