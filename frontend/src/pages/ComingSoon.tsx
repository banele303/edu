import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Construction } from "lucide-react";

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] space-y-6 text-center p-6">
      <div className="bg-muted p-6 rounded-full">
        <Construction className="h-12 w-12 text-primary animate-bounce" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Feature Coming Soon</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          We're working hard to bring you this feature. This section of the Vhembe Rising Star Academy dashboard will be available in a future update.
        </p>
      </div>
      <Button onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </Button>
    </div>
  );
}
