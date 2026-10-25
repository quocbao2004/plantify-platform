import { ButtonCommon } from "@/components/common/ButtonCommon";
import { FormCommon } from "@/components/common/FormCommon";
import { LinkCommon } from "@/components/common/LinkCommon";
import { LABELS } from "@/constants/labels";
import { useState, type FormEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Sprout,
  ShoppingBag,
  UserRound,
  Search,
  Menu,
  X,
  LogOut,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { TextFieldCommon } from "@/components/common/TextFieldCommon";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { SEARCH_SUGGESTIONS } from "@/constants/labels";
import { ModalCommon } from "@/components/common/ModalCommon";

export function Header() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useLogout();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearchOpen(false);
    setMenuOpen(false);
    navigate(
      search.trim()
        ? `/catalog?search=${encodeURIComponent(search.trim())}`
        : "/catalog",
    );
  }

  return (
    <>
      <LinkCommon className="skip-link" href="#main-content">
        {LABELS.navigation.SKIP_CONTENT}
      </LinkCommon>
      <header className="store-header">
        <div className="store-container header-inner">
          <LinkCommon
            to="/"
            className="store-brand"
            aria-label={LABELS.navigation.BRAND_HOME}
            onClick={() => setMenuOpen(false)}
          >
            <Sprout aria-hidden="true" />
            <span>{LABELS.common.BRAND}</span>
            <span className="brand-dot" aria-hidden="true">
              {LABELS.common.REGISTERED}
            </span>
          </LinkCommon>
          <nav
            className="desktop-navigation"
            aria-label={LABELS.navigation.MAIN}
          >
            <NavLink to="/" end>
              {LABELS.navigation.HOME}
            </NavLink>
            <NavLink to="/catalog">{LABELS.navigation.PLANTS}</NavLink>
            <LinkCommon to="/catalog?search=ch%E1%BA%ADu">
              {LABELS.navigation.ACCESSORIES}
            </LinkCommon>
            <LinkCommon href="/#featured">
              {LABELS.navigation.OFFERS}
            </LinkCommon>
            <LinkCommon href="/#plant-care">
              {LABELS.navigation.CARE}
            </LinkCommon>
            {user?.role === "ADMIN" ? (
              <NavLink to="/admin">{LABELS.navigation.ADMIN}</NavLink>
            ) : null}
          </nav>
          <div className="header-actions">
            <ButtonCommon
              variant="unstyled"
              className="store-icon-button"
              type="button"
              aria-label={LABELS.navigation.SEARCH}
              onClick={() => setSearchOpen(true)}
            >
              <Search size={19} />
            </ButtonCommon>
            <LinkCommon
              className="store-icon-button account-link"
              to={isAuthenticated ? "/orders" : "/login"}
              aria-label={
                isAuthenticated
                  ? LABELS.navigation.ACCOUNT_ORDERS
                  : LABELS.navigation.LOGIN
              }
              title={user?.full_name || LABELS.navigation.ACCOUNT}
            >
              <UserRound size={19} />
            </LinkCommon>
            <LinkCommon
              to="/cart"
              className="store-icon-button cart-link"
              aria-label={LABELS.navigation.CART}
            >
              <ShoppingBag size={20} />
            </LinkCommon>
            {isAuthenticated ? (
              <ButtonCommon
                variant="unstyled"
                className="store-icon-button logout-button"
                type="button"
                aria-label={LABELS.navigation.LOGOUT}
                onClick={logout}
              >
                <LogOut size={18} />
              </ButtonCommon>
            ) : null}
            <ButtonCommon
              variant="unstyled"
              className="store-icon-button mobile-menu-toggle"
              type="button"
              aria-label={
                menuOpen
                  ? LABELS.navigation.CLOSE_MENU
                  : LABELS.navigation.OPEN_MENU
              }
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </ButtonCommon>
          </div>
        </div>
        {menuOpen ? (
          <nav
            id="mobile-navigation"
            className="mobile-navigation"
            aria-label={LABELS.navigation.MOBILE}
            onClick={() => setMenuOpen(false)}
          >
            <LinkCommon to="/">{LABELS.navigation.HOME}</LinkCommon>
            <LinkCommon to="/catalog">{LABELS.navigation.PLANTS}</LinkCommon>
            <LinkCommon to="/catalog?search=ch%E1%BA%ADu">
              {LABELS.navigation.ACCESSORIES}
            </LinkCommon>
            <LinkCommon href="/#featured">
              {LABELS.navigation.OFFERS}
            </LinkCommon>
            <LinkCommon href="/#plant-care">
              {LABELS.navigation.CARE}
            </LinkCommon>
            <LinkCommon to="/rentals">{LABELS.navigation.RENTALS}</LinkCommon>
            {user?.role === "ADMIN" ? (
              <LinkCommon to="/admin">{LABELS.navigation.ADMIN}</LinkCommon>
            ) : null}
          </nav>
        ) : null}
      </header>
      <ModalCommon
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        title={LABELS.navigation.SEARCH_TITLE}
      >
        <p className="dialog-intro">{LABELS.navigation.SEARCH_INTRO}</p>
        <FormCommon className="store-search-form" onSubmit={handleSearch}>
          <TextFieldCommon
            variant="unstyled"
            label={LABELS.navigation.SEARCH_FIELD}
            hideLabel
            id="store-search"
            type="search"
            placeholder={LABELS.navigation.SEARCH_PLACEHOLDER}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            autoFocus
          />
          <ButtonCommon
            variant="unstyled"
            className="store-primary-button"
            type="submit"
            aria-label={LABELS.navigation.SEARCH_SUBMIT}
          >
            <ArrowRight size={20} />
          </ButtonCommon>
        </FormCommon>
        <div className="search-suggestions">
          <span>{LABELS.navigation.SEARCH_SUGGESTIONS}</span>
          {SEARCH_SUGGESTIONS.map((name) => (
            <LinkCommon
              key={name}
              to={`/catalog?search=${encodeURIComponent(name)}`}
              onClick={() => setSearchOpen(false)}
            >
              {name}
            </LinkCommon>
          ))}
        </div>
      </ModalCommon>
    </>
  );
}
