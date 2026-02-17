import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
        </div>

        <h1 className="text-3xl font-elegant text-foreground mb-2">
          Pagamento Cancelado
        </h1>

        <p className="text-muted-foreground mb-6">
          Você cancelou o pagamento. Nenhuma cobrança foi realizada em sua conta.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-900">
            <strong>O que fazer agora:</strong> Você pode tentar novamente ou explorar outros presentes da lista.
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/products">
            <Button className="w-full gap-2" size="lg">
              <ArrowLeft className="w-5 h-5" />
              Voltar para Produtos
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full" size="lg">
              Voltar para Home
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          Se você tiver dúvidas, entre em contato com o casal.
        </p>
      </Card>
    </div>
  );
}
