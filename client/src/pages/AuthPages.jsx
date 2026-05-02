import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        <input className="w-full rounded-lg bg-white/10 p-2" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full rounded-lg bg-white/10 p-2" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="w-full rounded-lg bg-white py-2 text-slate-900">Login</button>
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
        <input className="w-full rounded-lg bg-white/10 p-2" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="w-full rounded-lg bg-white/10 p-2" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full rounded-lg bg-white/10 p-2" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select className="w-full rounded-lg bg-white/10 p-2" onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="citizen">Citizen</option>
          <option value="driver">Ambulance Driver</option>
          <option value="officer">Complaint Officer</option>
          <option value="responder">Emergency Responder</option>
          <option value="admin">Admin</option>
        </select>
        <button className="w-full rounded-lg bg-white py-2 text-slate-900">Create account</button>
      </form>
    </AuthShell>
  );
}
