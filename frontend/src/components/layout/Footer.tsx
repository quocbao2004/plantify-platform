import { TextFieldCommon } from "@/components/common/TextFieldCommon";
import { MESSAGES } from "@/constants/messages";
import { STORAGE_KEYS } from "@/constants";
import { notify } from "@/services/notifications";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { FormCommon } from "@/components/common/FormCommon";
import { LinkCommon } from "@/components/common/LinkCommon";
import { LABELS } from "@/constants/labels";
import { useState, type FormEvent } from "react";

import { Sprout, ArrowRight } from "lucide-react";
import { ModalCommon } from "@/components/common/ModalCommon";

const information = {
  about: {
    title: LABELS.footer.ABOUT_TITLE,
    text: LABELS.footer.ABOUT_DESCRIPTION,
  },
  shipping: {
    title: LABELS.footer.SHIPPING,
    text: LABELS.footer.SHIPPING_DESCRIPTION,
  },
  shopping: {
    title: LABELS.footer.SHOPPING,
    text: LABELS.footer.SHOPPING_DESCRIPTION,
  },
  privacy: {
    title: LABELS.footer.PRIVACY,
    text: LABELS.footer.PRIVACY_DESCRIPTION,
  },
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [panel, setPanel] = useState<keyof typeof information | null>(null);

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Keep newsletter interest locally until a mailing service is connected.
    try {
      localStorage.setItem(STORAGE_KEYS.NEWSLETTER_INTEREST, email.trim());
      notify.success(MESSAGES.NEWSLETTER_SAVED);
      setEmail("");
    } catch {
      notify.error(MESSAGES.STORAGE_ERROR);
    }
  }

  return (
    <footer className="store-footer">
      <div className="store-container footer-main">
        <div className="footer-brand-column">
          <LinkCommon to="/" className="store-brand">
            <Sprout aria-hidden="true" />
            <span>{LABELS.common.BRAND}</span>
            <span className="brand-dot" aria-hidden="true">
              {LABELS.common.REGISTERED}
            </span>
          </LinkCommon>
          <p>{LABELS.footer.DESCRIPTION}</p>
          <ButtonCommon
            variant="unstyled"
            className="footer-support"
            type="button"
            onClick={() => setPanel("shopping")}
          >
            {LABELS.footer.SUPPORT}
            <ArrowRight size={13} />
          </ButtonCommon>
        </div>
        <div className="footer-link-column">
          <h2>{LABELS.footer.EXPLORE}</h2>
          <LinkCommon to="/catalog">{LABELS.footer.ALL_PLANTS}</LinkCommon>
          <LinkCommon to="/catalog?search=ch%E1%BA%ADu">
            {LABELS.navigation.ACCESSORIES}
          </LinkCommon>
          <ButtonCommon
            variant="unstyled"
            type="button"
            onClick={() => setPanel("about")}
          >
            {LABELS.footer.ABOUT}
          </ButtonCommon>
          <LinkCommon href="/#plant-care">{LABELS.footer.CARE}</LinkCommon>
        </div>
        <div className="footer-link-column">
          <h2>{LABELS.footer.INFORMATION}</h2>
          <ButtonCommon
            variant="unstyled"
            type="button"
            onClick={() => setPanel("shipping")}
          >
            {LABELS.footer.SHIPPING}
          </ButtonCommon>
          <ButtonCommon
            variant="unstyled"
            type="button"
            onClick={() => setPanel("shopping")}
          >
            {LABELS.footer.SHOPPING}
          </ButtonCommon>
          <ButtonCommon
            variant="unstyled"
            type="button"
            onClick={() => setPanel("privacy")}
          >
            {LABELS.footer.PRIVACY}
          </ButtonCommon>
          <ButtonCommon
            variant="unstyled"
            type="button"
            onClick={() => setPanel("shopping")}
          >
            {LABELS.footer.CONTACT}
          </ButtonCommon>
        </div>
        <div className="footer-newsletter">
          <h2>{LABELS.footer.NEWSLETTER_TITLE}</h2>
          <p>{LABELS.footer.NEWSLETTER_DESCRIPTION}</p>
          <FormCommon onSubmit={handleSubscribe} className="newsletter-form">
            <TextFieldCommon
              variant="unstyled"
              label={LABELS.footer.EMAIL}
              hideLabel
              id="newsletter-email"
              type="email"
              autoComplete="email"
              placeholder={LABELS.footer.EMAIL}
              required
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <ButtonCommon
              variant="unstyled"
              type="submit"
              aria-label={LABELS.footer.SUBSCRIBE}
            >
              <ArrowRight size={18} />
            </ButtonCommon>
          </FormCommon>
        </div>
      </div>
      <div className="store-container footer-bottom">
        <p>
          {LABELS.common.COPYRIGHT} {new Date().getFullYear()}{" "}
          {LABELS.footer.COPYRIGHT_SUFFIX}
        </p>
        <p>{LABELS.footer.MADE_IN}</p>
      </div>
      <ModalCommon
        open={panel !== null}
        onClose={() => setPanel(null)}
        title={panel ? information[panel].title : LABELS.footer.DIALOG_TITLE}
      >
        <p className="information-copy">
          {panel ? information[panel].text : ""}
        </p>
      </ModalCommon>
    </footer>
  );
}
