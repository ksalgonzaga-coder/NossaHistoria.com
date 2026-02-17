import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface ProductForm {
  id?: number;
  name: string;
  description: string;
  price: string;
  category: string;
  quantity: string;
}

export default function AdminProducts() {
  const { data: products = [], isLoading, refetch } = trpc.products.list.useQuery();
  const createProductMutation = trpc.products.create.useMutation();
  const updateProductMutation = trpc.products.update.useMutation();
  const deleteProductMutation = trpc.products.delete.useMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: '',
    category: '',
    quantity: '1',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenDialog = (product?: typeof products[0]) => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        category: product.category || '',
        quantity: product.quantity.toString(),
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        quantity: '1',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.price.trim()) {
      toast.error('Nome e preço são obrigatórios');
      return;
    }

    setIsSubmitting(true);

    try {
      if (formData.id) {
        await updateProductMutation.mutateAsync({
          id: formData.id,
          name: formData.name,
          description: formData.description || undefined,
          price: formData.price,
          category: formData.category || undefined,
          quantity: parseInt(formData.quantity) || 1,
        });
        toast.success('Produto atualizado com sucesso!');
      } else {
        await createProductMutation.mutateAsync({
          name: formData.name,
          description: formData.description || undefined,
          price: formData.price,
          category: formData.category || undefined,
          quantity: parseInt(formData.quantity) || 1,
        });
        toast.success('Produto criado com sucesso!');
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error('Erro ao salvar produto');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;

    try {
      await deleteProductMutation.mutateAsync({ id });
      toast.success('Produto deletado com sucesso!');
      refetch();
    } catch (error) {
      toast.error('Erro ao deletar produto');
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-elegant text-foreground">Gerenciar Produtos</h2>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Produto
        </Button>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-muted rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum produto cadastrado ainda</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="bg-muted h-40 flex items-center justify-center">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-elegant text-lg text-foreground mb-2 line-clamp-2">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-primary">
                    R$ {parseFloat(product.price).toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {product.quantity - product.quantitySold} disponível
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => handleOpenDialog(product)}
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => handleDelete(product.id)}
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

      {/* Product Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-elegant">
              {formData.id ? 'Editar Produto' : 'Novo Produto'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Nome do Produto *
              </label>
              <Input
                placeholder="Ex: Jogo de Cama Casal"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Descrição
              </label>
              <Textarea
                placeholder="Descreva o produto..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Preço (R$) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Quantidade
                </label>
                <Input
                  type="number"
                  min="1"
                  placeholder="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Categoria
              </label>
              <Input
                placeholder="Ex: Decoração, Eletrônicos"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                {isSubmitting ? 'Salvando...' : 'Salvar Produto'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
