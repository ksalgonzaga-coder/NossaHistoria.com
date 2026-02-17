import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function Contribute() {
  const [, setLocation] = useLocation();
  const [amount, setAmount] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  const handleContribute = () => {
    if (!amount.trim() || !guestName.trim()) {
      toast.error('Preencha o valor e seu nome');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Digite um valor válido');
      return;
    }

    // Redirect to checkout with custom amount
    const params = new URLSearchParams({
      amount: numAmount.toString(),
      guestName,
      guestEmail: guestEmail || '',
      isCustom: 'true',
    });
    setLocation(`/checkout?${params.toString()}`);
  };

  const quickAmounts = [50, 100, 200, 500];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border shadow-elegant">
        <div className="container py-8">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <div>
              <h1 className="text-4xl font-elegant text-foreground">Contribuir Livremente</h1>
              <p className="text-muted-foreground mt-2">
                Escolha o valor que deseja contribuir para nosso casamento
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-md mx-auto">
          <Card className="p-8 space-y-6">
            {/* Quick amounts */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Valores Sugeridos
              </label>
              <div className="grid grid-cols-2 gap-3">
                {quickAmounts.map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={() => setAmount(quickAmount.toString())}
                    className={`p-3 border rounded-lg transition font-medium ${
                      amount === quickAmount.toString()
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    R$ {quickAmount}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom amount */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Outro Valor
              </label>
              <div className="flex gap-2">
                <span className="text-lg font-medium text-foreground pt-2">R$</span>
                <input
                  type="number"
                  placeholder="Digite o valor"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 px-3 py-2 border border-border rounded-md text-sm"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            {/* Guest info */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Seu Nome *
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
              <label className="text-sm font-medium text-foreground mb-2 block">
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

            {/* CTA */}
            <Button
              size="lg"
              onClick={handleContribute}
              className="w-full"
            >
              Contribuir R$ {amount || '0'}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Você será redirecionado para a página de pagamento segura
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
