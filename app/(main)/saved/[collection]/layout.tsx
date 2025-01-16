import HeaderActions from '@/components/saved/HeaderActions';
import { NavbarStoreProvider } from '@/src/providers/navbar-store-provider';

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="shrink overflow-hidden flex flex-col w-full px-2">
      <NavbarStoreProvider>
        <HeaderActions />
        {children}
      </NavbarStoreProvider>
    </div>
  );
}