'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Home, Route, Plane } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      <Link
        href="/"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
          pathname === '/' ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-primary'
        }`}
      >
        <Home className="h-4 w-4" />
        Dashboard
      </Link>
      <Link
        href="/missions"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
          pathname === '/missions' ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-primary'
        }`}
      >
        <Route className="h-4 w-4" />
        Missions
      </Link>
      <Link
        href="/drones"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
          pathname === '/drones' ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-primary'
        }`}
      >
        <Plane className="h-4 w-4" />
        Drones
      </Link>
    </>
  );
};
