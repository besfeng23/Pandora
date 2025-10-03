import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Globe } from "lucide-react";
import Image from 'next/image';

export default function IncidentGalaxy() {
  return (
    <Card className="rounded-2xl shadow-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Globe className="text-primary" />
            Incident Galaxy
        </CardTitle>
        <CardDescription>3D visualization of incidents and their relationships.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        <div className="text-center text-muted-foreground relative">
          <Image 
            src="https://picsum.photos/seed/galaxy/400/300"
            alt="Galaxy map placeholder"
            width={400}
            height={300}
            className="rounded-lg opacity-20"
            data-ai-hint="space galaxy"
          />
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-medium">3D map coming soon</p>
        </div>
      </CardContent>
    </Card>
  );
}
