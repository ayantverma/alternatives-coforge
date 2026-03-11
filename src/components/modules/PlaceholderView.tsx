import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Construction } from "lucide-react";

interface PlaceholderViewProps {
  title: string;
  description: string;
}

const PlaceholderView = ({ title, description }: PlaceholderViewProps) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] animate-fade-in">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted mx-auto mb-4">
            <Construction className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-display mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          <Badge variant="secondary" className="mt-4 text-xs">Coming Soon</Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceholderView;
