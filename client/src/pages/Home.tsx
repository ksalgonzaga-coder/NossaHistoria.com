import { Button } from '@/components/ui/button';
import Carousel from '@/components/Carousel';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import { Gift, Heart, MessageSquare, Users, Instagram, Mail, MessageCircle } from 'lucide-react';
import { getLoginUrl } from '@/const';
import { useAuth } from '@/_core/hooks/useAuth';

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
      <section className="py-6 sm:py-8 lg:py-10">
        <div className="container">
          {carouselLoading ? (
            <div className="w-full h-96 bg-muted animate-pulse rounded-lg" />
          ) : (
            <Carousel images={carouselPhotos} autoPlay={true} interval={5000} />
          )}
        </div>
      </section>

      {/* Wedding Info Section */}
      <section className="py-8 lg:py-12 bg-muted/30">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-elegant mb-4 text-foreground">
            {weddingInfo?.groomName} & {weddingInfo?.brideName}
          </h2>
          {weddingInfo?.weddingDate && (
            <p className="text-base text-muted-foreground mb-3">
              {new Date(weddingInfo.weddingDate).toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
          {weddingInfo?.description && (
            <p className="text-sm text-foreground/80 leading-relaxed mb-6">
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
      <section className="py-12 lg:py-16">
        <div className="container">
          <h2 className="text-2xl sm:text-3xl font-elegant text-center mb-12 text-foreground">
            Como Funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                <Gift className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-elegant mb-2 text-foreground">Escolha Presentes</h3>
              <p className="text-sm text-muted-foreground">
                Navegue pela nossa lista de presentes cuidadosamente selecionados pelo casal.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-elegant mb-2 text-foreground">Contribua com Amor</h3>
              <p className="text-sm text-muted-foreground">
                Sua contribuição é convertida em valor que vai direto para a conta do casal.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-elegant mb-2 text-foreground">Deixe uma Mensagem</h3>
              <p className="text-sm text-muted-foreground">
                Compartilhe fotos e mensagens de bênçãos no nosso mural especial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 lg:py-14 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-elegant mb-4 text-foreground">
            Pronto para Celebrar?
          </h2>
          <p className="text-base text-muted-foreground mb-6">
            Escolha um presente especial ou deixe uma mensagem para o casal.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto">
                <Gift className="w-5 h-5 mr-2" />
                Ver Presentes
              </Button>
            </Link>
            <Link href="/contribute">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Heart className="w-5 h-5 mr-2" />
                Contribuir Livremente
              </Button>
            </Link>
            <Link href="/gallery">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <MessageSquare className="w-5 h-5 mr-2" />
                Galeria
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-8 border-t border-border">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div>
              <h3 className="font-elegant text-base mb-3">Sobre</h3>
              <p className="text-xs opacity-80">
                Uma plataforma elegante para celebrar o amor e a união do casal.
              </p>
            </div>
            <div>
              <h3 className="font-elegant text-base mb-3">Links Rápidos</h3>
              <ul className="space-y-1 text-xs">
                <li>
                  <Link href="/products" className="opacity-80 hover:opacity-100 transition-smooth">
                    Presentes
                  </Link>
                </li>
                <li>
                  <Link href="/contribute" className="opacity-80 hover:opacity-100 transition-smooth">
                    Contribuir
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="opacity-80 hover:opacity-100 transition-smooth">
                    Galeria
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
              <h3 className="font-elegant text-base mb-3">Contato</h3>
              <p className="text-xs opacity-80">
                {weddingInfo?.groomName && weddingInfo?.brideName
                  ? `${weddingInfo.groomName} & ${weddingInfo.brideName}`
                  : 'Entre em contato conosco'}
              </p>
            </div>
            <div>
              <h3 className="font-elegant text-base mb-3">Redes Sociais</h3>
              <div className="flex gap-3">
                <a href="#" className="opacity-80 hover:opacity-100 transition" title="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="opacity-80 hover:opacity-100 transition" title="WhatsApp">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="#" className="opacity-80 hover:opacity-100 transition" title="Email">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-secondary-foreground/20 pt-6 text-center text-xs opacity-80">
            <p>&copy; 2026 Wedding Registry. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
