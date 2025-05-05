"use client";

import BlogGenOverview from "../components/content-gen/wizard/BlogGenOverview";
import BlogGenPreview from "../components/content-gen/wizard/BlogGenPreview";
import CopyWritingMobile from "../components/CopyWritingMobile";
import { useBlogGenWizardStore } from "../lib/stores/blogGenWizard-store";

export default function CopywritterPage() {
  const { step } = useBlogGenWizardStore();

  switch (step) {
    case 1:
      return <BlogGenOverview />;
    case 2:
      return <BlogGenPreview />;
  }
  return (
    <>
      <div className="hidden desktop:block">
        {step === 1 ? <BlogGenOverview /> : <BlogGenPreview />}
      </div>
      <div className="block desktop:hidden">
        <CopyWritingMobile />
      </div>
    </>
  );
}
