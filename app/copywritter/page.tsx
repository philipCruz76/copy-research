"use client";

import CopyWritingDesktop from "../components/CopyWritingDesktop";
import CopyWritingMobile from "../components/CopyWritingMobile";

export default function CopywritterPage() {
  return (
    <>
      <div className="hidden desktop:block">
        <CopyWritingDesktop />
      </div>
      <div className="block desktop:hidden">
        <CopyWritingMobile />
      </div>
    </>
  );
}
