import React from "react";
import { useAuthStore } from "@/stores/authStore";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { LinkCommon } from "@/components/common/LinkCommon";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { LABELS } from "@/constants/labels";
import {
  UserRound,
  ShoppingBag,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const ProfilePage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="pb-4 border-b border-surface-200">
        <h1 className="text-2xl font-serif font-bold text-brand-dark">
          {LABELS.profile.TITLE}
        </h1>
        <p className="text-xs sm:text-sm text-surface-500 mt-1">
          {LABELS.profile.DESCRIPTION}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-surface-200/80 shadow-sm p-6 sm:p-8 space-y-6">
        {/* User Summary Header */}
        <div className="flex items-center gap-4 sm:gap-6 pb-6 border-b border-surface-100">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-sage/80 text-brand flex items-center justify-center font-serif text-2xl font-bold flex-shrink-0">
            {user?.full_name ? (
              user.full_name.trim().charAt(0).toUpperCase()
            ) : (
              <UserRound className="w-8 h-8" />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-brand-dark truncate">
              {user?.full_name || LABELS.profile.NOT_PROVIDED}
            </h2>
            <p className="text-sm text-surface-500 truncate mt-0.5">
              {user?.email}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {LABELS.profile.ACTIVE}
              </span>
              {user?.role === "ADMIN" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {LABELS.profile.ROLE_ADMIN}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-surface-50 border border-surface-100">
            <div className="flex items-center gap-2 text-surface-500 text-xs mb-1">
              <UserRound className="w-4 h-4" />
              <span>{LABELS.profile.FULL_NAME}</span>
            </div>
            <p className="text-sm font-medium text-surface-900">
              {user?.full_name || LABELS.profile.NOT_PROVIDED}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-50 border border-surface-100">
            <div className="flex items-center gap-2 text-surface-500 text-xs mb-1">
              <Mail className="w-4 h-4" />
              <span>{LABELS.profile.EMAIL}</span>
            </div>
            <p className="text-sm font-medium text-surface-900">
              {user?.email || LABELS.profile.NOT_PROVIDED}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-50 border border-surface-100">
            <div className="flex items-center gap-2 text-surface-500 text-xs mb-1">
              <Phone className="w-4 h-4" />
              <span>{LABELS.profile.PHONE}</span>
            </div>
            <p className="text-sm font-medium text-surface-900">
              {user?.phone_number || LABELS.profile.NOT_PROVIDED}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-50 border border-surface-100">
            <div className="flex items-center gap-2 text-surface-500 text-xs mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>{LABELS.profile.ROLE}</span>
            </div>
            <p className="text-sm font-medium text-surface-900">
              {user?.role === "ADMIN"
                ? LABELS.profile.ROLE_ADMIN
                : LABELS.profile.ROLE_CUSTOMER}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-surface-100">
          <LinkCommon
            to="/orders"
            variant="brand"
            size="md"
            className="inline-flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{LABELS.profile.VIEW_ORDERS}</span>
          </LinkCommon>

          <ButtonCommon
            variant="outline"
            size="md"
            onClick={logout}
            className="inline-flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
          >
            <LogOut className="w-4 h-4" />
            <span>{LABELS.navigation.LOGOUT}</span>
          </ButtonCommon>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
