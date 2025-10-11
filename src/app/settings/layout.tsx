
"use client";

import { SettingsNav } from "@/components/settings/settings-nav";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="col-span-12 md:col-span-3 lg:col-span-2">
        <SettingsNav />
      </div>
      <div className="col-span-12 md:col-span-9 lg:col-span-10">{children}</div>
    </div>
  );
}

    