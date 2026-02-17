import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowLeft, Package, Images, MessageSquare, Settings } from 'lucide-react';
import { toast } from 'sonner';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminCarousel from '@/components/admin/AdminCarousel';
import AdminPosts from '@/components/admin/AdminPosts';
import AdminSettings from '@/components/admin/AdminSettings';

type TabType = 'products' | 'carousel' | 'posts' | 'settings';

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('products');

  // Redirect if not admin
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
                Bem-vindo, {user?.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="container">
          <div className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-smooth whitespace-nowrap ${
                activeTab === 'products'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Package className="w-4 h-4" />
              Produtos
            </button>
            <button
              onClick={() => setActiveTab('carousel')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-smooth whitespace-nowrap ${
                activeTab === 'carousel'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Images className="w-4 h-4" />
              Fotos do Carrossel
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-smooth whitespace-nowrap ${
                activeTab === 'posts'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Posts
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-smooth whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Settings className="w-4 h-4" />
              Configurações
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container py-8">
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'carousel' && <AdminCarousel />}
        {activeTab === 'posts' && <AdminPosts />}
        {activeTab === 'settings' && <AdminSettings />}
      </div>
    </div>
  );
}
