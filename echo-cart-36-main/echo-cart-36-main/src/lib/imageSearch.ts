/**
 * Image Search Utility
 * Handles image feature extraction and similarity matching for visual search
 */

let tf: any = null;
let mobilenet: any = null;
let model: any = null;
let isModelLoading = false;
let isModelAvailable = false;
let modelCheckDone = false;

// Check if TensorFlow.js is available
async function checkTensorFlowAvailability(): Promise<boolean> {
  if (modelCheckDone) {
    return isModelAvailable;
  }

  try {
    // Try to dynamically import TensorFlow.js
    // @ts-expect-error - TensorFlow.js may not be installed
    const tfModule = await import('@tensorflow/tfjs');
    // @ts-expect-error - TensorFlow.js may not be installed
    const mobilenetModule = await import('@tensorflow-models/mobilenet');
    tf = tfModule;
    mobilenet = mobilenetModule;
    isModelAvailable = true;
    modelCheckDone = true;
    return true;
  } catch (error) {
    console.warn('TensorFlow.js not available. Visual search will be disabled.');
    isModelAvailable = false;
    modelCheckDone = true;
    return false;
  }
}

/**
 * Check if TensorFlow.js is available
 */
export async function isTensorFlowAvailable(): Promise<boolean> {
  return await checkTensorFlowAvailability();
}

/**
 * Synchronous check (may not be accurate until async check completes)
 */
export function isTensorFlowAvailableSync(): boolean {
  return isModelAvailable;
}

/**
 * Load the MobileNet model for feature extraction
 */
export async function loadModel(): Promise<any> {
  const available = await checkTensorFlowAvailability();
  if (!available) {
    throw new Error('TensorFlow.js is not installed. Please run: npm install @tensorflow/tfjs @tensorflow-models/mobilenet');
  }

  if (model) {
    return model;
  }

  if (isModelLoading) {
    // Wait for the model to finish loading
    while (!model) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return model;
  }

  isModelLoading = true;
  try {
    await tf.ready();
    model = await mobilenet.load();
    isModelLoading = false;
    return model;
  } catch (error) {
    isModelLoading = false;
    throw new Error('Failed to load image recognition model. Make sure TensorFlow.js packages are installed.');
  }
}

/**
 * Extract features from an image using MobileNet
 */
export async function extractImageFeatures(imageElement: HTMLImageElement): Promise<Float32Array> {
  const available = await checkTensorFlowAvailability();
  if (!available) {
    throw new Error('TensorFlow.js is not available');
  }
  const model = await loadModel();
  const activation = model.infer(imageElement, true);
  const features = await activation.data();
  activation.dispose();
  return features as Float32Array;
}

/**
 * Load an image from a file and return an HTMLImageElement
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Load an image from a URL and return an HTMLImageElement
 */
export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Calculate cosine similarity between two feature vectors
 */
export function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  if (a.length !== b.length) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size too large. Please upload an image smaller than 10MB.',
    };
  }

  return { valid: true };
}

/**
 * Preprocess image for model input (resize to 224x224)
 */
export function preprocessImage(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 224;
  canvas.height = 224;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Calculate scaling to maintain aspect ratio
  const scale = Math.min(224 / img.width, 224 / img.height);
  const x = (224 - img.width * scale) / 2;
  const y = (224 - img.height * scale) / 2;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 224, 224);
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

  return canvas;
}

/**
 * Extract features from an image file
 */
export async function extractFeaturesFromFile(file: File): Promise<Float32Array> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const img = await loadImageFromFile(file);
  const canvas = preprocessImage(img);
  const processedImg = new Image();
  processedImg.src = canvas.toDataURL();
  
  await new Promise((resolve) => {
    processedImg.onload = resolve;
  });

  return await extractImageFeatures(processedImg);
}

/**
 * Find similar products based on image features
 */
export function findSimilarProducts(
  queryFeatures: Float32Array,
  productFeatures: Array<{ productId: string; features: Float32Array }>,
  threshold: number = 0.5
): Array<{ productId: string; similarity: number }> {
  const similarities = productFeatures
    .map(({ productId, features }) => ({
      productId,
      similarity: cosineSimilarity(queryFeatures, features),
    }))
    .filter(({ similarity }) => similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity);

  return similarities;
}

