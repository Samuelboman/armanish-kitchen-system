import { Link } from "react-router";
import { SearchX } from "lucide-react";
import Button from "../components/ui/Button";
import StatusMessage from "../components/ui/StatusMessage";
import { usePageTitle } from "../hooks/usePageTitle";

export default function NotFoundPage() {
  usePageTitle("Page not found");
  return (
    <div className="px-4 py-16">
      <StatusMessage
        icon={SearchX}
        title="We couldn't find that page"
        actions={
          <Button as={Link} to="/">
            Go to the menu
          </Button>
        }
      >
        The link may be old or mistyped.
      </StatusMessage>
    </div>
  );
}
