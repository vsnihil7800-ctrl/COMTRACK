import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api";

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const token = params.get("token");
    const email = params.get("email");
    if (!token || !email) {
      setStatus("Invalid verification link");
      return;
    }
    api
      .post("/auth/verify-email", { token, email })
      .then(() => setStatus("Email verified successfully"))
      .catch(() => setStatus("Verification link expired or invalid"));
  }, [params]);

  return (
    <section className="glass rounded-2xl p-6">
      <h1 className="text-3xl font-bold">Email Verification</h1>
      <p className="mt-3 text-slate-300">{status}</p>
    </section>
  );
}
