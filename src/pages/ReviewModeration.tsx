import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { MessageSquareWarning, User, Calendar, ShieldAlert, CheckCircle2, MessageSquareX, History } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';

export default function ReviewModeration() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<null | any>(null);
  const [reviewText, setReviewText] = useState('This product is absolutely amazing! I bought 10 of them for all my friends and they all love it. It cured my back pain and made me rich. Highly recommend! Best product ever! A+++++');

  const handleAnalyze = () => {
    if (!reviewText) return;
    
    setIsAnalyzing(true);
    setResult(null);
    toast('Running NLP Models...', { icon: '🤖' });
    
    // Simulate AI thinking
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        classification: 'Fake',
        confidence: 98.5,
        highlights: [
          { word: 'cured my back pain', reason: 'Unverified medical claim' },
          { word: 'made me rich', reason: 'Unrealistic outcome' },
          { word: 'bought 10 of them', reason: 'Anomalous purchase quantity' },
          { word: 'A+++++', reason: 'Spam pattern' }
        ],
        reviewer: {
          trustScore: 12,
          accountAge: '2 days',
          totalReviews: 45
        }
      });
      toast.error('AI generated review detected');
    }, 2000);
  };

  const getHighlightedText = () => {
    if (!result) return reviewText;
    
    let highlightedText = reviewText;
    result.highlights.forEach((h: any) => {
      highlightedText = highlightedText.replace(
        h.word, 
        `<span class="bg-danger/20 text-red-300 px-1 rounded border border-danger/30 group relative cursor-help">
          ${h.word}
          <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-xs bg-surface p-2 rounded-lg text-xs text-white border border-white/10 shadow-xl z-10">
            ${h.reason}
          </span>
        </span>`
      );
    });
    
    return <div dangerouslySetInnerHTML={{ __html: highlightedText }} className="leading-relaxed" />;
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Review Moderation Agent</h1>
        <p className="text-gray-400 mt-1">Detect fake, malicious, and AI-generated reviews using NLP.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-6 flex flex-col">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center">
            <MessageSquareWarning className="w-5 h-5 mr-2 text-primary" />
            Review Content
          </h2>
          
          <textarea 
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full flex-1 min-h-[250px] bg-surfaceLight/50 border border-white/10 rounded-xl p-4 text-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
            placeholder="Paste review text here..."
          />
          
          <div className="mt-6">
            <Button className="w-full" size="lg" onClick={handleAnalyze} isLoading={isAnalyzing} disabled={!reviewText}>
              Analyze Text Sentiment & Authenticity
            </Button>
          </div>
        </GlassCard>

        <div className="relative">
          <AnimatePresence mode="wait">
            {!result && !isAnalyzing && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 border border-white/5 bg-surface/30 rounded-2xl"
              >
                <MessageSquareX className="w-16 h-16 text-gray-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-300">Awaiting Input</h3>
                <p className="text-gray-500 mt-2">Enter text to perform linguistic analysis.</p>
              </motion.div>
            )}

            {isAnalyzing && (
              <motion.div 
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-12 bg-surfaceLight/20 rounded-2xl border border-primary/20"
              >
                <div className="flex space-x-1 mb-6">
                  {[0, 1, 2].map(i => (
                    <motion.div 
                      key={i}
                      className="w-4 h-4 bg-primary rounded-full"
                      animate={{ y: [0, -15, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Processing NLP Model...</h3>
                <p className="text-gray-400">Analyzing semantic patterns and linguistic anomalies</p>
              </motion.div>
            )}

            {result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <GlassCard className="p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-danger/10 rounded-full blur-3xl"></div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white">Classification</h3>
                      <p className="text-gray-400 text-sm mt-1">Transformer-based LLM detector</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="px-3 py-1 rounded-full bg-danger/20 text-danger border border-danger/30 text-sm font-bold uppercase tracking-wider flex items-center">
                        <ShieldAlert className="w-4 h-4 mr-1.5" />
                        {result.classification}
                      </span>
                      <span className="text-xs text-gray-500 mt-2">Confidence: <span className="text-white font-medium">{result.confidence}%</span></span>
                    </div>
                  </div>

                  <div className="bg-surfaceLight/80 rounded-xl p-5 border border-white/5 mb-6 text-gray-300 text-sm">
                    {getHighlightedText()}
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                    <div>
                      <p className="text-xs text-gray-500 flex items-center mb-1"><User className="w-3 h-3 mr-1"/> Trust Score</p>
                      <p className={cn("text-lg font-bold", result.reviewer.trustScore < 30 ? "text-danger" : "text-success")}>
                        {result.reviewer.trustScore}/100
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 flex items-center mb-1"><Calendar className="w-3 h-3 mr-1"/> Account Age</p>
                      <p className="text-lg font-bold text-white">{result.reviewer.accountAge}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 flex items-center mb-1"><History className="w-3 h-3 mr-1"/> Total Reviews</p>
                      <p className="text-lg font-bold text-warning">{result.reviewer.totalReviews}</p>
                    </div>
                  </div>
                </GlassCard>

                <div className="flex space-x-3">
                  <Button variant="danger" className="flex-1">Delete Review & Ban User</Button>
                  <Button variant="outline" className="flex-1">Flag for Human</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
