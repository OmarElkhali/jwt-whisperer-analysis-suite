
import { Check as CheckIcon } from "lucide-react";

export const Check = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof CheckIcon>) => {
  return <CheckIcon className={className} {...props} />;
};
