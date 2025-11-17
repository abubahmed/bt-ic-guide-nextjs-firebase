"use client";

import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export default function GoogleButton({
  router,
  loading,
  setLoading,
  signInWithGoogleAction,
}: {
  router: any;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  signInWithGoogleAction: (router: any) => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-11 w-full rounded-xl border border-sky-100 text-sm font-semibold text-sky-600 hover:text-sky-800 hover:bg-sky-50"
      onClick={async (e) => {
        e.preventDefault();
        setLoading(true);
        await signInWithGoogleAction(router);
        setLoading(false);
      }}>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-2 h-5 w-5">
        <path
          d="M21.6 12.227c0-.815-.074-1.6-.212-2.353H12v4.432h5.382a4.6 4.6 0 01-1.99 3.017v2.503h3.217c1.885-1.736 2.99-4.29 2.99-7.599z"
          fill="#4285F4"
        />
        <path
          d="M12 22c2.7 0 4.968-.893 6.624-2.376l-3.217-2.503c-.893.6-2.037.956-3.407.956-2.619 0-4.832-1.768-5.622-4.144H3.04v2.608A9.996 9.996 0 0012 22z"
          fill="#34A853"
        />
        <path
          d="M6.378 13.933A5.996 5.996 0 015.976 12c0-.672.116-1.325.402-1.933V7.459H3.04A9.996 9.996 0 002 12c0 1.588.38 3.085 1.04 4.541l3.338-2.608z"
          fill="#FBBC05"
        />
        <path
          d="M12 6.5c1.468 0 2.784.505 3.825 1.498l2.868-2.868C16.96 3.408 14.7 2.5 12 2.5 8.042 2.5 4.614 4.843 3.04 7.459l3.338 2.608C7.168 8.268 9.381 6.5 12 6.5z"
          fill="#EA4335"
        />
      </svg>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue with Google"}
    </Button>
  );
}
