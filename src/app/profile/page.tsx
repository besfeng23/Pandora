
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, Loader2 } from "lucide-react";
import { useUser, useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, limit } from "firebase/firestore";
import type { Role, AuditEvent, FavoriteAction } from "@/lib/data-types";

const recentActivity = [
  { id: 1, action: "Rotated API key for", target: "GitHub Integration", time: "2h ago", success: true },
  { id: 2, action: "Ran tool", target: "Scale Production Workers", time: "5h ago", success: true },
  { id: 3, action: "Acknowledged incident", target: "#INC-1204", time: "1d ago", success: true },
  { id: 4, action: "Failed to run tool", target: "Purge CDN Cache", time: "2d ago", success: false },
];

export default function ProfilePage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userQuery = useMemoFirebase(() => (user && firestore) ? query(collection(firestore, 'users'), where('id', '==', user.uid), limit(1)) : null, [user, firestore]);
  const { data: userData, isLoading: userLoading } = useCollection<any>(userQuery);
  const profile = userData?.[0];

  const rolesQuery = useMemoFirebase(() => (firestore) ? collection(firestore, 'roles') : null, [firestore]);
  const { data: rolesData, isLoading: rolesLoading } = useCollection<Role>(rolesQuery);
  
  const userRole = rolesData?.find(r => r.id === profile?.roleId);

  if (userLoading || rolesLoading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl shadow-lg overflow-hidden">
        <div className="h-24 bg-muted" />
        <CardContent className="p-6 pt-0">
          <div className="flex flex-col items-center md:flex-row md:items-end -mt-16 gap-6">
            <Avatar className="h-32 w-32 border-4 border-background">
                {user?.photoURL && <AvatarImage src={user.photoURL} alt="User Avatar" />}
                <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-3xl font-bold font-headline">{user?.displayName || 'Pandora User'}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
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
                <div className="p-3 bg-muted/50 rounded-xl">
                  <p className="text-sm text-muted-foreground">Tools Run</p>
                  <p className="text-2xl font-semibold">0</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-xl">
                  <p className="text-sm text-muted-foreground">Avg. Response</p>
                  <p className="text-2xl font-semibold">N/A</p>
                </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {userRole && <Badge className="rounded-md text-base" variant={userRole.name === 'Admin' ? 'destructive' : 'secondary'}>{userRole.name}</Badge>}
              {!userRole && <Badge className="rounded-md text-base">No role assigned</Badge>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
