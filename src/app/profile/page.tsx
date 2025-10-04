
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { CheckCircle, Clock } from "lucide-react";

const userStats = [
  { label: "Tools Run", value: "1,204" },
  { label: "Incidents Resolved", value: "87" },
  { label: "Commits Pushed", value: "432" },
  { label: "Avg. Response Time", value: "24min" },
];

const recentActivity = [
  { id: 1, action: "Rotated API key for", target: "GitHub Integration", time: "2h ago", success: true },
  { id: 2, action: "Ran tool", target: "Scale Production Workers", time: "5h ago", success: true },
  { id: 3, action: "Acknowledged incident", target: "#INC-1204", time: "1d ago", success: true },
  { id: 4, action: "Failed to run tool", target: "Purge CDN Cache", time: "2d ago", success: false },
];

export default function ProfilePage() {
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl shadow-lg overflow-hidden">
        <div className="h-24 bg-muted" />
        <CardContent className="p-6 pt-0">
          <div className="flex flex-col items-center md:flex-row md:items-end -mt-16 gap-6">
            <Avatar className="h-32 w-32 border-4 border-background">
              {userAvatar && (
                <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" data-ai-hint={userAvatar.imageHint} />
              )}
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-3xl font-bold font-headline">Pandora User</h1>
              <p className="text-muted-foreground">user@pandora.dev</p>
            </div>
            <Button className="rounded-xl">Edit Profile</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle>Activity Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {recentActivity.map((item, index) => (
                  <li key={item.id}>
                    <div className="flex items-start gap-4">
                        {item.success ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                        ) : (
                            <Clock className="h-5 w-5 text-red-500 mt-1" />
                        )}
                        <div className="flex-grow">
                            <p className="text-sm">
                                {item.action} <span className="font-semibold">{item.target}</span>
                            </p>
                        </div>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</p>
                    </div>
                    {index < recentActivity.length - 1 && <Separator className="mt-4" />}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {userStats.map((stat) => (
                <div key={stat.label} className="p-3 bg-muted/50 rounded-xl">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge className="rounded-md text-base" variant="destructive">Admin</Badge>
              <Badge className="rounded-md text-base" variant="secondary">Developer</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
