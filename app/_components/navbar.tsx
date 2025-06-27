"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="flex justify-between border-b border-solid px-8 py-4">
      <div className="flex items-center gap-10">
        <Image
          src="/logo-wfinance.png"
          width={173}
          height={39}
          alt="Wfinance"
        />
        <Link
          href="/"
          className={
            pathname === "/"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          }
        >
          Dashboard
        </Link>
        <Link
          href="/transactions"
          className={
            pathname === "/transactions"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          }
        >
          Transações
        </Link>
        <Link
          href="subscription"
          className={
            pathname === "/subscription"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          }
        >
          Assinatura
        </Link>
      </div>
      <div>
        <Button>Logout</Button>
      </div>
    </nav>
  );
};

export default Navbar;
