
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
  type LucideProps,
  CreditCard,
  Box
} from "lucide-react";
import { SiNotion, SiSlack, SiLinear } from "@icons-pack/react-simple-icons";

const logos: { [key: string]: React.ElementType } = {
  github: Github,
  openai: Bot,
  gcp: Cloud,
  linear: SiLinear,
  firebase: Component,
  neon: Database,
  notion: SiNotion,
  slack: SiSlack,
  stripe: CreditCard,
  box: Box,
  default: FileJson,
};

export const IntegrationLogo = ({ name, ...props }: { name: string } & LucideProps) => {
  const LogoComponent = logos[name.toLowerCase()] || logos.default;
  return <LogoComponent {...props} />;
};
