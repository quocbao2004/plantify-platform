import React from "react";
import { Sprout } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-surface-200 bg-white py-8 text-surface-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent-600 text-white flex items-center justify-center">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-sm text-surface-900">Plantify Platform</span>
            <span className="text-xs text-surface-400">| Nền tảng thương mại & dịch vụ thuê cây cảnh</span>
          </div>

          <p className="text-xs text-surface-500">
            © {new Date().getFullYear()} Plantify Inc. Giữ toàn bộ quyền sở hữu trí tuệ.
          </p>
        </div>
      </div>
    </footer>
  );
};
