import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Briefcase } from "lucide-react";
import Link from "next/link";

export function BusinessOrPersonalForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Select account type to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex items-center justify-center gap-3 w-full"
              asChild>
              <Link href="/login/business-or-personal/personal">
                <User className="w-5 h-5" />
                Personal Use
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex items-center justify-center gap-3 w-full"
              asChild>
              <Link href="/login/business-or-personal/business">
                <Briefcase className="w-5 h-5" />
                Business Use
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
