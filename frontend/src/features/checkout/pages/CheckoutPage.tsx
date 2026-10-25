import { LABELS } from "@/constants/labels";
import React from "react";
import { ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

export const CheckoutPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-surface-200">
        <h1 className="text-2xl font-bold tracking-tight text-surface-900">
          {LABELS.checkout.TITLE}
        </h1>
        <p className="text-xs text-surface-500 mt-1">
          {LABELS.checkout.DESCRIPTION}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                {LABELS.checkout.ADDRESS_TITLE}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-surface-500">
                {LABELS.checkout.ADDRESS_DESCRIPTION}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                {LABELS.checkout.PAYMENT_TITLE}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-surface-500">
                {LABELS.checkout.PAYMENT_DESCRIPTION}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                {LABELS.checkout.SUMMARY}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-xs text-surface-600">
                <span>{LABELS.checkout.SUBTOTAL}</span>
                <span>0 ₫</span>
              </div>
              <div className="flex justify-between text-xs text-surface-600">
                <span>{LABELS.checkout.SHIPPING}</span>
                <span>0 ₫</span>
              </div>
              <div className="pt-3 border-t border-surface-100 flex justify-between font-bold text-sm text-surface-900">
                <span>{LABELS.checkout.TOTAL}</span>
                <span className="text-accent-700">0 ₫</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-2 text-xs text-surface-500 p-3 bg-surface-100/50 rounded border border-surface-200">
            <ShieldCheck className="w-4 h-4 text-accent-700 shrink-0" />
            <span>{LABELS.checkout.SECURITY}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
