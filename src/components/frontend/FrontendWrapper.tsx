import { LanguageProvider } from '@/context/LanguageContext';
import Navbar from './Navbar';
import Footer from './Footer';

export default function FrontendWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </LanguageProvider>
  );
}
