import { LABELS } from "@/constants/labels";
import { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { ButtonCommon } from "./ButtonCommon";
import { notify } from "@/services/notifications";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
    notify.error(LABELS.common.ERROR_TITLE);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[320px] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-surface-200 rounded-md p-6 text-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-surface-900">
                {LABELS.common.ERROR_TITLE}
              </h3>
              <p className="text-xs text-surface-500 mt-1">
                {this.state.error?.message || LABELS.common.ERROR_DESCRIPTION}
              </p>
            </div>
            <ButtonCommon
              variant="outline"
              size="sm"
              onClick={this.handleReset}
              className="mx-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {LABELS.common.RELOAD}
            </ButtonCommon>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
