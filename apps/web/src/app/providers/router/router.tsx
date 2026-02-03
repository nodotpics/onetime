import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@/app/layouts/main-layout';
import { UploadPage } from '@/pages/upload';
import { ViewPage } from '@/pages/view';
import { PreviewPage } from '@/pages/preview';
import { PrivacyPage } from '@/pages/privacy';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <UploadPage /> },
      { path: '/preview/:id', element: <PreviewPage /> },
      { path: '/view/:id', element: <ViewPage /> },
      { path: '/privacy', element: <PrivacyPage /> },
    ],
  },
]);
