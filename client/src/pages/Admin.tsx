import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, Package, Images, MessageSquare, Settings, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminCarousel from '@/components/admin/AdminCarousel';
import AdminPosts from '@/components/admin/AdminPosts';
import AdminSettings from '@/components/admin/AdminSettings';
import { useAdminAuth } from '@/hooks/useAdminAuth';

type TabType = 'products' | 'carousel' | 'posts' | 'settings';

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const { session, isAuthenticated: isAdminAuthenticated, logout } = useAdminAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>('products');

  // Redirect if not OAuth authenticated as admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-elegant mb-4">Acesso Negado</h1>
          <p className="text-muted-foreground mb-6">
            Você não tem permissão para acessar o painel administrativo.
          </p>
          <Link href="/">
            <Button>Voltar para Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Redirect if admin session is not valid
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-elegant mb-4">Sessão Expirada</h1>
          <p className="text-muted-foreground mb-6">
            Sua sessão de administrador expirou. Por favor, faça login novamente.
          </p>
          <Button onClick={() => setLocation('/admin-login')}>
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border shadow-elegant">
        <div className="container py-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-elegant text-foreground">Painel Administrativo</h1>
              <p className="text-muted-foreground mt-2">
                Conectado como: <span className="font-medium">{session?.email}</span>
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                toast.success('Desconectado com sucesso');
              }}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border">
          {[
            { id: 'products' as const, label: 'Produtos', icon: Package },
            { id: 'carousel' as const, label: 'Carrossel', icon: Images },
            { id: 'posts' as const, label: 'Posts', icon: MessageSquare },
            { id: 'settings' as const, label: 'Configurações', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'carousel' && <AdminCarousel />}
        {activeTab === 'posts' && <AdminPosts />}
        {activeTab === 'settings' && <AdminSettings />}
      </div>
    </div>
  );
}
