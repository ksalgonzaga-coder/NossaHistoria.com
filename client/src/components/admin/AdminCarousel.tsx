import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface PhotoForm {
  id?: number;
  imageUrl: string;
  caption: string;
  order: string;
}

export default function AdminCarousel() {
  const { data: photos = [], isLoading, refetch } = trpc.carousel.list.useQuery();
  const createPhotoMutation = trpc.carousel.create.useMutation();
  const updatePhotoMutation = trpc.carousel.update.useMutation();
  const deletePhotoMutation = trpc.carousel.delete.useMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<PhotoForm>({
    imageUrl: '',
    caption: '',
    order: '0',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenDialog = (photo?: typeof photos[0]) => {
    if (photo) {
      setFormData({
        id: photo.id,
        imageUrl: photo.imageUrl,
        caption: photo.caption || '',
        order: photo.order.toString(),
      });
    } else {
      setFormData({
        imageUrl: '',
        caption: '',
        order: '0',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imageUrl.trim()) {
      toast.error('URL da imagem é obrigatória');
      return;
    }

    setIsSubmitting(true);

    try {
      if (formData.id) {
        await updatePhotoMutation.mutateAsync({
          id: formData.id,
          imageUrl: formData.imageUrl,
          caption: formData.caption || undefined,
          order: parseInt(formData.order) || 0,
        });
        toast.success('Foto atualizada com sucesso!');
      } else {
        await createPhotoMutation.mutateAsync({
          imageUrl: formData.imageUrl,
          caption: formData.caption || undefined,
          order: parseInt(formData.order) || 0,
        });
        toast.success('Foto adicionada com sucesso!');
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error('Erro ao salvar foto');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar esta foto?')) return;

    try {
      await deletePhotoMutation.mutateAsync({ id });
      toast.success('Foto deletada com sucesso!');
      refetch();
    } catch (error) {
      toast.error('Erro ao deletar foto');
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-elegant text-foreground">Fotos do Carrossel</h2>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Foto
        </Button>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-muted rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhuma foto no carrossel ainda</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden">
              <div className="bg-muted h-40 flex items-center justify-center overflow-hidden">
                <img
                  src={photo.imageUrl}
                  alt={photo.caption || 'Foto do carrossel'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                {photo.caption && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {photo.caption}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mb-4">
                  Ordem: {photo.order}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => handleOpenDialog(photo)}
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => handleDelete(photo.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Deletar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Photo Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-elegant">
              {formData.id ? 'Editar Foto' : 'Nova Foto'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                URL da Imagem *
              </label>
              <Input
                placeholder="https://exemplo.com/foto.jpg"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                required
              />
              {formData.imageUrl && (
                <div className="mt-4 rounded-lg overflow-hidden h-48">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => toast.error('Erro ao carregar imagem')}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Legenda (opcional)
              </label>
              <Input
                placeholder="Ex: Nosso primeiro encontro"
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Ordem de Exibição
              </label>
              <Input
                type="number"
                min="0"
                placeholder="0"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
              />
            </div>

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
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Foto'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
