import { Outlet } from 'react-router-dom';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';

export const MainLayout = () => {
  return (
    <div className="relative h-full flex flex-col overflow-auto bg-black rounded-4xl max-sm:rounded-none">
      <video
        src="/bg_remix.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover -z-0"
      />
      <div className="relative z-10 flex h-full flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};
