import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import ProfilePage from './pages/ProfilePage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/student/:id',
        element: <ProfilePage />,
    },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;