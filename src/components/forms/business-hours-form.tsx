"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from "react-hot-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

const weekdays: Weekday[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type BusinessHour = {
  day: Weekday;
  is247: boolean;
  from: string;
  to: string;
};

export function BusinessHoursForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [hours, setHours] = useState<BusinessHour[]>(
    weekdays.map((day) => ({
      day,
      is247: false,
      from: "09:00",
      to: "17:00",
    }))
  );

  const handleChange = (
    index: number,
    field: "from" | "to" | "is247",
    value: string | boolean
  ) => {
    setHours((prev) => {
      const updated = [...prev];
      const item = { ...updated[index] };

      if (field === "is247") {
        item.is247 = value as boolean;
      } else {
        item[field] = value as string;
      }

      updated[index] = item;
      return updated;
    });
  };

  const isValidTimeRange = (from: string, to: string) => from < to;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const invalidDay = hours.find(
      (h) => !h.is247 && !isValidTimeRange(h.from, h.to)
    );

    if (invalidDay) {
      toast.error(
        `Invalid time on ${invalidDay.day}: "From" must be earlier than "To".`,
        { duration: 4000 }
      );
      return;
    }

    toast.success("Business hours saved!");
    console.log("Business hours:", hours);
    // Proceed to next step...
  };

  return (
    <>
      <Toaster></Toaster>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Set Business Hours</CardTitle>
            <CardDescription>
              Specify your availability per day or use 24/7 mode.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-4 items-center gap-4 text-sm font-medium text-muted-foreground px-2">
                <div>Weekday</div>
                <div>24/7</div>
                <div>From</div>
                <div>To</div>
              </div>

              <div className="space-y-4">
                {hours.map((entry, index) => (
                  <div
                    key={entry.day}
                    className="grid grid-cols-4 items-center gap-4 px-2">
                    <Label>{entry.day}</Label>

                    <input
                      type="checkbox"
                      checked={entry.is247}
                      onChange={(e) =>
                        handleChange(index, "is247", e.target.checked)
                      }
                      className="h-4 w-4 accent-primary"
                    />

                    <Input
                      type="time"
                      value={entry.from}
                      onChange={(e) =>
                        handleChange(index, "from", e.target.value)
                      }
                      disabled={entry.is247}
                      required={!entry.is247}
                    />

                    <Input
                      type="time"
                      value={entry.to}
                      onChange={(e) =>
                        handleChange(index, "to", e.target.value)
                      }
                      disabled={entry.is247}
                      required={!entry.is247}
                    />
                  </div>
                ))}
              </div>

              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
