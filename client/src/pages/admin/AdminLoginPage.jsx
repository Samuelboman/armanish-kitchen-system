import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import TextField from "../../components/ui/TextField";
import { useAuth } from "../../context/auth-context";
import { usePageTitle } from "../../hooks/usePageTitle";

// Admin login (POST /api/auth/login). Only accounts with the admin role get in.
export default function AdminLoginPage() {
  usePageTitle("Admin login");
  const { status, login, notice } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.startsWith("/admin/") ? location.state.from : "/admin/menu";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (status === "signedIn") return <Navigate to={from} replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setBusy(false);
      setError(err.status === 401 ? "Email or password is wrong." : err.message);
    }
  };

  return (
    <div className="grid min-h-dvh place-items-center bg-hero px-4 py-10 text-ink">
      <Card className="w-full max-w-sm p-6 sm:p-8">
        <img src="/images/logo.png" alt="Armanish Delight" className="mx-auto h-20 w-auto" />
        <h1 className="display-heading mt-4 text-center text-2xl">Admin login</h1>

        {notice && !error && (
          <p role="status" className="mt-4 rounded-2xl bg-subtle p-3 text-sm">
            {notice}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-4 rounded-2xl bg-red p-3 text-sm font-medium text-white">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
          <TextField
            label="Email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative">
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="[&_input]:pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute bottom-0.5 right-0.5 grid size-11 place-items-center rounded-xl"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
            </button>
          </div>
          <Button type="submit" size="lg" fullWidth disabled={busy}>
            {busy && <Loader2 className="size-5 animate-spin" aria-hidden="true" />}
            Log in
          </Button>
        </form>
        <p className="mt-5 text-center text-sm">
          <Link to="/" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
            Back to the site
          </Link>
        </p>
      </Card>
    </div>
  );
}
