
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, Loader2, Star } from "lucide-react";
import { useUser, useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, limit, orderBy } from "firebase/firestore";
import type { Role, AuditEvent, FavoriteAction, UserProfile } from "@/lib/data-types";
import { fmtRel } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

export default function ProfilePage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userQuery = useMemoFirebase(() => (user && firestore) ? query(collection(firestore, 'users'), where('id', '==', user.uid), limit(1)) : null, [user, firestore]);
  const { data: userData, isLoading: userLoading } = useCollection<UserProfile>(userQuery);
  const profile = userData?.[0];

  const rolesQuery = useMemoFirebase(() => (firestore) ? collection(firestore, 'roles') : null, [firestore]);
  const { data: rolesData, isLoading: rolesLoading } = useCollection<Role>(rolesQuery);
  
  const userRole = rolesData?.find(r => r.id === profile?.roleId);

  const auditLogQuery = useMemoFirebase(() => (user && firestore) ? query(collection(firestore, 'auditLogs'), where('actor.id', '==', user.uid), orderBy('ts', 'desc'), limit(5)) : null, [user, firestore]);
  const { data: recentActivity, isLoading: activityLoading } = useCollection<AuditEvent>(auditLogQuery);

  const favoritesQuery = useMemoFirebase(() => (user && firestore) ? query(collection(firestore, 'users', user.uid, 'favoriteActions'), orderBy('timestamp', 'desc'), limit(3)) : null, [user, firestore]);
  const { data: favorites, isLoading: favoritesLoading } = useCollection<FavoriteAction>(favoritesQuery);

  const placeholderAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');
  const userAvatar = user?.photoURL || placeholderAvatar?.imageUrl;

  const isLoading = userLoading || rolesLoading || activityLoading || favoritesLoading;

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl shadow-lg overflow-hidden">
        <div className="h-24 bg-muted" />
        <CardContent className="p-6 pt-0">
          <div className="flex flex-col items-center md:flex-row md:items-end -mt-16 gap-6">
            <Avatar className="h-32 w-32 border-4 border-background">
                {userAvatar && <Image src={userAvatar} alt="User Avatar" width={128} height={128} />}
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
            <CardHeader><CardTitle>Activity Feed</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {(recentActivity || []).map((item, index) => (
                  <li key={item.id}>
                    <div className="flex items-start gap-4">
                        {item.result === 'success' ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                        ) : (
                            <Clock className="h-5 w-5 text-red-500 mt-1" />
                        )}
                        <div className="flex-grow">
                            <p className="text-sm">
                                {item.action} <span className="font-semibold">{item.resource?.name || item.tool}</span>
                            </p>
                        </div>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">{fmtRel(item.ts)}</p>
                    </div>
                    {index < (recentActivity || []).length - 1 && <Separator className="mt-4" />}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-lg">
            <CardHeader><CardTitle>Favorite Actions</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-3">
                  {(favorites || []).map(fav => (
                    <li key={fav.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <div className="flex-grow">
                            <p className="font-medium text-sm">{fav.prompt || fav.tool}</p>
                            <p className="text-xs text-muted-foreground">Saved {fmtRel(fav.timestamp.toString())}</p>
                        </div>
                        <Button variant="ghost" size="sm">Run</Button>
                    </li>
                  ))}
                  {(!favorites || favorites.length === 0) && (
                     <p className="text-sm text-muted-foreground text-center py-4">No favorite actions saved yet.</p>
                  )}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl shadow-lg">
            <CardHeader><CardTitle>Statistics</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-xl">
                  <p className="text-sm text-muted-foreground">Tools Run</p>
                  <p className="text-2xl font-semibold">{(recentActivity || []).filter(a => a.tool).length}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-xl">
                  <p className="text-sm text-muted-foreground">Incidents</p>
                  <p className="text-2xl font-semibold">0</p>
                </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-lg">
            <CardHeader><CardTitle>Roles & Permissions</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {userRole ? <Badge className="rounded-md text-base" variant={userRole.name === 'Admin' ? 'destructive' : 'secondary'}>{userRole.name}</Badge>
               : <Badge className="rounded-md text-base">No role assigned</Badge>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

    