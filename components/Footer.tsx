import { footerLinks } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-charcoal py-14 text-ivory/80">
      <div className="mx-auto flex max-w-content flex-col gap-10 px-6 md:flex-row md:items-start md:justify-between md:px-10">
        <div>
          <p className="font-serif text-xl text-ivory">e-SIGRA</p>
          <p className="mt-1 text-sm text-ivory/75">From Risk to Action.</p>
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-ivory/70">
            Digital Preventive Health &amp; Early Risk Detection Platform
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 sm:grid-cols-3">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-block py-1.5 text-sm text-ivory/70 hover:text-ivory"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-10 max-w-content border-t border-ivory/10 px-6 pt-6 md:px-10">
        <p className="text-xs text-ivory/65">© 2026 e-SIGRA. All rights reserved.</p>
      </div>
    </footer>
  );
}
