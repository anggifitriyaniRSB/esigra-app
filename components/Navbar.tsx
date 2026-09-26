"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-ivory/90 backdrop-blur-sm border-b border-charcoal/10" : "bg-transparent"
      }`}
    >
      <nav aria-label="Primary" className="mx-auto flex max-w-content items-center justify-between px-6 py-4 md:px-10">
        <a href="#top" className="flex items-center gap-2">
          <Image
            src="/images/logo-icon.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 rounded-sm"
          />
          <span className="font-serif text-lg tracking-tight text-forest">e-SIGRA</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-charcoal-soft transition-colors hover:text-forest"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden rounded-sm border border-forest px-5 py-2 text-sm font-medium text-forest transition-colors hover:bg-forest hover:text-ivory md:inline-block"
        >
          Partner with us
        </a>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-forest md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-charcoal/10 bg-ivory md:hidden">
          <ul className="flex flex-col px-6 py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base text-charcoal"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="block rounded-sm bg-forest px-5 py-3 text-center text-sm font-medium text-ivory"
              >
                Partner with us
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
