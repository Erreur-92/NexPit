"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogoMark, LogoWord } from "./logo";
import { nav, site } from "@/content/site";
import { ui } from "@/content/ui";
import { localePath, otherLocale, switchLocalePath, type Locale } from "@/lib/i18n";

/**
 * Composant client pour trois raisons seulement : marquer la page courante,
 * ouvrir le menu sous 1024px, et refermer ce menu quand la navigation change.
 * Rien d'autre n'est interactif ici.
 */
export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => pathname.startsWith(localePath(locale, href));
  const other = otherLocale(locale);

  return (
    <header className="border-b border-rule">
      <div className="shell flex items-center justify-between gap-6 py-4 lg:py-5">
        <Link
          href={localePath(locale, "/")}
          className="flex items-center gap-3 shrink-0"
          aria-label={`${site.name} — ${ui.misc.homeAria[locale]}`}
        >
          <LogoMark className="h-8 w-8 lg:h-9 lg:w-9" />
          <LogoWord className="h-4 w-auto lg:h-[1.125rem]" />
        </Link>

        <nav aria-label={ui.misc.mainNav[locale]} className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
              <li key={item.key}>
                <Link
                  href={localePath(locale, item.href)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="label hover:text-ink aria-[current=page]:text-ink transition-colors"
                >
                  {item.label[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3 lg:gap-5">
          <Link
            href={switchLocalePath(pathname, other)}
            hrefLang={other}
            aria-label={ui.langSwitchLabel[locale]}
            className="label hover:text-ink transition-colors"
          >
            {ui.langSwitch[locale]}
          </Link>

          <Link href={localePath(locale, "/rendez-vous")} className="btn hidden lg:inline-flex">
            {ui.misc.bookShort[locale]}
          </Link>

          <button
            type="button"
            className="btn btn-ghost lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? ui.close[locale] : ui.menu[locale]}
          </button>
        </div>
      </div>

      {open ? (
        <div id="menu-mobile" ref={panelRef} className="border-t border-rule lg:hidden">
          <nav className="shell py-2" aria-label={ui.misc.mainNav[locale]}>
            <ul className="divide-y divide-rule">
              {nav.map((item) => (
                <li key={item.key}>
                  <Link
                    href={localePath(locale, item.href)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="block py-4 display d3 aria-[current=page]:text-ink-3"
                  >
                    {item.label[locale]}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={localePath(locale, "/rendez-vous")} className="block py-4 display d3">
                  {ui.misc.bookShort[locale]}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
