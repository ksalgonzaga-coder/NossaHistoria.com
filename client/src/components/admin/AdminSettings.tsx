import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Settings } from 'lucide-react';

interface SettingsForm {
  groomName: string;
  brideName: string;
  weddingDate: string;
  description: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankCode: string;
  pixKey: string;
  stripeAccountId: string;
}

export default function AdminSettings() {
  const { data: weddingInfo } = trpc.wedding.get.useQuery();
  const updateMutation = trpc.wedding.update.useMutation();

  const [formData, setFormData] = useState<SettingsForm>({
    groomName: '',
    brideName: '',
    weddingDate: '',
    description: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankCode: '',
    pixKey: '',
    stripeAccountId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (weddingInfo) {
      setFormData({
        groomName: weddingInfo.groomName || '',
        brideName: weddingInfo.brideName || '',
        weddingDate: weddingInfo.weddingDate
          ? new Date(weddingInfo.weddingDate).toISOString().split('T')[0]
          : '',
        description: weddingInfo.description || '',
        bankAccountName: weddingInfo.bankAccountName || '',
        bankAccountNumber: weddingInfo.bankAccountNumber || '',
        bankCode: weddingInfo.bankCode || '',
        pixKey: weddingInfo.pixKey || '',
        stripeAccountId: weddingInfo.stripeAccountId || '',
      });
    }
  }, [weddingInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.groomName.trim() || !formData.brideName.trim()) {
      toast.error('Nomes do casal são obrigatórios');
      return;
    }

    setIsSubmitting(true);

    try {
      await updateMutation.mutateAsync({
        groomName: formData.groomName || undefined,
        brideName: formData.brideName || undefined,
        weddingDate: formData.weddingDate ? new Date(formData.weddingDate) : undefined,
        description: formData.description || undefined,
        bankAccountName: formData.bankAccountName || undefined,
        bankAccountNumber: formData.bankAccountNumber || undefined,
        bankCode: formData.bankCode || undefined,
        pixKey: formData.pixKey || undefined,
        stripeAccountId: formData.stripeAccountId || undefined,
      });
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-elegant text-foreground mb-6">Configurações do Casamento</h2>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        {/* Wedding Info Section */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Informações do Casal
          </h3>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Nome do Noivo *
                </label>
                <Input
                  placeholder="Ex: João"
                  value={formData.groomName}
                  onChange={(e) =>
                    setFormData({ ...formData, groomName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Nome da Noiva *
                </label>
                <Input
                  placeholder="Ex: Maria"
                  value={formData.brideName}
                  onChange={(e) =>
                    setFormData({ ...formData, brideName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Data do Casamento
              </label>
              <Input
                type="date"
                value={formData.weddingDate}
                onChange={(e) =>
                  setFormData({ ...formData, weddingDate: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Descrição
              </label>
              <Textarea
                placeholder="Conte um pouco sobre vocês..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
              />
            </div>
          </div>
        </Card>

        {/* Bank Info Section */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Informações Bancárias
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Estas informações serão usadas para receber as contribuições dos convidados.
          </p>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Nome da Conta
              </label>
              <Input
                placeholder="Ex: João Silva"
                value={formData.bankAccountName}
                onChange={(e) =>
                  setFormData({ ...formData, bankAccountName: e.target.value })
                }
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Número da Conta
                </label>
                <Input
                  placeholder="Ex: 123456-7"
                  value={formData.bankAccountNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, bankAccountNumber: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Código do Banco
                </label>
                <Input
                  placeholder="Ex: 001"
                  value={formData.bankCode}
                  onChange={(e) =>
                    setFormData({ ...formData, bankCode: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Chave PIX
              </label>
              <Input
                placeholder="Ex: email@exemplo.com ou CPF"
                value={formData.pixKey}
                onChange={(e) =>
                  setFormData({ ...formData, pixKey: e.target.value })
                }
              />
            </div>
          </div>
        </Card>

        {/* Stripe Section */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Configuração Stripe
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            ID da conta Stripe para processar pagamentos.
          </p>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              ID da Conta Stripe
            </label>
            <Input
              placeholder="Ex: acct_1234567890"
              value={formData.stripeAccountId}
              onChange={(e) =>
                setFormData({ ...formData, stripeAccountId: e.target.value })
              }
            />
          </div>
        </Card>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </form>
    </div>
  );
}
