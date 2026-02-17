import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link } from 'wouter';
import { ArrowLeft, Upload, MessageSquare, Heart } from 'lucide-react';
import { toast } from 'sonner';

export default function Posts() {
  const { data: posts = [], isLoading, refetch } = trpc.posts.list.useQuery();
  const createPostMutation = trpc.posts.create.useMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '' as string | undefined,
    message: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.guestName.trim()) {
      toast.error('Por favor, digite seu nome');
      return;
    }

    if (!formData.message.trim() && !selectedImage) {
      toast.error('Por favor, adicione uma mensagem ou foto');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl: string | undefined = undefined;
      let imageKey: string | undefined = undefined;

      // TODO: Upload image to S3 if selected
      if (selectedImage) {
        // Placeholder for S3 upload
        imageUrl = previewUrl || undefined;
        imageKey = `posts/${Date.now()}-${selectedImage.name}`;
      }

      await createPostMutation.mutateAsync({
        guestName: formData.guestName,
        guestEmail: formData.guestEmail || undefined,
        message: formData.message || undefined,
        imageUrl,
        imageKey,
      });

      toast.success('Mensagem enviada! Será publicada após aprovação.');
      setFormData({ guestName: '', guestEmail: undefined, message: '' });
      setSelectedImage(null);
      setPreviewUrl(null);
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error('Erro ao enviar mensagem. Tente novamente.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-4xl font-elegant text-foreground">Mural de Mensagens</h1>
          <p className="text-muted-foreground mt-2">
            Deixe uma mensagem e foto especial para o casal
          </p>
        </div>
      </div>

      <div className="container py-12">
        {/* CTA Button */}
        <div className="text-center mb-12">
          <Button
            size="lg"
            className="gap-2"
            onClick={() => setIsDialogOpen(true)}
          >
            <MessageSquare className="w-5 h-5" />
            Deixar Mensagem
          </Button>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-muted rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">
              Ainda não há mensagens. Seja o primeiro a deixar uma!
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden hover:shadow-elegant-lg transition-smooth"
              >
                {/* Post Image */}
                {post.imageUrl && (
                  <div className="w-full h-48 bg-muted overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.guestName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Post Content */}
                <div className="p-4">
                  <h3 className="font-elegant text-lg text-foreground mb-2">
                    {post.guestName}
                  </h3>
                  {post.message && (
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
                      {post.message}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <Heart className="w-4 h-4" />
                    {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Post Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-elegant">
              Deixe uma Mensagem
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Seu Nome *
              </label>
              <Input
                placeholder="Digite seu nome"
                value={formData.guestName}
                onChange={(e) =>
                  setFormData({ ...formData, guestName: e.target.value })
                }
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Seu Email (opcional)
              </label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={formData.guestEmail}
                onChange={(e) =>
                  setFormData({ ...formData, guestEmail: e.target.value || undefined })
                }
              />
            </div>

            {/* Message */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Sua Mensagem
              </label>
              <Textarea
                placeholder="Deixe uma mensagem especial para o casal..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={4}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Foto (opcional)
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-smooth cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer block">
                  {previewUrl ? (
                    <div className="space-y-2">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <p className="text-sm text-muted-foreground">
                        Clique para trocar a foto
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                      <p className="text-sm font-medium text-foreground">
                        Clique para adicionar uma foto
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG ou GIF (máx. 5MB)
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
