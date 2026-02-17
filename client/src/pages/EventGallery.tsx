import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function EventGallery() {
  const { data: photos, isLoading } = trpc.eventGallery.list.useQuery();
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [guestName, setGuestName] = useState('');

  const addCommentMutation = trpc.eventGallery.addComment.useMutation();
  const addLikeMutation = trpc.eventGallery.addLike.useMutation();
  const { data: comments } = trpc.eventGallery.getComments.useQuery(
    { photoId: selectedPhoto || 0 },
    { enabled: !!selectedPhoto }
  );

  const handleAddComment = async () => {
    if (!selectedPhoto || !guestName.trim() || !commentText.trim()) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      await addCommentMutation.mutateAsync({
        photoId: selectedPhoto,
        guestName,
        guestEmail: guestEmail || undefined,
        comment: commentText,
      });
      setCommentText('');
      setGuestName('');
      setGuestEmail('');
      toast.success('Comentário adicionado com sucesso!');
    } catch (error) {
      toast.error('Erro ao adicionar comentário');
    }
  };

  const handleLike = async (photoId: number) => {
    if (!guestEmail.trim()) {
      toast.error('Digite seu email para dar like');
      return;
    }

    try {
      await addLikeMutation.mutateAsync({
        photoId,
        guestEmail,
      });
      toast.success('Like adicionado!');
    } catch (error) {
      toast.error('Erro ao adicionar like');
    }
  };

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `foto-${Date.now()}.jpg`;
    link.click();
  };

  if (isLoading) {
    return <div className="container py-12 text-center">Carregando galeria...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border shadow-elegant">
        <div className="container py-8">
          <h1 className="text-4xl font-elegant text-foreground">Galeria do Evento</h1>
          <p className="text-muted-foreground mt-2">
            Confira as fotos do nosso casamento, dê likes e deixe comentários!
          </p>
        </div>
      </div>

      <div className="container py-12">
        {!photos || photos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma foto disponível ainda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption || 'Foto do evento'}
                    className="w-full h-full object-cover hover:scale-105 transition"
                  />
                </div>

                {photo.caption && (
                  <div className="p-4 border-b border-border">
                    <p className="text-sm text-foreground">{photo.caption}</p>
                  </div>
                )}

                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(photo.id)}
                        className="flex items-center gap-1 text-muted-foreground hover:text-primary transition"
                      >
                        <Heart className="w-5 h-5" />
                        <span className="text-sm">{photo.likes}</span>
                      </button>
                      <button
                        onClick={() => setSelectedPhoto(photo.id)}
                        className="flex items-center gap-1 text-muted-foreground hover:text-primary transition"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{comments?.length || 0}</span>
                      </button>
                    </div>
                    <button
                      onClick={() => handleDownload(photo.imageUrl)}
                      className="flex items-center gap-1 text-muted-foreground hover:text-primary transition"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>

                  {selectedPhoto === photo.id && (
                    <div className="space-y-3 pt-3 border-t border-border">
                      <div>
                        <label className="text-xs font-medium text-foreground mb-1 block">
                          Seu Nome
                        </label>
                        <input
                          type="text"
                          placeholder="Digite seu nome"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-foreground mb-1 block">
                          Seu Email
                        </label>
                        <input
                          type="email"
                          placeholder="seu@email.com"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-foreground mb-1 block">
                          Comentário
                        </label>
                        <textarea
                          placeholder="Deixe seu comentário..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-md text-sm"
                          rows={3}
                        />
                      </div>
                      <Button
                        size="sm"
                        onClick={handleAddComment}
                        disabled={addCommentMutation.isPending}
                      >
                        Comentar
                      </Button>
                    </div>
                  )}

                  {selectedPhoto === photo.id && comments && comments.length > 0 && (
                    <div className="space-y-2 pt-3 border-t border-border">
                      <p className="text-xs font-medium text-foreground">Comentários:</p>
                      {comments.map((comment) => (
                        <div key={comment.id} className="bg-muted p-2 rounded text-xs">
                          <p className="font-medium text-foreground">{comment.guestName}</p>
                          <p className="text-muted-foreground">{comment.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
