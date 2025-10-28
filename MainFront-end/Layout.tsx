import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import AuthDialog from "../AuthDialog";
import { useSignalR } from "@/hooks/useSignalR";

type User = {
  firstName: string;
  lastName: string;
};

const nav = [
  { to: "/", label: "صفحه اصلی" },
  { to: "/order", label: "ثبت سفارش" },
  { to: "/shop", label: "فروشگاه" },
  { to: "/about", label: "درباره ما" },
  { to: "/contact", label: "تماس با ما" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useSignalR();

  const fetchUser = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    try {
      const res = await fetch("/api/v1/Users/Me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        localStorage.removeItem("authToken");
      }
    } catch (error) {
      setIsLoggedIn(false);
      localStorage.removeItem("authToken");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
  };

  const authSuccess = () => {
    fetchUser();
  };

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <div className="container py-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="inline-flex items-center">
              <span className="inline-flex size-8 rounded-lg bg-gradient-to-tr from-primary to-secondary/80 shadow-md" />
            </Link>
            <Link to="/" className="font-extrabold text-lg tracking-tight">
              باربری بهار
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-1 me-auto">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? "text-primary" : "text-foreground/70"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <span className="text-sm">
                  سلام، {user?.firstName || "کاربر"}!
                </span>
                <Button onClick={() => navigate("/dashboard/customer")}>
                  داشبورد
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  خروج
                </Button>
              </>
            ) : (
              <AuthDialog
                trigger={<Button>ورود / ثبت‌نام</Button>}
                onAuthSuccess={authSuccess}
              />
            )}
          </div>
          <div className="md:hidden ms-auto">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="منو">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw]">
                <div className="flex flex-col gap-1 mt-6">
                  {nav.map((n) => (
                    <NavLink
                      key={n.to}
                      to={n.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `px-3 py-2 rounded-md text-base transition-colors hover:text-primary ${
                          pathname === n.to || isActive
                            ? "text-primary"
                            : "text-foreground/80"
                        }`
                      }
                    >
                      {n.label}
                    </NavLink>
                  ))}
                  {isLoggedIn ? (
                    <Button
                      onClick={() => {
                        handleLogout();
                        setOpen(false);
                      }}
                      className="mt-2"
                    >
                      خروج
                    </Button>
                  ) : (
                    <AuthDialog
                      trigger={
                        <Button className="mt-2 w-full">ورود / ثبت‌نام</Button>
                      }
                      onAuthSuccess={() => {
                        authSuccess();
                        setOpen(false);
                      }}
                    />
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t mt-12">
        <div className="container py-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="font-extrabold text-lg mb-2">باربری بهار</div>
            <p className="text-sm text-foreground/70">
              سامانه هوشمند سفارش آنلاین اسبابکشی و حمل بار. تجربهای سریع،
              امن و شفاف.
            </p>
          </div>
          <div>
            <div className="font-bold mb-2">دسترسی سریع</div>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li>
                <Link to="/order" className="hover:text-primary">
                  ثبت سفارش
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-primary">
                  فروشگاه کارتن
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-bold mb-2">ارتباط با ما</div>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li>تلفن: 021-00000000</li>
              <li>تهران، ...</li>
            </ul>
          </div>
          <div>
            <div className="font-bold mb-2">شبکههای اجتماعی</div>
            <div className="flex gap-3 text-sm text-foreground/70">
              <a href="#" className="hover:text-primary">اینستاگرام</a>
              <a href="#" className="hover:text-primary">تلگرام</a>
            </div>
          </div>
        </div>
        <div className="border-t py-4 text-center text-xs text-foreground/60">
          © {new Date().getFullYear()} Barbari Bahar
        </div>
      </footer>
    </div>
  );
}
