import CopyWritingMobile from "../components/CopyWritingMobile";

export default function CopywritterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="block desktop:hidden">
        <CopyWritingMobile />
      </div>
      <div className="hidden desktop:block">{children}</div>
    </>
  );
}
