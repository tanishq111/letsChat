import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CircleAlert,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import AuthLayout from "../components/AuthLayout.jsx";
import { useAuth } from "../context/authContext.jsx";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signup(username, email, password);
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Join the conversation"
      title="Make yourself at home."
      subtitle="Create your account and say hello."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-semibold text-ink" htmlFor="signup-username">
            Username
          </label>
          <div className="relative mt-2">
            <UserRound
              className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted"
              strokeWidth={1.8}
              aria-hidden="true"
            />
            <input
              id="signup-username"
              className="h-12 w-full rounded-[8px] border border-line bg-paper pr-4 pl-11 text-[15px] text-ink outline-none placeholder:text-[#98a29f] hover:border-[#b9c7c0] focus:border-brand focus:ring-4 focus:ring-brand/10"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="yourname"
              autoComplete="username"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-ink" htmlFor="signup-email">
            Email address
          </label>
          <div className="relative mt-2">
            <Mail
              className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted"
              strokeWidth={1.8}
              aria-hidden="true"
            />
            <input
              id="signup-email"
              className="h-12 w-full rounded-[8px] border border-line bg-paper pr-4 pl-11 text-[15px] text-ink outline-none placeholder:text-[#98a29f] hover:border-[#b9c7c0] focus:border-brand focus:ring-4 focus:ring-brand/10"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-ink" htmlFor="signup-password">
            Password
          </label>
          <div className="relative mt-2">
            <LockKeyhole
              className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted"
              strokeWidth={1.8}
              aria-hidden="true"
            />
            <input
              id="signup-password"
              className="h-12 w-full rounded-[8px] border border-line bg-paper pr-12 pl-11 text-[15px] text-ink outline-none placeholder:text-[#98a29f] hover:border-[#b9c7c0] focus:border-brand focus:ring-4 focus:ring-brand/10"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              minLength={6}
              required
            />
            <button
              className="absolute top-1/2 right-2.5 grid size-8 -translate-y-1/2 place-items-center rounded-[6px] text-muted hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-[18px]" aria-hidden="true" />
              ) : (
                <Eye className="size-[18px]" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div
            className="flex items-start gap-2.5 rounded-[8px] border border-coral/25 bg-coral/10 px-3.5 py-3 text-sm text-[#9e3f2e]"
            role="alert"
          >
            <CircleAlert className="mt-0.5 size-[18px] shrink-0" aria-hidden="true" />
            <p>{error}</p>
          </div>
        )}

        <button
          className="flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-brand px-5 text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(20,125,115,0.22)] hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-65"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <LoaderCircle className="size-[18px] animate-spin" aria-hidden="true" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="size-[18px]" aria-hidden="true" />
            </>
          )}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link className="font-bold text-brand hover:text-brand-dark hover:underline" to="/login">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignupPage;