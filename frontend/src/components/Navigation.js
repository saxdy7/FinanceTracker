'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';

export default function Navigation() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:inline">FinanceTracker</span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={() => router.push('/login')}
              className="text-sm"
            >
              Sign In
            </Button>
            <Button
              onClick={() => router.push('/register')}
              className="text-sm"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
