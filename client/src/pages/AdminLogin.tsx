import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Lock, Mail, AlertCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAdminAuth();
  
  const loginMutation = trpc.adminAuth.login.useMutation();

  // Redirect if already authenticated
  if (isAuthenticated) {
    setLocation('/admin');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate inputs
    if (!email.trim()) {
      setError('Email é obrigatório');
      return;
    }

    if (!password.trim()) {
      setError('Senha é obrigatória');
      return;
    }

    if (password.length < 6) {
      setError('Senha deve ter no mínimo 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginMutation.mutateAsync({
        email: email.toLowerCase().trim(),
        password,
      });

      if (result && result.id) {
        // Store admin session in localStorage
        localStorage.setItem('adminSession', JSON.stringify({
          id: result.id,
          email: result.email,
          timestamp: new Date().toISOString(),
        }));
        
        toast.success('Login realizado com sucesso!');
        setLocation('/admin');
      } else {
        setError('Credenciais inválidas. Tente novamente.');
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Erro ao fazer login';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-elegant">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-elegant text-foreground mb-2">
            Painel Admin
          </h1>
          <p className="text-sm text-muted-foreground">
            Acesso restrito para administradores
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="admin@wedding.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
            <p className="font-medium mb-1">🔐 Segurança</p>
            <p>
              Use as credenciais de administrador configuradas no painel administrativo. Sua sessão expirará em 24 horas.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            Acesso exclusivo para administradores do casamento
          </p>
        </div>
      </Card>
    </div>
  );
}
