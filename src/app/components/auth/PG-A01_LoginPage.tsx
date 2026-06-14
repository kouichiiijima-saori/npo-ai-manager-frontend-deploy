import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, LogIn } from "lucide-react";
import { api } from "../../../api/axios";

type LoginResponse = {
    token?: string;
};

export function PGA01LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("admin");
    const [password, setPassword] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleLogin = async () => {
        setErrorMessage(null);
        setIsLoggingIn(true);

        try {
            const response = await api.post<LoginResponse | string>("/api/auth/login", {
                username: email,
                password,
            });

            const token =
                typeof response.data === "string"
                    ? response.data
                    : response.data.token;

            if (!token) {
                throw new Error("JWT token was not returned.");
            }

            localStorage.setItem("token", token);

            navigate("/admin/home");
        } catch (error) {
            console.error(error);
            setErrorMessage("ログインに失敗しました。IDまたはパスワードを確認してください。");
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 text-slate-100">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute right-[-10%] top-[10%] h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
                <div className="absolute bottom-[-15%] left-[35%] h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-slate-950/60 backdrop-blur">
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                        <Building2 className="h-7 w-7 text-cyan-200" />
                    </div>

                    <h1 className="text-2xl font-bold text-white">
                        NPO運営AIマネージャー
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        助成金活用支援システム
                    </p>
                </div>

                <div className="space-y-5">
                    <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-300">
                            ユーザー名
                        </span>

                        <input
                            type="text"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="admin"
                            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-300">
                            パスワード
                        </span>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="********"
                            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
                        />
                    </label>

                    {errorMessage && (
                        <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                            {errorMessage}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleLogin}
                        disabled={isLoggingIn}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <LogIn size={18} />
                        {isLoggingIn ? "ログイン中..." : "ログイン"}
                    </button>

                    <p className="text-center text-xs text-slate-500">
                        JWT認証によるログインを行います。
                    </p>
                </div>
            </div>
        </div>
    );
}