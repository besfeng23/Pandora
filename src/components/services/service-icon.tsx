"use client";

import {
  Server,
  Database,
  Cloud,
  Code,
  Activity,
  ShieldCheck,
  Users,
  Webhook,
  Cpu,
  Terminal,
  FileText,
  type LucideProps,
} from "lucide-react";

const icons = {
  Server,
  Database,
  Cloud,
  Code,
  Activity,
  ShieldCheck,
  Users,
  Webhook,
  Cpu,
  Terminal,
  FileText,
};

type ServiceIconProps = LucideProps & {
  name: string;
};

export function ServiceIcon({ name, ...props }: ServiceIconProps) {
  const Icon = icons[name as keyof typeof icons] || Server;
  return <Icon {...props} />;
}
