
'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Loader2, Users } from 'lucide-react';
import type { Team, UserProfile } from '@/lib/data-types';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';


export default function SettingsTeamsPage() {
  const firestore = useFirestore();

  const teamsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'teams')) : null),
    [firestore]
  );
  const { data: teams, isLoading: teamsLoading } = useCollection<Team>(teamsQuery);
  
  const usersQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'users')) : null),
    [firestore]
  );
  const { data: users, isLoading: usersLoading } = useCollection<UserProfile>(usersQuery);
  const placeholderAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

  const isLoading = teamsLoading || usersLoading;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><Users /> Teams</CardTitle>
          <CardDescription>
            Manage your teams and team members.
          </CardDescription>
        </div>
        <Button>Create team</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
            {isLoading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (teams || []).map(team => {
                const teamMembers = users?.filter(u => u.teamId === team.id) || [];
                return (
                    <div key={team.id}>
                        <h3 className="text-lg font-semibold">{team.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{team.description}</p>
                         <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Member</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {teamMembers.map(member => {
                                        const userAvatar = member.avatar || placeholderAvatar?.imageUrl;
                                        return (
                                        <TableRow key={member.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        {userAvatar && <Image src={userAvatar} alt="Member avatar" width={32} height={32} />}
                                                        <AvatarFallback>{member.email.charAt(0).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{member.name}</p>
                                                        <p className="text-xs text-muted-foreground">{member.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{member.roleId}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">Remove</Button>
                                            </TableCell>
                                        </TableRow>
                                    )})}
                                </TableBody>
                            </Table>
                         </div>
                    </div>
                )
            })}
        </div>
      </CardContent>
    </Card>
  );
}

    