import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import { CheckCircle, Heart } from 'lucide-react';

export default function CheckoutSuccess() {
  const [, navigate] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Get session ID from URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('session_id');
    setSessionId(id);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        </div>

        <h1 className="text-3xl font-elegant text-foreground mb-2">
          Pagamento Confirmado!
        </h1>

        <p className="text-muted-foreground mb-6">
          Obrigado por sua contribuição para o casamento! Seu pagamento foi processado com sucesso.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-900">
            <strong>O que acontece agora:</strong> O valor será creditado na conta do casal para que eles possam adquirir os presentes que desejarem.
          </p>
        </div>

        {sessionId && (
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">ID da Sessão</p>
            <p className="text-sm font-mono text-foreground break-all">{sessionId}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full gap-2" size="lg">
              <Heart className="w-5 h-5" />
              Voltar para Home
            </Button>
          </Link>
          <Link href="/posts">
            <Button variant="outline" className="w-full" size="lg">
              Deixar uma Mensagem
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          Um email de confirmação foi enviado para você com os detalhes da transação.
        </p>
      </Card>
    </div>
  );
}
