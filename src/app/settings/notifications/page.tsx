
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Mail, MessageSquare } from "lucide-react";

const notificationSettings = [
    { id: "incidents", label: "New Incidents", description: "Notify when a new incident is created." },
    { id: "critical_alerts", label: "Critical Alerts", description: "High-priority alerts that need immediate attention." },
    { id: "maintenance", label: "Maintenance Windows", description: "Announcements about scheduled maintenance." },
    { id: "product_updates", label: "Product Updates", description: "News and updates about the Pandora platform." },
];

export default function SettingsNotificationsPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-lg text-primary"><Bell /></div>
        <div>
            <h1 className="text-2xl font-bold font-headline">Notifications</h1>
            <p className="text-muted-foreground">Manage how you receive alerts and updates.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Choose which email notifications you want to receive at <span className="font-medium">user@pandora.dev</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationSettings.map(setting => (
             <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                    <Label htmlFor={setting.id} className="font-semibold">{setting.label}</Label>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
                <Switch id={setting.id} defaultChecked={setting.id !== 'product_updates'} />
             </div>
          ))}
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Other Channels</CardTitle>
          <CardDescription>
            Connect other platforms to receive notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">user@pandora.dev</p>
                      <p className="text-sm text-green-600">Primary email</p>
                    </div>
                </div>
                <Button variant="outline" disabled>Manage</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">Slack</p>
                      <p className="text-sm text-muted-foreground">Not connected</p>
                    </div>
                </div>
                <Button variant="secondary">Connect</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
