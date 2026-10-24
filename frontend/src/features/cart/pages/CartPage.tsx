import { LinkCommon } from "@/components/common/LinkCommon";
import { LABELS } from "@/constants/labels";
import React from "react";

import { ShoppingBag, ArrowRight } from "lucide-react";

import { EmptyState } from "@/components/common";

export const CartPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-surface-200">
        <h1 className="text-2xl font-bold tracking-tight text-surface-900">
          {LABELS.cart.TITLE}
        </h1>
        <p className="text-xs text-surface-500 mt-1">
          {LABELS.cart.DESCRIPTION}
        </p>
      </div>

      <EmptyState
        icon={<ShoppingBag className="w-6 h-6 text-surface-400" />}
        title={LABELS.cart.EMPTY_TITLE}
        description={LABELS.cart.EMPTY_DESCRIPTION}
        action={
          <LinkCommon to="/catalog" variant="primary" size="sm">
            {LABELS.cart.EXPLORE}
            <ArrowRight className="w-3.5 h-3.5" />
          </LinkCommon>
        }
      />
    </div>
  );
};
