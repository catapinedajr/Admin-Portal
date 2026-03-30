import { useState } from "react";
import { useLocation } from "wouter";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, ArrowLeft, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotSent, setForgotSent] = useState(false);
    
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetLoading, setResetLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        
        e.preventDefault();
        setIsLoading(true);

        const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL;
        const realm = import.meta.env.VITE_KEYCLOAK_REALM || 'hodlearn';
        const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'hodlearn-client';

        if (!keycloakUrl) {
            toast({
                title: "Configuration error",
                description: "Keycloak URL is not configured",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    grant_type: "password",
                    client_id: clientId,
                    username: email,
                    password: password,
                }),
            });
            const data = await response.json();
            localStorage.setItem("admin_session", data.access_token);
            
            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            toast({
                title: "Welcome back",
                // description: `Logged in as ${data.admin.firstName}`,
                description: `Logged in as administrator`,
            });
            setLocation("/admin");
        } catch (error: any) {
            toast({
                title: "Login failed",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setForgotLoading(true);

        try {
        const response = await fetch("/api/admin/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: forgotEmail }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Request failed");
        }

        setForgotSent(true);
        
        if (data.devToken) {
            setResetToken(data.devToken);
            toast({
            title: "Development Mode",
            description: "Reset token has been pre-filled for testing.",
            });
        }
        } catch (error: any) {
        toast({
            title: "Request failed",
            description: error.message,
            variant: "destructive",
        });
        } finally {
        setForgotLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
        toast({
            title: "Passwords don't match",
            description: "Please ensure both passwords are identical.",
            variant: "destructive",
        });
        return;
        }
        
        if (newPassword.length < 8) {
        toast({
            title: "Password too short",
            description: "Password must be at least 8 characters.",
            variant: "destructive",
        });
        return;
        }
        
        setResetLoading(true);

        try {
        const response = await fetch("/api/admin/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: resetToken, newPassword }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Reset failed");
        }

        toast({
            title: "Password Reset Successful",
            description: "You can now log in with your new password.",
        });
        
        setShowResetPassword(false);
        setShowForgotPassword(false);
        setForgotSent(false);
        setResetToken("");
        setNewPassword("");
        setConfirmPassword("");
        } catch (error: any) {
        toast({
            title: "Reset failed",
            description: error.message,
            variant: "destructive",
        });
        } finally {
        setResetLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
            <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-bold">
                HL
                </div>
                <span className="text-xl font-bold text-white">Admin Portal</span>
            </div>
            <CardTitle className="text-white">Sign In</CardTitle>
            <CardDescription className="text-zinc-400">
                HODLearn employee access only
            </CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input
                    id="email"
                    type="email"
                    placeholder="you@hodlearn.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                    required
                    data-testid="input-admin-email"
                    />
                </div>
                </div>
                <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-zinc-300">Password</Label>
                    <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-orange-500 hover:text-orange-400"
                    data-testid="link-forgot-password"
                    >
                    Forgot password?
                    </button>
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                    required
                    data-testid="input-admin-password"
                    />
                </div>
                </div>
                <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isLoading}
                data-testid="button-admin-login"
                >
                {isLoading ? "Signing in..." : "Sign In"}
                </Button>
            </form>
            </CardContent>
        </Card>

        <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
            <DialogContent className="bg-zinc-900 border-zinc-700">
            <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-orange-500" />
                Reset Password
                </DialogTitle>
                <DialogDescription className="text-zinc-400">
                {forgotSent 
                    ? "If an account with that email exists, instructions have been sent."
                    : "Enter your email to receive password reset instructions."}
                </DialogDescription>
            </DialogHeader>
            
            {!forgotSent ? (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="forgotEmail" className="text-zinc-300">Email Address</Label>
                    <Input
                    id="forgotEmail"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="admin@hodlearn.com"
                    required
                    data-testid="input-forgot-email"
                    />
                </div>
                <DialogFooter>
                    <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setShowForgotPassword(false)}
                    >
                    Cancel
                    </Button>
                    <Button 
                    type="submit" 
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={forgotLoading}
                    data-testid="button-send-reset"
                    >
                    {forgotLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
                </DialogFooter>
                </form>
            ) : (
                <div className="space-y-4">
                <p className="text-zinc-300 text-sm">
                    Check your email for the reset link. In development mode, you can enter your reset token below.
                </p>
                <div className="space-y-2">
                    <Label htmlFor="resetToken" className="text-zinc-300">Reset Token</Label>
                    <Input
                    id="resetToken"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white font-mono text-sm"
                    placeholder="Paste token from email or logs"
                    data-testid="input-reset-token"
                    />
                </div>
                <DialogFooter>
                    <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => { setForgotSent(false); setForgotEmail(""); }}
                    >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                    </Button>
                    <Button 
                    type="button" 
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => setShowResetPassword(true)}
                    disabled={!resetToken}
                    data-testid="button-continue-reset"
                    >
                    Continue
                    </Button>
                </DialogFooter>
                </div>
            )}
            </DialogContent>
        </Dialog>

        <Dialog open={showResetPassword} onOpenChange={setShowResetPassword}>
            <DialogContent className="bg-zinc-900 border-zinc-700">
            <DialogHeader>
                <DialogTitle className="text-white">Set New Password</DialogTitle>
                <DialogDescription className="text-zinc-400">
                Enter your new password below.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-zinc-300">New Password</Label>
                <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="Minimum 8 characters"
                    minLength={8}
                    required
                    data-testid="input-new-password"
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-zinc-300">Confirm Password</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="Repeat your password"
                    minLength={8}
                    required
                    data-testid="input-confirm-password"
                />
                </div>
                <DialogFooter>
                <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setShowResetPassword(false)}
                >
                    Back
                </Button>
                <Button 
                    type="submit" 
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={resetLoading}
                    data-testid="button-reset-password"
                >
                    {resetLoading ? "Resetting..." : "Reset Password"}
                </Button>
                </DialogFooter>
            </form>
            </DialogContent>
        </Dialog>
        </div>
    );
}
