"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function Notifications() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasNotifications, setHasNotifications] = useState(true)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 relative">
          <Bell className="h-4 w-4" />
          {hasNotifications && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex flex-col space-y-4 p-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Notifications</h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground"
              onClick={() => setHasNotifications(false)}
            >
              Mark all as read
            </Button>
          </div>
          <div className={cn("flex flex-col space-y-2")}>
            {/* Placeholder for notifications */}
            <div className="rounded-md bg-muted p-3">
              <div className="flex items-start justify-between">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">New quiz attempt</p>
                  <p className="text-xs text-muted-foreground">Someone completed your "Product Knowledge" quiz</p>
                </div>
                <span className="text-xs text-muted-foreground">5m ago</span>
              </div>
            </div>
            <div className="rounded-md p-3">
              <div className="flex items-start justify-between">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Quiz published</p>
                  <p className="text-xs text-muted-foreground">Your "Customer Feedback" quiz is now live</p>
                </div>
                <span className="text-xs text-muted-foreground">2h ago</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" size="sm">
              View all notifications
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
