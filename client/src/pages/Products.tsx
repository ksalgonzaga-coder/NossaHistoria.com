import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Link } from 'wouter';
import { Search, ShoppingCart, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface ProductDetail {
  id: number;
  name: string;
  description?: string | null;
  price: string;
  imageUrl?: string | null;
  category?: string | null;
  quantity: number;
  quantitySold: number;
}

export default function Products() {
  const { data: products = [], isLoading } = trpc.products.list.useQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  const handleSelectProduct = (product: ProductDetail) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleCheckout = (product: ProductDetail) => {
    // Redirect to checkout page with product info
    window.location.href = `/checkout?productId=${product.id}&amount=${product.price}`;
  };

  const availableQuantity = selectedProduct
    ? selectedProduct.quantity - selectedProduct.quantitySold
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border shadow-elegant">
        <div className="container py-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-4xl font-elegant text-foreground">Lista de Presentes</h1>
          <p className="text-muted-foreground mt-2">
            Escolha um presente especial para o casal
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-elegant p-6 sticky top-24">
              <h2 className="text-lg font-elegant mb-4 text-foreground">Filtros</h2>

              {/* Search */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar presentes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">
                    Categorias
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-smooth ${
                        selectedCategory === null
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      Todos
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-smooth ${
                          selectedCategory === category
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground hover:bg-muted/80'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content - Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-muted rounded-lg h-80 animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Nenhum presente encontrado. Tente ajustar seus filtros.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const available = product.quantity - product.quantitySold;
                  return (
                    <Card
                      key={product.id}
                      className="overflow-hidden hover:shadow-elegant-lg transition-smooth cursor-pointer group"
                      onClick={() => handleSelectProduct(product)}
                    >
                      {/* Product Image */}
                      <div className="relative w-full h-48 bg-muted overflow-hidden">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingCart className="w-12 h-12 text-muted-foreground" />
                          </div>
                        )}
                        {available === 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-semibold">Indisponível</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        {product.category && (
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                            {product.category}
                          </p>
                        )}
                        <h3 className="font-elegant text-lg text-foreground mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        {/* Price and Availability */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-elegant text-primary">
                            R$ {parseFloat(product.price).toFixed(2)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {available} disponível{available !== 1 ? 's' : ''}
                          </span>
                        </div>

                        {/* Action Button */}
                        <Button
                          className="w-full gap-2"
                          disabled={available === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectProduct(product);
                          }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Escolher
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-elegant">
                  {selectedProduct.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedProduct.category && (
                    <span className="text-xs uppercase tracking-wider">
                      {selectedProduct.category}
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6 py-4">
                {/* Image */}
                <div className="bg-muted rounded-lg overflow-hidden h-64 md:h-80">
                  {selectedProduct.imageUrl ? (
                    <img
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingCart className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-col justify-between">
                  {selectedProduct.description && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-foreground mb-2">Descrição</h3>
                      <p className="text-muted-foreground">{selectedProduct.description}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Valor da Cota</p>
                      <p className="text-4xl font-elegant text-primary">
                        R$ {parseFloat(selectedProduct.price).toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Disponibilidade</p>
                      <p className="text-lg font-semibold text-foreground">
                        {availableQuantity} cota{availableQuantity !== 1 ? 's' : ''} disponível{availableQuantity !== 1 ? 's' : ''}
                      </p>
                    </div>

                    <Button
                      size="lg"
                      className="w-full gap-2"
                      disabled={availableQuantity === 0}
                    onClick={() => {
                      handleCheckout(selectedProduct);
                    }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Contribuir Agora
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
