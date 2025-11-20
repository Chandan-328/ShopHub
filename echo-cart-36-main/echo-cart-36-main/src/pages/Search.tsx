import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Upload,
  Image as ImageIcon,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  extractFeaturesFromFile,
  loadImageFromUrl,
  extractImageFeatures,
  preprocessImage,
  validateImageFile,
  findSimilarProducts,
  isTensorFlowAvailable,
  isTensorFlowAvailableSync,
} from "@/lib/imageSearch";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  stock: number;
  categories: { name: string };
  features?: Float32Array;
}

interface ProductWithSimilarity extends Product {
  similarity: number;
}

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithSimilarity[]>([]);
  const [sortBy, setSortBy] = useState("name");
  const [searchMode, setSearchMode] = useState<"text" | "visual">("text");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
    initializeModel();
  }, []);

  useEffect(() => {
    if (searchMode === "text" && searchQuery) {
      performTextSearch();
    }
  }, [searchQuery, searchMode, products, sortBy]);

  useEffect(() => {
    if (filteredProducts.length > 0) {
      const sorted = [...filteredProducts];
      
      if (sortBy === "price-low") {
        sorted.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-high") {
        sorted.sort((a, b) => b.price - a.price);
      } else if (sortBy === "similarity" && searchMode === "visual") {
        sorted.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
      } else if (sortBy === "name") {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
      }
      
      setFilteredProducts(sorted);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, searchMode]);

  const initializeModel = async () => {
    try {
      setIsProcessing(true);
      setProcessingProgress(10);
      
      const available = await isTensorFlowAvailable();
      if (!available) {
        setError("Visual search requires TensorFlow.js. Please install dependencies: npm install @tensorflow/tfjs @tensorflow-models/mobilenet");
        setIsModelLoaded(false);
        setIsProcessing(false);
        return;
      }

      setProcessingProgress(30);
      // Pre-load the model
      const { loadModel } = await import("@/lib/imageSearch");
      await loadModel();
      setProcessingProgress(100);
      setIsModelLoaded(true);
      setIsProcessing(false);
    } catch (err: any) {
      console.error("Failed to load model:", err);
      setError(err.message || "Failed to initialize image search. Please install TensorFlow.js dependencies.");
      setIsModelLoaded(false);
      setIsProcessing(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await supabase
        .from("products")
        .select("*, categories(name)");
      if (data) {
        setProducts(data as any);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const performTextSearch = () => {
    let filtered = products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

    setFilteredProducts(
      filtered.map((p) => ({ ...p, similarity: 1 }))
    );
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid image file");
      toast({
        title: "Error",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setError(null);
    setUploadedFile(file);
    setSearchMode("visual");

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Perform visual search
    await performVisualSearch(file);
  };

  const performVisualSearch = async (file: File) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setError(null);

    try {
      setProcessingProgress(20);

      // Extract features from uploaded image
      const queryFeatures = await extractFeaturesFromFile(file);
      setProcessingProgress(50);

      // Extract features from all product images
      const productFeatures: Array<{ productId: string; features: Float32Array }> = [];
      
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        if (product.image_url) {
          try {
            const img = await loadImageFromUrl(product.image_url);
            const canvas = preprocessImage(img);
            const processedImg = new Image();
            processedImg.src = canvas.toDataURL();
            
            await new Promise((resolve) => {
              processedImg.onload = resolve;
            });

            const features = await extractImageFeatures(processedImg);
            productFeatures.push({
              productId: product.id,
              features,
            });
          } catch (err) {
            console.warn(`Failed to process image for product ${product.id}:`, err);
          }
        }
        setProcessingProgress(50 + (i / products.length) * 40);
      }

      setProcessingProgress(90);

      // Find similar products
      const similarities = findSimilarProducts(queryFeatures, productFeatures, 0.3);
      
      // Map similarities to products
      const similarProducts: ProductWithSimilarity[] = similarities
        .map(({ productId, similarity }) => {
          const product = products.find((p) => p.id === productId);
          return product ? { ...product, similarity } : null;
        })
        .filter((p): p is ProductWithSimilarity => p !== null);

      // Sort by similarity by default
      similarProducts.sort((a, b) => b.similarity - a.similarity);

      setFilteredProducts(similarProducts);
      setProcessingProgress(100);

      if (similarProducts.length === 0) {
        toast({
          title: "No similar products found",
          description: "Try uploading a different image or adjust your search.",
        });
      } else {
        toast({
          title: `Found ${similarProducts.length} similar products`,
        });
      }
    } catch (err: any) {
      console.error("Visual search error:", err);
      setError(err.message || "Failed to perform visual search. Please try again.");
      toast({
        title: "Error",
        description: err.message || "Failed to perform visual search",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setUploadedFile(null);
    setFilteredProducts([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setSearchMode("text");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchMode === "text" && searchQuery) {
      setSearchParams({ q: searchQuery });
      performTextSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Search Products</h1>

        {/* Search Mode Tabs */}
        <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as "text" | "visual")} className="mb-6">
          <TabsList>
            <TabsTrigger value="text">Text Search</TabsTrigger>
            <TabsTrigger value="visual">Visual Search</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search Input Section */}
        <div className="mb-8">
          {searchMode === "text" ? (
            <form onSubmit={handleSearchSubmit} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products by name..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={isProcessing}
                      />
                      <label htmlFor="image-upload">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          disabled={isProcessing || !isModelLoaded}
                          asChild
                        >
                          <span className="cursor-pointer">
                            <Upload className="h-4 w-4 mr-2 inline" />
                            {uploadedImage ? "Change Image" : "Upload Image"}
                          </span>
                        </Button>
                      </label>
                    </div>
                    {uploadedImage && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveImage}
                        disabled={isProcessing}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {uploadedImage && (
                    <div className="relative w-full max-w-md mx-auto">
                      <img
                        src={uploadedImage}
                        alt="Uploaded"
                        className="w-full h-auto rounded-lg border"
                      />
                      {isProcessing && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                          <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                            <p className="text-sm">Processing image...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {!isModelLoaded && !isProcessing && isTensorFlowAvailableSync() && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Loading image recognition model...
                      </AlertDescription>
                    </Alert>
                  )}

                  {!isTensorFlowAvailableSync() && !isProcessing && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Visual search is not available. Please install TensorFlow.js dependencies by running: 
                        <code className="ml-2 px-2 py-1 bg-muted rounded text-sm">
                          npm install @tensorflow/tfjs @tensorflow-models/mobilenet
                        </code>
                      </AlertDescription>
                    </Alert>
                  )}

                  {isProcessing && (
                    <div className="space-y-2">
                      <Progress value={processingProgress} />
                      <p className="text-sm text-muted-foreground text-center">
                        Analyzing image... {Math.round(processingProgress)}%
                      </p>
                    </div>
                  )}

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {!isModelLoaded && (
                    <p className="text-sm text-muted-foreground text-center">
                      Please wait while we load the image recognition model...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sort Options */}
        {filteredProducts.length > 0 && (
          <div className="mb-6 flex justify-end">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                {searchMode === "visual" && (
                  <SelectItem value="similarity">Most Similar</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Results */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="mb-4">
              <p className="text-muted-foreground">
                {searchMode === "visual"
                  ? `Found ${filteredProducts.length} similar product${filteredProducts.length !== 1 ? "s" : ""}`
                  : `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""}`}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image_url}
                    category={product.categories?.name || ""}
                    stock={product.stock}
                  />
                  {searchMode === "visual" && product.similarity !== undefined && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold">
                      {Math.round(product.similarity * 100)}% match
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          searchQuery || uploadedImage ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg mb-4">
                  {searchMode === "visual"
                    ? "No similar products found. Try uploading a different image."
                    : "No products found. Try a different search term."}
                </p>
                <Button onClick={() => navigate("/")}>Browse All Products</Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg mb-4">
                  {searchMode === "visual"
                    ? "Upload an image to find visually similar products"
                    : "Enter a search term to find products"}
                </p>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
};

export default SearchPage;

