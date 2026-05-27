import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { AlertCircle, Mail, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PasswordInput from "@/components/common/password-input"
import { useAppDispatch } from "@/redux/hooks"
import { performLogin } from "@/redux/features/auth/auth-slice"
import { useLoginMutation } from "@/redux/features/auth/auth-api"
import { ROUTES } from "@/config/paths"

interface ApiErrorBody {
  message?: string
}

interface FetchBaseQueryError {
  status?: number | string
  data?: ApiErrorBody
}

const extractErrorMessage = (err: unknown): string => {
  const fbq = err as FetchBaseQueryError
  if (fbq?.data?.message) return fbq.data.message
  if (fbq?.status === "FETCH_ERROR") return "Cannot reach the server. Is it running?"
  return "Login failed. Please check your credentials."
}

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [login, { isLoading }] = useLoginMutation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    try {
      const res = await login({ email, password }).unwrap()
      if (import.meta.env.DEV) console.log("[Login] response payload", res)

      // Accept multiple common backend field naming patterns.
      const raw = res as unknown as Record<string, unknown>
      const accessToken =
        (raw.accessToken as string) ||
        (raw.access_token as string) ||
        (raw.token as string)
      const refreshToken =
        (raw.refreshToken as string) ||
        (raw.refresh_token as string) ||
        accessToken
      const user =
        (raw.user as typeof res.user) ?? (raw as unknown as typeof res.user)

      if (!accessToken) {
        throw new Error(
          "Login succeeded but no access token found in response. Check backend response shape.",
        )
      }

      dispatch(performLogin({ user, accessToken, refreshToken }))
      toast.success(`Welcome back, ${user?.name ?? "user"}`)
      // "/" hits SmartIndex which routes the user to their first accessible
      // module (or /access-denied if no permissions are granted).
      navigate(ROUTES.ROOT)
    } catch (err) {
      const msg = extractErrorMessage(err)
      setErrorMsg(msg)
      toast.error(msg)
      console.error("[Login error]", err)
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your dashboard
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-5">
        {errorMsg && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="pl-9"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to={ROUTES.AUTH.FORGOT_PASSWORD}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="size-4 rounded border-input accent-primary"
          />
          Remember me on this device
        </label>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="size-4 animate-spin" />}
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  )
}
