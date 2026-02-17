import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Heart } from 'lucide-react';
import { Link } from 'wouter';
import { toast } from 'sonner';

interface CheckoutProps {
  productId?: number;
  productName?: string;
  amount?: number;
}

export default function Checkout() {
  const [, navigate] = useLocation();
  const checkoutMutation = trpc.checkout.create.useMutation();
  
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    amount: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.guestName.trim() || !formData.amount.trim()) {
      toast.error('Nome e valor são obrigatórios');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Valor inválido');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await checkoutMutation.mutateAsync({
        guestName: formData.guestName,
        guestEmail: formData.guestEmail || undefined,
        amount,
      });

      if (result.url) {
        // Redirect to Stripe checkout
        window.location.href = result.url;
      } else {
        toast.error('Erro ao criar sessão de checkout');
      }
    } catch (error) {
      toast.error('Erro ao processar pagamento');
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
          <Link href="/products">
            <Button variant="ghost" size="sm" className="mb-4 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-4xl font-elegant text-foreground">Contribuir para o Casamento</h1>
          <p className="text-muted-foreground mt-2">
            Sua contribuição será convertida em valor para o casal
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <Heart className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-elegant text-foreground">Detalhes da Contribuição</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Guest Name */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Seu Nome *
                </label>
                <Input
                  placeholder="Digite seu nome completo"
                  value={formData.guestName}
                  onChange={(e) =>
                    setFormData({ ...formData, guestName: e.target.value })
                  }
                  required
                />
              </div>

              {/* Guest Email */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Seu Email
                </label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.guestEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, guestEmail: e.target.value })
                  }
                />
              </div>

              {/* Amount */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Valor da Contribuição (R$) *
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-foreground">R$</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.50"
                    placeholder="100.00"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Valor mínimo: R$ 0,50
                </p>
              </div>

              {/* Summary */}
              {formData.amount && (
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Resumo da Contribuição</p>
                  <p className="text-2xl font-elegant text-primary">
                    R$ {parseFloat(formData.amount || '0').toFixed(2)}
                  </p>
                </div>
              )}

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Como funciona:</strong> Você será redirecionado para o Stripe para completar o pagamento de forma segura. Após a confirmação, o valor será creditado na conta do casal.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Link href="/products" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Cancelar
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="flex-1 gap-2"
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? 'Processando...' : 'Ir para Pagamento'}
                </Button>
              </div>
            </form>

            {/* Test Card Info */}
            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-xs text-muted-foreground">
                <strong>Para testes:</strong> Use o cartão 4242 4242 4242 4242 com qualquer data futura e CVC.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
