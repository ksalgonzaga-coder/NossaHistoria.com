import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Heart, CreditCard, QrCode } from 'lucide-react';
import { Link } from 'wouter';
import { toast } from 'sonner';

export default function Checkout() {
  const [, navigate] = useLocation();
  const checkoutMutation = trpc.checkout.create.useMutation();
  
  // Get URL params
  const url = new URL(window.location.href);
  const productId = url.searchParams.get('productId');
  const productName = url.searchParams.get('productName');
  const initialAmount = url.searchParams.get('amount');
  const guestNameParam = url.searchParams.get('guestName');
  
  const [formData, setFormData] = useState({
    guestName: guestNameParam || '',
    guestEmail: '',
    amount: initialAmount || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');

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
        window.open(result.url, '_blank');
        toast.success('Redirecionando para pagamento...');
      }
    } catch (error) {
      toast.error('Erro ao processar pagamento');
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
            <a className="flex items-center gap-2 text-primary hover:text-primary/80 transition mb-4">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </a>
          </Link>
          <h1 className="text-3xl font-elegant text-foreground">Finalizar Contribuição</h1>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Summary */}
          <div>
            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Resumo</h2>
              
              {productName && (
                <div className="pb-4 border-b border-border">
                  <p className="text-sm text-muted-foreground">Produto</p>
                  <p className="font-medium text-foreground">{productName}</p>
                </div>
              )}

              <div className="pb-4 border-b border-border">
                <p className="text-sm text-muted-foreground">Valor da Contribuição</p>
                <p className="text-2xl font-bold text-primary">
                  R$ {formData.amount || '0'}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                <p className="font-medium mb-2">💝 Como funciona?</p>
                <p>
                  Seu pagamento será processado de forma segura via Stripe. O valor será transferido 
                  diretamente para a conta do casal, que poderá utilizá-lo para comprar os presentes 
                  que desejar.
                </p>
              </div>
            </Card>
          </div>

          {/* Form */}
          <div>
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Guest Info */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    placeholder="Digite seu nome"
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Seu Email
                  </label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.guestEmail}
                    onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Valor *
                  </label>
                  <div className="flex gap-2">
                    <span className="text-lg font-medium text-foreground pt-2">R$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="flex-1 px-3 py-2 border border-border rounded-md text-sm"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">
                    Método de Pagamento
                  </label>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`w-full p-3 border rounded-lg transition flex items-center gap-3 ${
                        paymentMethod === 'card'
                          ? 'bg-primary/10 border-primary'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      <div className="text-left">
                        <p className="font-medium text-foreground">Cartão de Crédito/Débito</p>
                        <p className="text-xs text-muted-foreground">Visa, Mastercard, Elo</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`w-full p-3 border rounded-lg transition flex items-center gap-3 ${
                        paymentMethod === 'pix'
                          ? 'bg-primary/10 border-primary'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      <QrCode className="w-5 h-5" />
                      <div className="text-left">
                        <p className="font-medium text-foreground">PIX</p>
                        <p className="text-xs text-muted-foreground">QR Code ou Cópia e Cola</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
                  <p className="font-medium mb-1">📌 Importante</p>
                  <p>
                    {paymentMethod === 'pix'
                      ? 'Você receberá um QR Code ou dados para transferência PIX na próxima tela.'
                      : 'Você será redirecionado para a página segura de pagamento com cartão.'}
                  </p>
                </div>

                {/* CTA */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processando...' : `Contribuir R$ ${formData.amount || '0'}`}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Pagamento seguro processado por Stripe
                </p>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
