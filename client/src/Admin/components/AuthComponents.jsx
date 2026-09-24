import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios.js"

// ─────────────────────────────────────────────────────────────
// Main Auth Component
// ─────────────────────────────────────────────────────────────
export default function AuthComponents() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" | "register" | "forgot"

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-200 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            {mode === "login" && "Welcome back"}
            {mode === "register" && "Create account"}
            {mode === "forgot" && "Reset password"}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {mode === "login" && "Sign in to continue"}
            {mode === "register" && "Get started in seconds"}
            {mode === "forgot" && "We'll help you get back in"}
          </p>
        </div>

        {mode === "login" && (
          <LoginForm
            onSuccess={() => navigate("/")}
            onForgot={() => setMode("forgot")}
            onSwitch={() => setMode("register")}
          />
        )}

        {mode === "register" && (
          <RegisterForm
            onSuccess={() => setMode("login")}
            onSwitch={() => setMode("login")}
          />
        )}

        {mode === "forgot" && (
          <ForgotPasswordFlow onBack={() => setMode("login")} />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────
function LoginForm({ onSuccess, onForgot, onSwitch }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/login", form);
      onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Login failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(v) => setForm({ ...form, email: v })}
        placeholder="you@example.com"
        required
      />
      <Input
        label="Password"
        type="password"
        value={form.password}
        onChange={(v) => setForm({ ...form, password: v })}
        placeholder="••••••••"
        required
      />

      {error && <ErrorBox message={error} />}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg transition"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <div className="flex justify-between text-sm">
        <button
          type="button"
          onClick={onForgot}
          className="text-blue-600 hover:underline"
        >
          Forgot password?
        </button>
        <button
          type="button"
          onClick={onSwitch}
          className="text-slate-600 hover:underline"
        >
          Create account
        </button>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────────────────────────
function RegisterForm({ onSuccess, onSwitch }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileRef = useRef(null);

  // Preview uploaded image
  const handleFile = (file) => {
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      let avatarUrl = "";

      // Step 1: if a file was picked, upload it first
      if (avatarFile) {
        const fd = new FormData();
        fd.append("avatar", avatarFile);
        const { data } = await api.post("/auth/avatar", fd); // → { url: "..." }
        avatarUrl = data.url || data.avatar || "";
      }

      // Step 2: register
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        avatar: avatarUrl,
      });

      setSuccess("Account created! Redirecting...");
      setTimeout(onSuccess, 1200);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Avatar picker */}
      <div className="flex flex-col items-center gap-3">
        <div
          onClick={() => fileRef.current?.click()}
          className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-400 transition"
        >
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-slate-400 text-xs text-center px-2">
              Click to upload
            </span>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <p className="text-xs text-slate-400">
          Optional — a default avatar will be generated
        </p>
      </div>

      <Input
        label="Name"
        value={form.name}
        onChange={(v) => setForm({ ...form, name: v })}
        placeholder="John Doe"
        required
      />
      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(v) => setForm({ ...form, email: v })}
        placeholder="you@example.com"
        required
      />
      <Input
        label="Password"
        type="password"
        value={form.password}
        onChange={(v) => setForm({ ...form, password: v })}
        placeholder="At least 8 characters"
        required
      />

      {error && <ErrorBox message={error} />}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg transition"
      >
        {loading ? "Creating..." : "Create account"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-blue-600 hover:underline"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────
// FORGOT PASSWORD FLOW (steps + timer)
// ─────────────────────────────────────────────────────────────
function ForgotPasswordFlow({ onBack }) {
  const [step, setStep] = useState(1); // 1 = email, 2 = otp, 3 = new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 15-minute OTP timer
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const timerRef = useRef(null);

  // Start timer when entering step 2
  useEffect(() => {
    const timer = () => {
      if (step !== 2) return;
      setSecondsLeft(15 * 60);

      timerRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return s - 1;
        });
      }, 1000);

      return () => clearInterval(timerRef.current);
    };

    timer();
  }, [step]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  // ── Step 1: send OTP ──
  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forget-password", { email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: verify OTP ──
  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-otp", { email, otp });
      setTempToken(data.tempToken);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: resend OTP ──
  const resendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/resend-otp", { email });
      setSecondsLeft(15 * 60); // restart timer
      setSuccess("New OTP sent");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: reset password ──
  const resetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { tempToken, newPassword });
      setSuccess("Password reset! Redirecting...");
      setTimeout(onBack, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-2.5 h-2.5 rounded-full transition ${
              step >= s ? "bg-blue-600" : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      {/* ── STEP 1: Email ── */}
      {step === 1 && (
        <form onSubmit={sendOtp} className="space-y-4">
          <p className="text-sm text-slate-500">
            Enter your email and we'll send a 6-digit OTP.
          </p>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            required
          />
          {error && <ErrorBox message={error} />}
          <SubmitButton loading={loading} text="Send OTP" />
        </form>
      )}

      {/* ── STEP 2: OTP + timer ── */}
      {step === 2 && (
        <form onSubmit={verifyOtp} className="space-y-4">
          <p className="text-sm text-slate-500">
            Enter the 6-digit code sent to <strong>{email}</strong>
          </p>

          <Input
            label="OTP"
            value={otp}
            onChange={(v) => setOtp(v.replace(/\D/g, "").slice(0, 6))}
            placeholder="123456"
            required
          />

          {/* Timer */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Code expires in</span>
            <span
              className={`font-mono font-semibold ${
                secondsLeft <= 60 ? "text-red-600" : "text-slate-700"
              }`}
            >
              {formatTime(secondsLeft)}
            </span>
          </div>

          {secondsLeft === 0 && (
            <p className="text-xs text-red-600">
              OTP expired. Click "Resend" to get a new one.
            </p>
          )}

          {error && <ErrorBox message={error} />}
          {success && <SuccessBox message={success} />}

          <SubmitButton loading={loading} text="Verify OTP" />

          <div className="flex justify-between text-sm">
            <button
              type="button"
              onClick={resendOtp}
              disabled={loading}
              className="text-blue-600 hover:underline disabled:text-slate-400"
            >
              Resend OTP
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-slate-600 hover:underline"
            >
              Change email
            </button>
          </div>
        </form>
      )}

      {/* ── STEP 3: New password ── */}
      {step === 3 && (
        <form onSubmit={resetPassword} className="space-y-4">
          <p className="text-sm text-slate-500">
            Choose a new password for your account.
          </p>

          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="At least 8 characters"
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Re-enter password"
            required
          />

          {error && <ErrorBox message={error} />}
          {success && <SuccessBox message={success} />}

          <SubmitButton loading={loading} text="Reset Password" />
        </form>
      )}

      {/* Back to login */}
      <p className="text-center text-sm text-slate-600">
        <button
          type="button"
          onClick={onBack}
          className="text-blue-600 hover:underline"
        >
          ← Back to sign in
        </button>
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Reusable UI bits
// ─────────────────────────────────────────────────────────────

function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
    </div>
  );
}

function SubmitButton({ loading, text }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg transition"
    >
      {loading ? "Please wait..." : text}
    </button>
  );
}

function ErrorBox({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
      {message}
    </div>
  );
}

function SuccessBox({ message }) {
  return (
    <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3">
      {message}
    </div>
  );
}
