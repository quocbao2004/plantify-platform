import { LinkCommon } from "@/components/common/LinkCommon";
import { LABELS } from "@/constants/labels";
import React from "react";

import { ClipboardList, ArrowRight } from "lucide-react";

import { EmptyState } from "@/components/common";

export const OrderListPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-surface-200">
        <h1 className="text-2xl font-bold tracking-tight text-surface-900">
          {LABELS.orders.TITLE}
        </h1>
        <p className="text-xs text-surface-500 mt-1">
          {LABELS.orders.DESCRIPTION}
        </p>
      </div>

      <EmptyState
        icon={<ClipboardList className="w-6 h-6 text-surface-400" />}
        title={LABELS.orders.EMPTY_TITLE}
        description={LABELS.orders.EMPTY_DESCRIPTION}
        action={
          <LinkCommon to="/catalog" variant="primary" size="sm">
            {LABELS.orders.SHOP_NOW}
            <ArrowRight className="w-3.5 h-3.5" />
          </LinkCommon>
        }
      />
    </div>
  );
};
