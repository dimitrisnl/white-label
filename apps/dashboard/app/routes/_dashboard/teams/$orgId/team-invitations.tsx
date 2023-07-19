import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from 'ui-core';

export function TeamInvitations() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a team member</CardTitle>
        <CardDescription>
          Provide the email address of the person you would like to invite to
          this team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="new-member-email">Email</Label>
          <Input
            id="new-member-email"
            name="new-member-email"
            placeholder=""
            type="email"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button>Invite</Button>
      </CardFooter>
    </Card>
  );
}
