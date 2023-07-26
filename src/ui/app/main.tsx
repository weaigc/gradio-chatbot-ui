import { RouterProvider } from '@tanstack/react-router'
import './base.scss'
import './i18n'
import { router } from './router'

const Main = () => <RouterProvider router={router} />;
export default Main;

