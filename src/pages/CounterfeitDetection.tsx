import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';
import { UploadCloud, Image as ImageIcon, ScanSearch, CheckCircle2, XCircle, Tag, Package, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CounterfeitDetection() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<null | 'authentic' | 'counterfeit'>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (!imagePreview) {
      toast.error('Please upload an image first');
      return;
    }
    
    setIsAnalyzing(true);
    setResult(null);
    toast('Initializing Vision AI...', { icon: '👁️' });
    
    // Simulate AI thinking
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult('counterfeit');
      toast.error('Counterfeit indicators detected!', { icon: '🚨' });
    }, 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Authenticity Agent</h1>
        <p className="text-gray-400 mt-1">Detect counterfeit products using advanced computer vision.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h2 className="text-lg font-bold text-white mb-4">Product Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Brand</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" defaultValue="LuxuryBrand" className="w-full bg-surfaceLight/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Product Name</label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" defaultValue="Classic Leather Bag" className="w-full bg-surfaceLight/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Listed Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" defaultValue="350.00" className="w-full bg-surfaceLight/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Official MSRP</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" defaultValue="1200.00" className="w-full bg-surfaceLight/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-lg font-bold text-white mb-4">Product Images</h2>
            <div 
              className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-primary/50 hover:bg-white/5 transition-all cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              <div className="w-16 h-16 bg-surfaceLight rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-primary" />
              </div>
              <p className="text-white font-medium">Click or drag image to upload</p>
              <p className="text-sm text-gray-500 mt-1">Supports JPG, PNG, WebP (Max 10MB)</p>
            </div>
            
            <div className="mt-6">
              <Button className="w-full" size="lg" onClick={handleAnalyze} isLoading={isAnalyzing} disabled={!imagePreview}>
                <ScanSearch className="w-5 h-5 mr-2" />
                {isAnalyzing ? 'Running Computer Vision...' : 'Analyze Product Images'}
              </Button>
            </div>
          </GlassCard>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {!imagePreview && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border border-white/5 bg-surface/30 rounded-2xl"
              >
                <ImageIcon className="w-16 h-16 text-gray-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-300">No Image Selected</h3>
                <p className="text-gray-500 mt-2">Upload a product image to begin AI authenticity verification.</p>
              </motion.div>
            )}

            {imagePreview && !result && !isAnalyzing && (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="h-full border border-white/10 rounded-2xl overflow-hidden relative"
              >
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <p className="text-white font-bold text-lg">Ready for Analysis</p>
                </div>
              </motion.div>
            )}

            {isAnalyzing && (
              <motion.div 
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full border border-primary/30 rounded-2xl overflow-hidden relative"
              >
                <img src={imagePreview!} alt="Preview" className="w-full h-full object-cover opacity-30 blur-sm" />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
                  {/* Scanning animation */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-primary w-full animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                  
                  <ScanSearch className="w-16 h-16 text-primary animate-pulse mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Analyzing Pixels...</h3>
                  <div className="flex space-x-2 text-sm text-gray-300">
                    <span className="flex items-center"><Loader2 className="w-3 h-3 animate-spin mr-1"/> Logo structure</span>
                    <span className="flex items-center"><Loader2 className="w-3 h-3 animate-spin mr-1"/> Stitching patterns</span>
                  </div>
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="h-full flex flex-col"
              >
                <GlassCard className="p-6 mb-4 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white">Analysis Result</h3>
                      <p className="text-gray-400 text-sm mt-1">Vision Model V4.2</p>
                    </div>
                    {result === 'authentic' ? (
                      <StatusBadge status="authentic" text="Authentic" className="px-4 py-2 text-base" />
                    ) : (
                      <StatusBadge status="counterfeit" text="Counterfeit Detected" className="px-4 py-2 text-base" />
                    )}
                  </div>

                  <div className="relative rounded-xl overflow-hidden mb-6 border border-white/10 group">
                    <img src={imagePreview!} alt="Analyzed" className="w-full aspect-video object-cover" />
                    
                    {/* Simulated Heatmap Overlay */}
                    {result === 'counterfeit' && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-danger/40 via-transparent to-transparent mix-blend-overlay">
                        {/* Bounding box */}
                        <div className="absolute bottom-1/4 left-1/4 w-1/3 h-1/4 border-2 border-danger shadow-[0_0_15px_rgba(239,68,68,0.5)] bg-danger/20">
                          <span className="absolute -top-6 left-0 bg-danger text-white text-xs px-2 py-0.5 rounded font-bold">Logo Mismatch</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-surfaceLight/50 rounded-xl p-4 border border-white/5">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium text-gray-300">Overall Confidence</span>
                      <span className="text-lg font-bold text-white">96.8%</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 flex items-center"><XCircle className="w-4 h-4 text-danger mr-2" /> Logo Geometry</span>
                        <span className="text-danger font-mono">Failed</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 flex items-center"><CheckCircle2 className="w-4 h-4 text-success mr-2" /> Material Texture</span>
                        <span className="text-success font-mono">Passed</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 flex items-center"><XCircle className="w-4 h-4 text-danger mr-2" /> Price Anomaly</span>
                        <span className="text-danger font-mono">-70% vs MSRP</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
                
                <div className="flex space-x-3">
                  <Button variant="danger" className="flex-1">Remove Listing</Button>
                  <Button variant="secondary" className="flex-1">Send to Human Review</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Add this to index.css or a style tag, it's needed for the loader
const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);
