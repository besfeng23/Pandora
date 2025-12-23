
"use client";

import {
  Blocks,
  Bot,
  Box,
  Cloud,
  Component,
  CreditCard,
  Database,
  FileJson,
  FileText,
  Github,
  type LucideProps,
} from "lucide-react";
import { SiLinear, SiNotion, SiSlack } from "@icons-pack/react-simple-icons";

const logos: { [key: string]: React.ElementType } = {
  github: Github,
  openai: Bot,
  gcp: Cloud,
  vercel: Cloud,
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

    
