import { LinkCommon } from "@/components/common/LinkCommon";
import { LABELS } from "@/constants/labels";
import React from "react";

import {
  Trees,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  CalendarCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

export const RentalListPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Introduction Banner */}
      <div className="pb-4 border-b border-surface-200">
        <h1 className="text-2xl font-bold tracking-tight text-surface-900">
          {LABELS.rentals.TITLE}
        </h1>
        <p className="text-xs text-surface-500 mt-1">
          {LABELS.rentals.DESCRIPTION}
        </p>
      </div>

      {/* Value Proposition Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="w-8 h-8 rounded bg-accent-50 text-accent-700 flex items-center justify-center mb-2">
              <RefreshCw className="w-4 h-4" />
            </div>
            <CardTitle className="text-sm">
              {LABELS.rentals.CARE_TITLE}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-surface-500">
              {LABELS.rentals.CARE_DESCRIPTION}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-8 h-8 rounded bg-accent-50 text-accent-700 flex items-center justify-center mb-2">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <CardTitle className="text-sm">
              {LABELS.rentals.TERM_TITLE}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-surface-500">
              {LABELS.rentals.TERM_DESCRIPTION}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-8 h-8 rounded bg-accent-50 text-accent-700 flex items-center justify-center mb-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <CardTitle className="text-sm">
              {LABELS.rentals.DEPOSIT_TITLE}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-surface-500">
              {LABELS.rentals.DEPOSIT_DESCRIPTION}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CTA Box */}
      <div className="p-6 rounded-md bg-white border border-surface-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-surface-900">
            {LABELS.rentals.CTA_TITLE}
          </h3>
          <p className="text-xs text-surface-500 mt-0.5">
            {LABELS.rentals.CTA_DESCRIPTION}
          </p>
        </div>
        <LinkCommon to="/catalog" variant="primary" size="sm">
          <Trees className="w-4 h-4" />
          {LABELS.rentals.CTA}
          <ArrowRight className="w-3.5 h-3.5" />
        </LinkCommon>
      </div>
    </div>
  );
};
