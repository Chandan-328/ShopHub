import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  stock: number;
  categories: { name: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, selectedCategory, searchQuery, sortBy]);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    if (data) setCategories(data);
  };

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*, categories(name)");
    if (data) setProducts(data as any);
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.categories?.name.toLowerCase().replace("'s", "s") === selectedCategory.toLowerCase().replace("'s", "s")
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

    setFilteredProducts(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[400px] bg-gradient-to-r from-primary to-accent overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1472851294608-062f824d29cc')] bg-cover bg-center" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Discover Your Style</h1>
            <p className="text-xl mb-8">Shop the latest trends in fashion, beauty, and more</p>
            <Button size="lg" variant="secondary">Shop Now</Button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="all" className="mb-8" onValueChange={setSelectedCategory}>
          <TabsList className="flex flex-wrap w-full gap-2 p-1 h-auto">
            <TabsTrigger value="all" className="flex-shrink-0">All</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.name} className="flex-shrink-0 text-sm">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image_url}
              category={product.categories?.name || ""}
              stock={product.stock}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
