
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const users = [
  {
    name: "Alex Rivera",
    email: "alex@pandora.dev",
    role: "Admin",
    lastActive: "2h ago",
    avatar: "/avatars/01.png",
  },
  {
    name: "Samantha Bee",
    email: "samantha@pandora.dev",
    role: "Developer",
    lastActive: "15m ago",
    avatar: "/avatars/02.png",
  },
  {
    name: "George Costanza",
    email: "george@pandora.dev",
    role: "Viewer",
    lastActive: "3d ago",
    avatar: "/avatars/03.png",
  },
  {
    name: "pending-invite@pandora.dev",
    email: "pending-invite@pandora.dev",
    role: "Developer",
    lastActive: "Pending",
    avatar: "",
  },
];

const roleColors: { [key: string]: "default" | "secondary" | "destructive" } = {
  Admin: "destructive",
  Developer: "secondary",
  Viewer: "default",
};

export default function SettingsAccessTab() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Access Management</CardTitle>
        </div>
        <Button>Invite user</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.email}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={roleColors[user.role]} className="rounded-md">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.lastActive}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
