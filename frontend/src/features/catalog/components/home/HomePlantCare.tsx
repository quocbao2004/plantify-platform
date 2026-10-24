import { ButtonCommon } from "@/components/common/ButtonCommon";
import { LinkCommon } from "@/components/common/LinkCommon";
import { LABELS } from "@/constants/labels";
import { useState } from "react";

import { ArrowRight, Droplets, Leaf, Sun } from "lucide-react";
import { ModalCommon } from "@/components/common/ModalCommon";

const careTips = [
  {
    icon: Sun,
    title: LABELS.home.TIP_LIGHT_TITLE,
    content: LABELS.home.TIP_LIGHT_CONTENT,
  },
  {
    icon: Droplets,
    title: LABELS.home.TIP_WATER_TITLE,
    content: LABELS.home.TIP_WATER_CONTENT,
  },
  {
    icon: Leaf,
    title: LABELS.home.TIP_LEAF_TITLE,
    content: LABELS.home.TIP_LEAF_CONTENT,
  },
];

export function HomePlantCare() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section
        className="store-container care-section"
        id="plant-care"
        aria-labelledby="care-heading"
      >
        <div className="care-banner">
          <div className="care-image">
            <img
              src="/images/home/plant-care.webp"
              alt={LABELS.home.CARE_ALT}
              loading="lazy"
              width={960}
              height={640}
            />
          </div>
          <div className="care-copy">
            <p className="section-eyebrow">{LABELS.home.CARE_EYEBROW}</p>
            <h2 id="care-heading">{LABELS.home.CARE_HEADLINE}</h2>
            <p>{LABELS.home.CARE_COPY}</p>
            <ButtonCommon
              variant="unstyled"
              type="button"
              className="store-text-link"
              onClick={() => setOpen(true)}
            >
              {LABELS.home.CARE_CTA}
              <ArrowRight size={17} />
            </ButtonCommon>
          </div>
        </div>
      </section>
      <ModalCommon
        open={open}
        onClose={() => setOpen(false)}
        title={LABELS.home.CARE_DIALOG}
      >
        <p className="dialog-intro">{LABELS.home.CARE_INTRO}</p>
        <div className="care-guide">
          {careTips.map(({ icon: Icon, title, content }, index) => (
            <details key={title} open={index === 0}>
              <summary>
                <Icon size={20} /> {title}
              </summary>
              <p>{content}</p>
            </details>
          ))}
        </div>
        <LinkCommon
          className="store-primary-button"
          to="/catalog?care_level=EASY"
          onClick={() => setOpen(false)}
        >
          {LABELS.home.EASY_CTA}
          <ArrowRight size={17} />
        </LinkCommon>
      </ModalCommon>
    </>
  );
}
