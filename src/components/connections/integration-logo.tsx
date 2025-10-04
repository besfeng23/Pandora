
"use client";

import {
  Github,
  FileJson,
  Cloud,
  Bot,
  Blocks,
  Database,
  FileText,
  Component,
  type LucideProps
} from "lucide-react";
import { SiNotion, SiSlack } from "@icons-pack/react-simple-icons";

const logos: { [key: string]: React.ElementType } = {
  Github,
  OpenAI: Bot,
  Gcp: Cloud,
  Linear: Blocks,
  Firebase: Component,
  Neon: Database,
  Notion: SiNotion,
  Slack: SiSlack,
  Default: FileJson,
};

export const IntegrationLogo = ({ name, ...props }: { name: string } & LucideProps) => {
  const LogoComponent = logos[name] || logos.Default;
  return <LogoComponent {...props} />;
};
