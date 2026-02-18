import { Button } from '@/components/ui/button';
import Carousel from '@/components/Carousel';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import { Gift, Heart, MessageSquare, Image, Instagram, Mail, MessageCircle } from 'lucide-react';
import { getLoginUrl } from '@/const';
import { useAuth } from '@/_core/hooks/useAuth';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: carouselPhotos = [], isLoading: carouselLoading } = trpc.carousel.list.useQuery();
  const { data: weddingInfo } = trpc.wedding.get.useQuery();
  const { data: productsCount } = trpc.products.list.useQuery();

  return (
    <div className="min-h-screen bg-background">
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

      {/* Navigation Cards Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container">
          <h2 className="text-2xl sm:text-3xl font-elegant text-center mb-12 text-foreground">
            Explore as Seções
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Presentes Card */}
            <Link href="/products">
              <div className="group cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-blue-200">
                <div className="w-12 h-12 mb-4 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-elegant text-blue-900 mb-2">Presentes</h3>
                <p className="text-sm text-blue-700 mb-4">
                  Escolha presentes especiais para o casal
                </p>
                <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-900 transition">Explorar →</span>
              </div>
            </Link>

            {/* Contribuição Card */}
            <Link href="/contribute">
              <div className="group cursor-pointer bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-pink-200">
                <div className="w-12 h-12 mb-4 bg-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-elegant text-pink-900 mb-2">Contribuição</h3>
                <p className="text-sm text-pink-700 mb-4">
                  Contribua com um valor livre de sua escolha
                </p>
                <span className="text-xs font-semibold text-pink-600 group-hover:text-pink-900 transition">Contribuir →</span>
              </div>
            </Link>

            {/* Mural Card */}
            <Link href="/posts">
              <div className="group cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-purple-200">
                <div className="w-12 h-12 mb-4 bg-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-elegant text-purple-900 mb-2">Mural</h3>
                <p className="text-sm text-purple-700 mb-4">
                  Deixe mensagens e fotos especiais
                </p>
                <span className="text-xs font-semibold text-purple-600 group-hover:text-purple-900 transition">Visitar →</span>
              </div>
            </Link>

            {/* Galeria Card */}
            <Link href="/gallery">
              <div className="group cursor-pointer bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-green-200">
                <div className="w-12 h-12 mb-4 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Image className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-elegant text-green-900 mb-2">Galeria</h3>
                <p className="text-sm text-green-700 mb-4">
                  Fotos e vídeos do evento
                </p>
                <span className="text-xs font-semibold text-green-600 group-hover:text-green-900 transition">Acessar →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 lg:py-16">
        <div className="container">
          <h2 className="text-2xl sm:text-3xl font-elegant text-center mb-12 text-foreground">
            Como Funciona
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
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

            {/* Feature 4 */}
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                <Image className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-elegant mb-2 text-foreground">Galeria de Eventos</h3>
              <p className="text-sm text-muted-foreground">
                Acesse fotos e vídeos do evento para recordações especiais.
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
            <Link href="/posts">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <MessageSquare className="w-5 h-5 mr-2" />
                Mural
              </Button>
            </Link>
            <Link href="/gallery">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Image className="w-5 h-5 mr-2" />
                Galeria
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
