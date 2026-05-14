'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/recipe', label: 'Recetas' },
  { href: '/menu', label: 'Menú' },
  { href: '/shopping-list', label: 'Compra' },
];

export const NavBar = () => {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-slate-800 px-6 py-3">
      <div className="mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-3xl text-emerald-500">
            soup_kitchen
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'text-slate-800 bg-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
    
  );
};