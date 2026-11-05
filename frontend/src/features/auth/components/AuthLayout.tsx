import type { ReactNode } from "react";
import { Home } from "lucide-react";
import { LinkCommon } from "@/components/common/LinkCommon";
import { LABELS } from "@/constants/labels";

interface AuthLayoutProps {
  children: ReactNode;
  headingId: string;
}

export function AuthLayout({ children, headingId }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      <section
        className="relative hidden lg:flex lg:w-1/2 flex-col justify-end min-h-screen overflow-hidden"
        aria-label={LABELS.home.HERO_EYEBROW}
      >
        <img
          src="/images/home/hero-living-room.webp"
          alt={LABELS.home.HERO_ALT}
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0e2518] via-[#0e2518]/70 via-35% to-transparent to-70%"
          aria-hidden="true"
        />
        <div className="relative z-10 p-12 lg:p-16 text-white max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-white/70" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-wider uppercase text-white/90">{LABELS.auth.HERO_EYEBROW}</span>
          </div>
          <h2 className="font-serif text-3xl xl:text-4xl leading-snug font-normal mb-3 text-white">
            {LABELS.home.HERO_TITLE_FIRST}<br />{LABELS.home.HERO_TITLE_SECOND}
          </h2>
          <p className="text-sm text-white/80 max-w-sm font-light leading-relaxed">{LABELS.auth.HERO_SUBTITLE}</p>
        </div>
      </section>
      <section
        className="flex-1 min-w-0 flex flex-col justify-between min-h-screen p-6 sm:p-10 lg:p-12 xl:p-16 bg-white"
        aria-labelledby={headingId}
      >
        <div className="flex items-center justify-between pt-2 pb-6 w-full">
          <LinkCommon
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand/20 bg-brand/5 text-brand hover:bg-brand/10 hover:border-brand/40 transition-all duration-200 text-sm font-medium"
            aria-label={LABELS.navigation.BRAND_HOME}
          >
            <Home className="w-4 h-4 text-brand" aria-hidden="true" />
            <span>{LABELS.navigation.HOME}</span>
          </LinkCommon>
        </div>
        <main id="main-content" className="w-full max-w-sm sm:max-w-md mx-auto my-auto py-4">{children}</main>
        <div className="pt-6 pb-2 text-center">
          <p className="text-[11px] text-surface-400">{LABELS.auth.COPYRIGHT_TEXT}</p>
        </div>
      </section>
    </div>
  );
}
