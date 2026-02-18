import { useEffect, useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Heart, TrendingUp, Gift, DollarSign, Edit2, Save } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CoupleDashboard() {
  const { user } = useAuth();
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  
  // Queries
  const { data: stats } = trpc.dashboard.getStats.useQuery();
  const { data: transactions = [] } = trpc.dashboard.getTransactions.useQuery({ limit: 10 });
  const { data: monthlyStats = [] } = trpc.dashboard.getMonthlyStats.useQuery();
  const { data: paymentInfo } = trpc.dashboard.getPaymentInfo.useQuery();
  
  // Mutations
  const updatePaymentMutation = trpc.dashboard.updatePaymentInfo.useMutation();
  
  // Form state
  const [paymentForm, setPaymentForm] = useState({
    bankName: paymentInfo?.bankName || '',
    accountType: paymentInfo?.accountType || 'checking',
    accountHolder: paymentInfo?.accountHolder || '',
    accountNumber: paymentInfo?.accountNumber || '',
    routingNumber: paymentInfo?.routingNumber || '',
    pixKey: paymentInfo?.pixKey || '',
    pixKeyType: paymentInfo?.pixKeyType || 'cpf',
  });

  useEffect(() => {
    if (paymentInfo) {
      setPaymentForm({
        bankName: paymentInfo.bankName || '',
        accountType: paymentInfo.accountType || 'checking',
        accountHolder: paymentInfo.accountHolder || '',
        accountNumber: paymentInfo.accountNumber || '',
        routingNumber: paymentInfo.routingNumber || '',
        pixKey: paymentInfo.pixKey || '',
        pixKeyType: paymentInfo.pixKeyType || 'cpf',
      });
    }
  }, [paymentInfo]);

  const handleSavePayment = async () => {
    try {
      await updatePaymentMutation.mutateAsync(paymentForm);
      toast.success('Dados bancários atualizados com sucesso!');
      setIsEditingPayment(false);
    } catch (error) {
      toast.error('Erro ao atualizar dados bancários');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Acesso restrito ao casal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-elegant text-foreground">Dashboard do Casal</h1>
          </div>
          <p className="text-muted-foreground">Acompanhe o saldo total de contribuições e histórico de presentes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Total Contributions */}
          <Card className="p-6 shadow-elegant">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Saldo Total</p>
                <p className="text-3xl font-bold text-primary">
                  R$ {stats?.totalContributions.toFixed(2) || '0.00'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {stats?.totalTransactions || 0} contribuições
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          {/* Transaction Count */}
          <Card className="p-6 shadow-elegant">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Total de Contribuições</p>
                <p className="text-3xl font-bold text-primary">
                  {stats?.totalTransactions || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Convidados que contribuíram
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Gift className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          {/* Average Contribution */}
          <Card className="p-6 shadow-elegant">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Média por Contribuição</p>
                <p className="text-3xl font-bold text-primary">
                  R$ {stats?.averageContribution.toFixed(2) || '0.00'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Valor médio
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chart */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-elegant">
              <h2 className="text-xl font-elegant text-foreground mb-6">Contribuições por Mês</h2>
              {monthlyStats.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      formatter={(value) => `R$ ${Number(value).toFixed(2)}`}
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#d946ef" 
                      strokeWidth={2}
                      dot={{ fill: '#d946ef', r: 5 }}
                      name="Valor (R$)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Nenhuma contribuição registrada ainda
                </div>
              )}
            </Card>
          </div>

          {/* Payment Info */}
          <div>
            <Card className="p-6 shadow-elegant">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-elegant text-foreground">Dados Bancários</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingPayment(true)}
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>

              {paymentInfo ? (
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Banco</p>
                    <p className="font-medium text-foreground">{paymentInfo.bankName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Titular</p>
                    <p className="font-medium text-foreground">{paymentInfo.accountHolder || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Conta</p>
                    <p className="font-medium text-foreground">{paymentInfo.accountNumber || '-'}</p>
                  </div>
                  {paymentInfo.pixKey && (
                    <div>
                      <p className="text-muted-foreground">Chave PIX</p>
                      <p className="font-medium text-foreground text-xs break-all">{paymentInfo.pixKey}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-4">
                    Nenhum dado bancário configurado
                  </p>
                  <Button
                    onClick={() => setIsEditingPayment(true)}
                    className="w-full"
                  >
                    Adicionar Dados
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Recent Transactions */}
        <Card className="p-6 shadow-elegant mt-8">
          <h2 className="text-xl font-elegant text-foreground mb-6">Últimas Contribuições</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Convidado</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Valor</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Data</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-border hover:bg-primary/5">
                      <td className="py-3 px-4">{tx.guestName}</td>
                      <td className="py-3 px-4 font-semibold text-primary">
                        R$ {parseFloat(tx.amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tx.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : tx.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {tx.status === 'completed' ? 'Concluído' : tx.status === 'pending' ? 'Pendente' : 'Cancelado'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground">
                      Nenhuma contribuição registrada ainda
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Payment Info Dialog */}
      <Dialog open={isEditingPayment} onOpenChange={setIsEditingPayment}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-elegant">Dados Bancários</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Banco
                </label>
                <Input
                  placeholder="Ex: Banco do Brasil"
                  value={paymentForm.bankName}
                  onChange={(e) => setPaymentForm({ ...paymentForm, bankName: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Tipo de Conta
                </label>
                <select
                  value={paymentForm.accountType}
                  onChange={(e) => setPaymentForm({ ...paymentForm, accountType: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="checking">Conta Corrente</option>
                  <option value="savings">Conta Poupança</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Titular da Conta
              </label>
              <Input
                placeholder="Nome completo"
                value={paymentForm.accountHolder}
                onChange={(e) => setPaymentForm({ ...paymentForm, accountHolder: e.target.value })}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Número da Conta
                </label>
                <Input
                  placeholder="12345-6"
                  value={paymentForm.accountNumber}
                  onChange={(e) => setPaymentForm({ ...paymentForm, accountNumber: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Código do Banco
                </label>
                <Input
                  placeholder="001"
                  value={paymentForm.routingNumber}
                  onChange={(e) => setPaymentForm({ ...paymentForm, routingNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="font-medium text-foreground mb-4">Chave PIX (Opcional)</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Tipo de Chave
                  </label>
                  <select
                    value={paymentForm.pixKeyType}
                    onChange={(e) => setPaymentForm({ ...paymentForm, pixKeyType: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="cpf">CPF</option>
                    <option value="email">Email</option>
                    <option value="phone">Telefone</option>
                    <option value="random">Aleatória</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Chave PIX
                  </label>
                  <Input
                    placeholder="Sua chave PIX"
                    value={paymentForm.pixKey}
                    onChange={(e) => setPaymentForm({ ...paymentForm, pixKey: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsEditingPayment(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                className="flex-1 gap-2"
                onClick={handleSavePayment}
                disabled={updatePaymentMutation.isPending}
              >
                <Save className="w-4 h-4" />
                {updatePaymentMutation.isPending ? 'Salvando...' : 'Salvar Dados'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
