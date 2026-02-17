import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Carousel from '@/components/Carousel';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import { Gift, Heart, MessageSquare, Users } from 'lucide-react';
import { getLoginUrl } from '@/const';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: carouselPhotos = [], isLoading: carouselLoading } = trpc.carousel.list.useQuery();
  const { data: weddingInfo } = trpc.wedding.get.useQuery();
  const { data: productsCount } = trpc.products.list.useQuery();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-elegant">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-elegant text-foreground">
              {weddingInfo?.groomName} & {weddingInfo?.brideName}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated && user?.role === 'admin' && (
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  Painel Admin
                </Button>
              </Link>
            )}
            {!isAuthenticated ? (
              <a href={getLoginUrl()}>
                <Button size="sm">Entrar</Button>
              </a>
            ) : (
              <span className="text-sm text-muted-foreground">Olá, {user?.name}</span>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section with Carousel */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container">
          {carouselLoading ? (
            <div className="w-full h-96 bg-muted animate-pulse rounded-lg" />
          ) : (
            <Carousel images={carouselPhotos} autoPlay={true} interval={5000} />
          )}
        </div>
      </section>

      {/* Wedding Info Section */}
      <section className="py-12 lg:py-20 bg-muted/30">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-elegant mb-6 text-foreground">
            {weddingInfo?.groomName} & {weddingInfo?.brideName}
          </h2>
          {weddingInfo?.weddingDate && (
            <p className="text-lg text-muted-foreground mb-4">
              {new Date(weddingInfo.weddingDate).toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
          {weddingInfo?.description && (
            <p className="text-base text-foreground/80 leading-relaxed mb-8">
              {weddingInfo.description}
            </p>
          )}
          <Link href="/products">
            <Button size="lg" className="gap-2">
              <Gift className="w-5 h-5" />
              Ver Lista de Presentes
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <h2 className="text-3xl sm:text-4xl font-elegant text-center mb-16 text-foreground">
            Como Funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Gift className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-elegant mb-3 text-foreground">Escolha Presentes</h3>
              <p className="text-muted-foreground">
                Navegue pela nossa lista de presentes cuidadosamente selecionados pelo casal.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-elegant mb-3 text-foreground">Contribua com Amor</h3>
              <p className="text-muted-foreground">
                Sua contribuição é convertida em valor que vai direto para a conta do casal.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-elegant mb-3 text-foreground">Deixe uma Mensagem</h3>
              <p className="text-muted-foreground">
                Compartilhe fotos e mensagens de bênçãos no nosso mural especial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-elegant mb-6 text-foreground">
            Pronto para Celebrar?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Escolha um presente especial ou deixe uma mensagem para o casal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto">
                <Gift className="w-5 h-5 mr-2" />
                Ver Presentes
              </Button>
            </Link>
            <Link href="/posts">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <MessageSquare className="w-5 h-5 mr-2" />
                Ir para Mural
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-8 border-t border-border">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-elegant text-lg mb-4">Sobre</h3>
              <p className="text-sm opacity-80">
                Uma plataforma elegante para celebrar o amor e a união do casal.
              </p>
            </div>
            <div>
              <h3 className="font-elegant text-lg mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/products" className="opacity-80 hover:opacity-100 transition-smooth">
                    Presentes
                  </Link>
                </li>
                <li>
                  <Link href="/posts" className="opacity-80 hover:opacity-100 transition-smooth">
                    Mural
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-elegant text-lg mb-4">Contato</h3>
              <p className="text-sm opacity-80">
                {weddingInfo?.groomName && weddingInfo?.brideName
                  ? `${weddingInfo.groomName} & ${weddingInfo.brideName}`
                  : 'Entre em contato conosco'}
              </p>
            </div>
          </div>
          <div className="border-t border-secondary-foreground/20 pt-8 text-center text-sm opacity-80">
            <p>&copy; 2026 Wedding Registry. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
