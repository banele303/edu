import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Bell, BellOff, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import { formatDistanceToNow } from "date-fns";

const typeColors: Record<string, string> = {
  exam: "bg-blue-500",
  attendance: "bg-amber-500",
  fee: "bg-red-500",
  assignment: "bg-purple-500",
  message: "bg-green-500",
  badge: "bg-yellow-500",
  announcement: "bg-primary",
};

export function NotificationBell() {
  const notifications = useQuery(api.notifications.getMyNotifications);
  const unreadCount = useQuery(api.notifications.getUnreadCount);
  const markRead = useMutation(api.notifications.markAsRead);
  const markAll = useMutation(api.notifications.markAllAsRead);
  const navigate = useNavigate();

  const handleClick = async (n: any) => {
    if (!n.isRead) await markRead({ id: n._id });
    if (n.link) navigate(n.link);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {!!unreadCount && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="flex items-center justify-between px-3 py-2">
          <DropdownMenuLabel className="p-0 text-base font-semibold">
            Notifications
          </DropdownMenuLabel>
          {!!unreadCount && unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={() => markAll()}
            >
              <CheckCheck className="h-3 w-3" /> Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[400px]">
          {!notifications || notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground gap-2">
              <BellOff className="h-8 w-8" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((n) => (
                <button
                  key={n._id}
                  className={cn(
                    "w-full text-left px-3 py-3 hover:bg-muted/60 transition-colors flex gap-3",
                    !n.isRead && "bg-primary/5"
                  )}
                  onClick={() => handleClick(n)}
                >
                  <div
                    className={cn(
                      "mt-1 h-2 w-2 rounded-full flex-shrink-0",
                      typeColors[n.type] || "bg-primary",
                      n.isRead && "opacity-30"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium truncate", n.isRead && "text-muted-foreground")}>
                      {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      {formatDistanceToNow(new Date(n._creationTime), { addSuffix: true })}
                    </p>
                  </div>
                  {!n.isRead && (
                    <Check className="h-3 w-3 text-primary flex-shrink-0 mt-1" />
                  )}
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
