'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, CalendarDays } from "lucide-react";
import Link from "next/link";
import { createClient } from '@/utils/supabase/client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    setUser(null);
  };

  return (
    <header className="bg-white shadow-md border-b border-blue-100 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <CalendarDays className="h-8 w-8 text-blue-600" />
            <Link href="/" className="ml-2">
              <span className="text-xl font-bold text-blue-900">
                あきマッチ
              </span>
              <span className="text-sm text-blue-600 ml-2">Akimatch</span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8 items-center">
            <Link
              href="/"
              className="text-blue-700 hover:text-blue-500 font-medium"
            >
              案件一覧
            </Link>
            <Link
              href="/register-availability"
              className="text-blue-700 hover:text-blue-500 font-medium"
            >
              協力会社登録
            </Link>
            <Link
              href="/contact"
              className="text-blue-700 hover:text-blue-500 font-medium"
            >
              お問い合わせ
            </Link>
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/my-page"
                      className="text-blue-700 hover:text-blue-500 font-medium"
                    >
                      マイページ
                    </Link>
                    <Button 
                      variant="outline" 
                      className="border-blue-500 text-blue-600 hover:bg-blue-50"
                      onClick={handleLogout}
                    >
                      ログアウト
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link href="/login">
                      <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                        ログイン
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        新規登録
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-blue-600" />
                    <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500"></span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>新着案件のお知らせがあります</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </nav>
        </div>
      </div>
    </header>
  );
} 