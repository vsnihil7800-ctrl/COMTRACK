import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

function AuthShell({ title, children }) {
  return (
    <section className="mx-auto max-w-md glass rounded-2xl p-6">
      <h1 className="mb-4 text-2xl font-bold">{title}</h1>
      {children}
    </section>
  );
}

function PasswordInput({ placeholder, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        className="w-full rounded-lg bg-white/10 p-2 pr-10"
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-2 top-2 text-slate-300 hover:text-white"
      >
        {show ? "🙈" : "👁️"}
      </button>
    </div>
  );
}

export function LoginPage() {
  const { loginData } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);
      loginData(data);
      nav("/dashboard");
      toast.success("Welcome back");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthShell title="Login">
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full rounded-lg bg-white/10 p-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <PasswordInput
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
            Forgot password?
          </Link>
        </div>
        <button className="w-full rounded-lg bg-white py-2 text-slate-900 font-semibold">
          Login
        </button>
        <p className="text-center text-sm text-slate-300">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:text-blue-300">Register</Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function RegisterPage() {
  const { loginData } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "citizen" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/register", form);
      loginData(data);
      nav("/dashboard");
      toast.success("Account created. Verify your email.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Register failed");
    }
  };

  return (
    <AuthShell title="Register">
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full rounded-lg bg-white/10 p-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full rounded-lg bg-white/10 p-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <PasswordInput
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select
          className="w-full rounded-lg bg-white/10 p-2"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="citizen">Citizen</option>
          <option value="driver">Ambulance Driver</option>
          <option value="officer">Complaint Officer</option>
          <option value="responder">Emergency Responder</option>
          <option value="admin">Admin</option>
        </select>
        <button className="w-full rounded-lg bg-white py-2 text-slate-900 font-semibold">
          Create account
        </button>
        <p className="text-center text-sm text-slate-300">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">Login</Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
      setStep(2);
      toast.success("OTP sent to your email!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/verify-otp", { email, otp });
      setStep(3);
      toast.success("OTP verified!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/reset-password", { email, otp, password: newPassword });
      toast.success("Password reset successfully!");
      setStep(4);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <AuthShell title="Forgot Password">
      {step === 1 && (
        <form onSubmit={sendOtp} className="space-y-3">
          <p className="text-sm text-slate-300">Enter your email to receive an OTP</p>
          <input
            className="w-full rounded-lg bg-white/10 p-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="w-full rounded-lg bg-white py-2 text-slate-900 font-semibold">
            Send OTP
          </button>
          <p className="text-center text-sm">
            <Link to="/login" className="text-blue-400">Back to Login</Link>
          </p>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={verifyOtp} className="space-y-3">
          <p className="text-sm text-slate-300">Enter the OTP sent to {email}</p>
          <input
            className="w-full rounded-lg bg-white/10 p-2"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button className="w-full rounded-lg bg-white py-2 text-slate-900 font-semibold">
            Verify OTP
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={resetPassword} className="space-y-3">
          <p className="text-sm text-slate-300">Enter your new password</p>
          <PasswordInput
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button className="w-full rounded-lg bg-white py-2 text-slate-900 font-semibold">
            Reset Password
          </button>
        </form>
      )}

      {step === 4 && (
        <div className="text-center space-y-3">
          <p className="text-green-400 font-semibold">✅ Password reset successfully!</p>
          <Link to="/login" className="block rounded-lg bg-white py-2 text-slate-900 font-semibold">
            Go to Login
          </Link>
        </div>
      )}
    </AuthShell>
  );
}