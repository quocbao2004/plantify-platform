import { ButtonCommon } from "@/components/common/ButtonCommon";
import { FormCommon } from "@/components/common/FormCommon";
import { LinkCommon } from "@/components/common/LinkCommon";
import { DropdownCommon } from "@/components/common/DropdownCommon";
import { TextFieldCommon } from "@/components/common/TextFieldCommon";
import { ModalCommon } from "@/components/common/ModalCommon";
import { LABELS, SEARCH_SUGGESTIONS } from "@/constants/labels";
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
  Inbox,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useLogout } from "@/features/auth/hooks/useAuth";

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
        <div className="w-full px-6 sm:px-10 lg:px-12 header-inner">
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
              to="/cart"
              className="store-icon-button cart-link"
              aria-label={LABELS.navigation.CART}
            >
              <ShoppingBag size={20} />
            </LinkCommon>

            {isAuthenticated ? (
              <DropdownCommon
                align="right"
                trigger={
                  <span
                    className="inline-flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                    aria-label={user?.full_name || user?.email || LABELS.navigation.ACCOUNT}
                    title={user?.full_name || user?.email || LABELS.navigation.ACCOUNT}
                  >
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name || user.email}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-surface-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-brand-sage/80 text-brand font-semibold text-xs flex items-center justify-center ring-1 ring-brand/20">
                        {user?.full_name ? (
                          user.full_name
                            .trim()
                            .split(" ")
                            .filter(Boolean)
                            .slice(-2)
                            .map((w) => w[0])
                            .join("")
                            .toUpperCase()
                        ) : (
                          <UserRound size={17} />
                        )}
                      </div>
                    )}
                  </span>
                }
              >
                {/* Account info header */}
                <div className="px-4 py-2.5 border-b border-surface-100 bg-surface-50/60 rounded-t-xl">
                  <p className="text-[11px] font-semibold tracking-wider uppercase text-brand">
                    {LABELS.navigation.ACCOUNT}
                  </p>
                  <p className="text-sm font-semibold text-brand-dark truncate mt-0.5">
                    {user?.full_name || user?.email}
                  </p>
                  {user?.full_name && (
                    <p className="text-xs text-surface-400 truncate mt-0.5">
                      {user?.email}
                    </p>
                  )}
                </div>

                {/* Main options: Hồ sơ tài khoản, Đơn hàng */}
                <div className="py-1">
                  <LinkCommon
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-surface-700 hover:text-brand hover:bg-brand-sage/50 transition-colors w-full"
                  >
                    <UserRound size={16} className="text-surface-500" />
                    <span>{LABELS.navigation.PROFILE}</span>
                  </LinkCommon>

                  <LinkCommon
                    to="/orders"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-surface-700 hover:text-brand hover:bg-brand-sage/50 transition-colors w-full"
                  >
                    <ShoppingBag size={16} className="text-surface-500" />
                    <span>{LABELS.navigation.ORDERS}</span>
                  </LinkCommon>
                </div>

                {/* Logout option */}
                <div className="pt-1 border-t border-surface-100">
                  <ButtonCommon
                    variant="unstyled"
                    type="button"
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut size={16} className="text-red-500" />
                    <span>{LABELS.navigation.LOGOUT}</span>
                  </ButtonCommon>
                </div>
              </DropdownCommon>
            ) : (
              <LinkCommon
                to="/login"
                variant="brand"
                size="sm"
                className="rounded-full px-4 text-xs font-semibold whitespace-nowrap ml-1 shadow-sm"
              >
                {LABELS.navigation.LOGIN}
              </LinkCommon>
            )}

            {isAuthenticated && user?.role === "ADMIN" ? (
              <div className="flex items-center pl-3 sm:pl-4 ml-2 sm:ml-3 border-l border-surface-200/80">
                <LinkCommon
                  to="/admin"
                  className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand/10 text-brand border border-brand/25 hover:bg-brand hover:text-white hover:border-brand shadow-xs transition-all duration-200 text-xs font-semibold group"
                  aria-label={LABELS.navigation.ADMIN_PANEL}
                  title={LABELS.navigation.ADMIN_PANEL}
                >
                  <span className="relative flex items-center justify-center">
                    <Inbox size={17} className="transition-transform group-hover:scale-110" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </span>
                  <span className="hidden md:inline tracking-tight font-medium">
                    {LABELS.navigation.ADMIN}
                  </span>
                </LinkCommon>
              </div>
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
            {isAuthenticated ? (
              <>
                {user?.role === "ADMIN" ? (
                  <LinkCommon to="/admin" className="font-semibold text-brand">
                    {LABELS.navigation.ADMIN_PANEL}
                  </LinkCommon>
                ) : null}
                <LinkCommon to="/profile">
                  {LABELS.navigation.PROFILE}
                </LinkCommon>
                <LinkCommon to="/orders">{LABELS.navigation.ORDERS}</LinkCommon>
                <ButtonCommon
                  variant="unstyled"
                  type="button"
                  onClick={logout}
                  className="text-left py-2 text-red-600 hover:text-red-700"
                >
                  {LABELS.navigation.LOGOUT}
                </ButtonCommon>
              </>
            ) : (
              <LinkCommon to="/login">{LABELS.navigation.LOGIN}</LinkCommon>
            )}
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
