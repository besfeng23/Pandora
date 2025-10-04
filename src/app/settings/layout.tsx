
"use client";

import { SettingsNav } from "@/components/settings/settings-nav";
import Header from "@/components/layout/header";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 md:col-span-3">
        <SettingsNav />
      </div>
      <div className="col-span-12 md:col-span-9">{children}</div>
    </div>
  );
}
