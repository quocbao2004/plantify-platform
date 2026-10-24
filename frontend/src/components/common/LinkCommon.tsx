import { forwardRef, type AnchorHTMLAttributes } from "react";
import { Link, type LinkProps } from "react-router-dom";
import {
  buttonCommonClassName,
  type ButtonVariant,
  type ButtonSize,
} from "./ButtonCommon";

type Appearance = { variant?: ButtonVariant; size?: ButtonSize };
export type LinkCommonProps = Appearance &
  (LinkProps | (AnchorHTMLAttributes<HTMLAnchorElement> & { to?: never }));

/** Navigation keeps anchor semantics while sharing button/link styles. */
export const LinkCommon = forwardRef<HTMLAnchorElement, LinkCommonProps>(
  (
    {
      variant = "unstyled",
      size = variant === "unstyled" ? "unstyled" : "md",
      className,
      ...props
    },
    ref,
  ) => {
    const styles = buttonCommonClassName({ variant, size, className });
    return "to" in props && props.to !== undefined ? (
      <Link {...(props as LinkProps)} ref={ref} className={styles} />
    ) : (
      <a
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
        ref={ref}
        className={styles}
      />
    );
  },
);
LinkCommon.displayName = "LinkCommon";
