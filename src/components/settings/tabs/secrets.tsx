
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SettingsSecretsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Secrets Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Manage secret references and rotation policies.</p>
      </CardContent>
    </Card>
  );
}
