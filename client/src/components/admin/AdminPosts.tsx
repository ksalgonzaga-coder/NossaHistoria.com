import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Trash2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPosts() {
  const { data: posts = [], isLoading, refetch } = trpc.posts.listAll.useQuery();
  const approveMutation = trpc.posts.approve.useMutation();
  const deleteMutation = trpc.posts.delete.useMutation();

  const handleApprove = async (id: number) => {
    try {
      await approveMutation.mutateAsync({ id });
      toast.success('Post aprovado!');
      refetch();
    } catch (error) {
      toast.error('Erro ao aprovar post');
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este post?')) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success('Post deletado!');
      refetch();
    } catch (error) {
      toast.error('Erro ao deletar post');
      console.error(error);
    }
  };

  const pendingPosts = posts.filter((p) => !p.isApproved);
  const approvedPosts = posts.filter((p) => p.isApproved);

  return (
    <div>
      <h2 className="text-2xl font-elegant text-foreground mb-6">Moderação de Posts</h2>

      {/* Pending Posts */}
      {pendingPosts.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Pendentes de Aprovação ({pendingPosts.length})
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {pendingPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                {post.imageUrl && (
                  <div className="bg-muted h-40 overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.guestName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{post.guestName}</h4>
                    <Badge variant="outline" className="bg-yellow-50">
                      Pendente
                    </Badge>
                  </div>
                  {post.guestEmail && (
                    <p className="text-xs text-muted-foreground mb-2">{post.guestEmail}</p>
                  )}
                  {post.message && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {post.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mb-4">
                    {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handleApprove(post.id)}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Aprovar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Rejeitar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Approved Posts */}
      {approvedPosts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Aprovados ({approvedPosts.length})
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {approvedPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                {post.imageUrl && (
                  <div className="bg-muted h-40 overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.guestName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{post.guestName}</h4>
                    <Badge className="bg-green-100 text-green-800">Aprovado</Badge>
                  </div>
                  {post.guestEmail && (
                    <p className="text-xs text-muted-foreground mb-2">{post.guestEmail}</p>
                  )}
                  {post.message && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {post.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mb-4">
                    {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Deletar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum post ainda</p>
        </div>
      ) : null}
    </div>
  );
}
