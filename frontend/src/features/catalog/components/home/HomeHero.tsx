import { LinkCommon } from "@/components/common/LinkCommon";
import { LABELS } from "@/constants/labels";
import {
  ArrowUpRight,
  HeartHandshake,
  Leaf,
  PackageCheck,
  Sprout,
} from "lucide-react";

const benefits = [
  {
    icon: Leaf,
    title: LABELS.home.HEALTHY_TITLE,
    description: LABELS.home.HEALTHY_DESCRIPTION,
  },
  {
    icon: PackageCheck,
    title: LABELS.home.DELIVERY_TITLE,
    description: LABELS.home.DELIVERY_DESCRIPTION,
  },
  {
    icon: HeartHandshake,
    title: LABELS.home.CARE_TITLE,
    description: LABELS.home.CARE_DESCRIPTION,
  },
];

export function HomeHero() {
  return (
    <>
      <section className="home-hero" aria-labelledby="hero-heading">
        <div className="hero-copy">
          <p className="section-eyebrow hero-eyebrow">
            <span aria-hidden="true" /> {LABELS.home.HERO_EYEBROW}
          </p>
          <h1 id="hero-heading">
            {LABELS.home.HERO_TITLE_FIRST}
            <br />
            {LABELS.home.HERO_TITLE_SECOND}
          </h1>
          <p className="hero-description">{LABELS.home.HERO_DESCRIPTION}</p>
          <LinkCommon
            className="store-primary-button hero-cta"
            href="#collections"
          >
            {LABELS.home.HERO_CTA}
            <ArrowUpRight size={19} strokeWidth={1.5} />
          </LinkCommon>
          <p className="hero-footnote">
            <Sprout size={16} strokeWidth={1.4} /> {LABELS.home.HERO_NOTE}
          </p>
        </div>
        <div className="hero-image">
          <img
            src="/images/home/hero-living-room.webp"
            alt={LABELS.home.HERO_ALT}
            loading="eager"
            width={1504}
            height={1128}
          />
          <LinkCommon className="hero-image-note" href="#collections">
            <span>{LABELS.home.PHOTO_EYEBROW}</span>
            <span>
              {LABELS.home.PHOTO_TITLE}
              <ArrowUpRight size={16} />
            </span>
          </LinkCommon>
        </div>
      </section>
      <section className="home-benefits" aria-label={LABELS.home.BENEFITS}>
        <div className="store-container benefits-grid">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div className="benefit" key={title}>
              <Icon size={29} strokeWidth={1.25} aria-hidden="true" />
              <div>
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
