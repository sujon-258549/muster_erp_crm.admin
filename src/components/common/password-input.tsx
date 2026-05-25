import { forwardRef, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Props = React.ComponentProps<typeof Input>

const PasswordInput = forwardRef<HTMLInputElement, Props>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = useState(false)

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn("pr-10", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          tabIndex={-1}
          className="absolute right-2 top-1/2 -translate-y-1/2 grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    )
  },
)

PasswordInput.displayName = "PasswordInput"

export default PasswordInput
