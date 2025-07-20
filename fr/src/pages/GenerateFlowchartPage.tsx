import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Download, Sparkles, FileText, Video, X } from 'lucide-react';
import { apiService, type VideoGenerationRequest, type VideoGenerationResponse } from '@/lib/api';
import { ErrorModal } from '@/components/ui/error-modal';
import { VideoPlayer } from '@/components/ui/video-player';
import { PulsingDots, MagicSpinner, FloatingElements, WaveLoader, ParticleField } from '@/components/ui/loading-components';

export const GenerateFlowchartPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedVideo, setGeneratedVideo] = useState<VideoGenerationResponse | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [typingText, setTypingText] = useState('');
  const [showSplitView, setShowSplitView] = useState(false);
  const [messages, setMessages] = useState<Array<{id: string, type: 'ai' | 'user', content: string, images?: File[]}>>([]);
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const typingOptions = [
    'hackathon presentation',
    'mini project presentation', 
    'Web dev',
    'devops'
  ];

  // Typing animation effect
  useEffect(() => {
    let currentIndex = 0;
    let currentText = '';
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const type = () => {
      const currentOption = typingOptions[currentIndex];
      
      if (isDeleting) {
        currentText = currentOption.substring(0, currentText.length - 1);
      } else {
        currentText = currentOption.substring(0, currentText.length + 1);
      }
      
      setTypingText(currentText);
      
      let typeSpeed = isDeleting ? 50 : 100;
      
      if (!isDeleting && currentText === currentOption) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && currentText === '') {
        isDeleting = false;
        currentIndex = (currentIndex + 1) % typingOptions.length;
        typeSpeed = 500; // Pause before next word
      }
      
      timeoutId = setTimeout(type, typeSpeed);
    };

    type();
    
    return () => clearTimeout(timeoutId);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    // Add user message and switch to split view
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: prompt,
      images: uploadedImages.length > 0 ? [...uploadedImages] : undefined
    };
    
    setMessages([userMessage]);
    setShowSplitView(true);
    setIsGenerating(true);
    setProgress(0);
    setError(null);
    setGeneratedVideo(null);
    
    // Clear the input
    const currentPrompt = prompt;
    setPrompt('');
    setUploadedImages([]);
    
    try {
      // Check backend health first
      await apiService.checkHealth();
      
      // Prepare request with correct quality format
      const request: VideoGenerationRequest = {
        prompt: currentPrompt,
        quality: 'high_quality', // Use backend's expected format
        format: 'mp4',
        include_audio: true
      };
      
      // Start progress animation
      let progressValue = 0;
      const progressInterval = setInterval(() => {
        if (progressValue < 20) {
          progressValue += Math.random() * 5; // Slow start
        } else if (progressValue < 50) {
          progressValue += Math.random() * 3; // Medium pace
        } else if (progressValue < 80) {
          progressValue += Math.random() * 2; // Slower as we wait
        } else {
          progressValue += Math.random() * 1; // Very slow near completion
        }
        progressValue = Math.min(progressValue, 85); // Cap at 85% until completion
        setProgress(progressValue);
      }, 2000); // Update every 2 seconds
      
      // Generate video
      const response = await apiService.generateVideo(request);
      
      if (response.success && response.video_id) {
        // Video generation started, now poll for completion
        const estimatedDuration = response.complexity_analysis?.estimated_duration || 30;
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `Great! I'm now generating your flowchart video. This will take approximately ${estimatedDuration} seconds. I'll let you know when it's ready!`
        }]);
        
        // Poll for completion
        try {
          const completionResult = await apiService.waitForVideoCompletion(response.video_id);
          clearInterval(progressInterval);
          
          if (completionResult.success && completionResult.video_path) {
            setProgress(100);
            
            // Create a complete response object
            const completeResponse: VideoGenerationResponse = {
              ...response,
              status: 'completed',
              video_path: completionResult.video_path,
              audio_path: completionResult.audio_path
            };
            
            setGeneratedVideo(completeResponse);
            
            // Add AI success message
            setMessages(prev => [...prev, {
              id: (Date.now() + 2).toString(),
              type: 'ai',
              content: "Perfect! Your animated flowchart is ready! You can preview it on the right and download it in various formats."
            }]);
          } else {
            throw new Error(completionResult.error || 'Video generation failed during processing');
          }
        } catch (pollError) {
          clearInterval(progressInterval);
          throw pollError;
        }
      } else {
        clearInterval(progressInterval);
        throw new Error(response.error || 'Failed to start video generation');
      }
    } catch (err) {
      console.error('Video generation error:', err);
      
      let errorMessage = 'An unexpected error occurred while generating your video.';
      let errorTitle = 'Generation Failed';
      
      if (err instanceof Error) {
        if (err.message.includes('Network Error') || err.message.includes('timeout')) {
          errorTitle = 'Connection Error';
          errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        } else if (err.message.includes('500')) {
          errorTitle = 'Server Error';
          errorMessage = 'The server encountered an error while processing your request. Please try again later.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError({ title: errorTitle, message: errorMessage });
      
      // Add AI error message
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Sorry, I encountered an error while generating your flowchart: ${errorMessage}`
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const imageFiles = Array.from(files).filter(file => 
        file.type.startsWith('image/')
      );
      setUploadedImages(prev => [...prev, ...imageFiles]);
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          setUploadedImages(prev => [...prev, file]);
        }
      }
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRetry = () => {
    setError(null);
    handleGenerate();
  };

  const exportFormats = [
    { name: 'MP4 Video', icon: <Video className="w-4 h-4" />, size: '2.1 MB' },
    { name: 'PNG Image', icon: <FileText className="w-4 h-4" />, size: '890 KB' },
    { name: 'SVG Vector', icon: <Sparkles className="w-4 h-4" />, size: '45 KB' }
  ];

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: 'url(/background-section1.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[0.5px]" />
      
      {/* Subtle grain texture overlay */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      
      <div className="relative z-10 pt-24 pb-16 px-4">
        {!showSplitView ? (
          // Initial Simple Input Interface - Lovable Style
          <div className="max-w-7xl mx-auto min-h-[80vh] flex flex-col justify-center">
            {/* Header - Lovable Style */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                Build something with{'  '} {" "}
                <span className="inline-flex items-center gap-3">
                 <img className='w-16 h-16 ml-6' src="/mountainai.png" alt="Mountain AI Logo" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-500 to-purple-500">
                    Flowable
                  </span>
                </span>
              </h1>
              
              <p className="text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed font-medium">
                Create flowcharts and diagrams by chatting with AI
              </p>
            </motion.div>

            {/* Main Input Interface - Lovable Style */}
            <motion.div
              className="w-[100vh] mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* Uploaded Images Preview */}
              {uploadedImages.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-4 p-4 bg-black/20 rounded-xl border border-white/10">
                  {uploadedImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border border-white/20 transition-transform group-hover:scale-105"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Main Input Field */}
              <div className="bg-black/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onPaste={handlePaste}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleGenerate();
                      }
                    }}
                    placeholder={`Ask Mountain AI to create a flowchart for ${typingText}|`}
                    className="w-full min-h-[120px] bg-transparent border-none px-8 py-6 text-white/90 placeholder-white/40 resize-none focus:outline-none text-xl leading-relaxed"
                    rows={3}
                    style={{ 
                      resize: 'none',
                      overflow: 'hidden'
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = Math.max(120, target.scrollHeight) + 'px';
                    }}
                  />
                  
                  {/* Send button */}
                  <div className="absolute bottom-4 right-4">
                    <motion.button
                      onClick={handleGenerate}
                      disabled={!prompt.trim() || isGenerating}
                      className="w-12 h-12 bg-white hover:bg-white disabled:bg-white/50 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
                      whileHover={{ scale: !isGenerating ? 1.05 : 1 }}
                      whileTap={{ scale: !isGenerating ? 0.95 : 1 }}
                    >
                      {isGenerating ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600" />
                      ) : (
                        <ArrowLeft className="w-6 h-6 text-black rotate-180" />
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="px-6 py-4 border-t border-white/10 bg-black/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Plus button */}
                      <button 
                        onClick={handleAttachClick}
                        className="w-8 h-8 bg-black/20 hover:bg-zinc-900 border border-white/20 rounded-lg flex items-center justify-center transition-all duration-200"
                      >
                        <span className="text-white/80 text-lg font-light">+</span>
                      </button>
                      
                      {/* Attach button */}
                      <button 
                        onClick={handleAttachClick}
                        className="flex items-center gap-2 px-4 py-1 bg-black/10 hover:bg-zinc-900 border border-white/20 text-sm rounded-full transition-all duration-200"
                      >
                        <FileText className="w-4 h-4 text-white/70" />
                        <span className="text-white/70 font-medium">Attach</span>
                      </button>
                      
                      {/* Public button */}
                      <button className="flex items-center gap-2 px-4 py-1 bg-black/10 hover:bg-zinc-900 border border-white/20 rounded-full text-sm transition-all duration-200">
                        <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                        </svg>
                        <span className="text-white/70 font-medium">Public</span>
                      </button>
                      
                      {/* Mountain AI dropdown */}
                      <button className="flex items-center gap-2 px-4 py-1 bg-black/10 hover:bg-zinc-900 border border-white/20 rounded-xl transition-all duration-200">
                        <img
                          src="/mountainai.png"
                          alt="Mountain AI"
                          className="w-4 h-4"
                        />
                        <span className="text-white/70 font-medium">Claude Sonnet 4</span>
                        <svg className="w-4 h-4 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    {/* Up arrow button */}
                    <button className="w-8 h-8 bg-black/20 hover:bg-zinc-900 border border-white/20 rounded-lg flex items-center justify-center transition-all duration-200">
                      <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </motion.div>
          </div>
        ) : (
          // Split View - Chat + Preview
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[70vh]">
              {/* Left Side - Chat Interface */}
              <motion.div
                className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl flex flex-col min-h-[600px]"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="p-6 border-b border-white/[0.08]">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-xl">
                      <Sparkles className="w-5 h-5 text-blue-400" />
                    </div>
                    AI Assistant
                  </h2>
                </div>

                {/* Messages */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                  {messages.map((message) => (
                    <div key={message.id}>
                      {message.type === 'user' ? (
                        <motion.div 
                          className="flex gap-3 justify-end"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <div className="bg-blue-600/80 rounded-2xl rounded-tr-sm px-4 py-3 max-w-md">
                            <p className="text-white leading-relaxed">{message.content}</p>
                            {message.images && message.images.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {message.images.map((file, index) => (
                                  <img
                                    key={index}
                                    src={URL.createObjectURL(file)}
                                    alt={`Uploaded ${index + 1}`}
                                    className="w-12 h-12 object-cover rounded-lg border border-white/20"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-medium">U</span>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div 
                          className="flex gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-3 max-w-md">
                            <p className="text-white/90 leading-relaxed">{message.content}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}

                  {/* AI Processing Message */}
                  {isGenerating && (
                    <motion.div 
                      className="flex gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-white" />
                      </div>
                      <div className="bg-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-3 max-w-md">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="animate-pulse p-1.5 bg-blue-500/20 rounded-lg">
                            <Sparkles className="w-3 h-3 text-blue-400" />
                          </div>
                          <span className="text-white/90 text-sm font-medium">Processing your request...</span>
                        </div>
                        
                        <div className="w-full bg-white/20 rounded-full h-1.5 mb-2">
                          <motion.div 
                            className="bg-gradient-to-r from-blue-400 to-purple-400 h-1.5 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        
                        <div className="text-xs text-white/70">
                          {progress < 30 && "Analyzing your requirements..."}
                          {progress >= 30 && progress < 60 && "Designing flowchart structure..."}
                          {progress >= 60 && progress < 90 && "Generating animations..."}
                          {progress >= 90 && "Finalizing your flowchart..."}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* New Message Input */}
                <div className="p-6 border-t border-white/[0.08]">
                  <div className="relative">
                    <div className="flex items-end gap-3">
                      <button 
                        onClick={handleAttachClick}
                        className="flex-shrink-0 w-10 h-10 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.12] rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                      >
                        <FileText className="w-5 h-5 text-white/70" />
                      </button>
                      
                      <div className="flex-1 relative">
                        <textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          onPaste={handlePaste}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleGenerate();
                            }
                          }}
                          placeholder="Continue the conversation..."
                          className="w-full min-h-[44px] max-h-32 bg-white/[0.06] border border-white/[0.12] rounded-xl px-4 py-3 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                          rows={1}
                        />
                      </div>
                      
                      <motion.button
                        onClick={handleGenerate}
                        disabled={!prompt.trim() || isGenerating}
                        className="flex-shrink-0 w-10 h-10 bg-blue-600/80 hover:bg-blue-600 disabled:bg-gray-600/50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all duration-200"
                        whileHover={{ scale: !isGenerating ? 1.05 : 1 }}
                        whileTap={{ scale: !isGenerating ? 0.95 : 1 }}
                      >
                        {isGenerating ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        ) : (
                          <ArrowLeft className="w-5 h-5 text-white rotate-180" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Side - Preview */}
              <motion.div
                className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl flex flex-col min-h-[600px]"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="p-6 border-b border-white/[0.08]">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-xl">
                      <Play className="w-5 h-5 text-purple-400" />
                    </div>
                    Preview & Export
                  </h2>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                  {!generatedVideo ? (
                    <div className="h-full flex items-center justify-center">
                      {isGenerating ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center text-white relative"
                        >
                          {/* Floating background elements */}
                          <FloatingElements className="absolute inset-0 w-full h-full" />
                          <ParticleField className="absolute inset-0 w-full h-full" />
                          
                          <div className="relative z-10 mb-6">
                            <MagicSpinner size="lg" className="mx-auto mb-4" />
                            <WaveLoader className="justify-center mb-4" />
                            <PulsingDots className="justify-center mb-4" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Generating your flowchart...
                          </h3>
                          <p className="text-white/60 mb-4">This may take a few moments</p>
                          <div className="w-64 bg-white/10 rounded-full h-2 mx-auto relative overflow-hidden">
                            <motion.div
                              className="bg-gradient-to-r from-blue-400 to-purple-400 h-full rounded-full relative"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.5 }}
                            >
                              {/* Shimmering effect */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "linear"
                                }}
                              />
                            </motion.div>
                          </div>
                          <p className="text-white/40 text-sm mt-2">{progress}% complete</p>
                        </motion.div>
                      ) : (
                        <div className="text-center text-white/50">
                          <Play className="w-16 h-16 mx-auto mb-4 opacity-30" />
                          <p className="text-lg">Your animated flowchart will appear here</p>
                          <p className="text-sm mt-2">Start a conversation to generate your flowchart</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="h-full flex flex-col p-2"
                    >
                      {/* Video Player */}
                      <div className="flex-shrink-0 mb-6">
                        <VideoPlayer
                          videoUrl={apiService.getVideoUrl(generatedVideo.video_path!)}
                          audioUrl={generatedVideo.audio_path ? apiService.getAudioUrl(generatedVideo.audio_path) : undefined}
                          title={`Generated: ${messages[0]?.content || 'Flowchart Animation'}`}
                          onDownload={() => {
                            // Create download link
                            const link = document.createElement('a');
                            link.href = apiService.getVideoUrl(generatedVideo.video_path!);
                            link.download = `flowchart-${Date.now()}.mp4`;
                            link.click();
                          }}
                          onOpenInNewTab={() => {
                            window.open(apiService.getVideoUrl(generatedVideo.video_path!), '_blank');
                          }}
                        />
                      </div>

                      {/* Export Options */}
                      <div className="flex-1 min-h-0">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                          <div className="p-1.5 bg-green-500/20 rounded-lg">
                            <Download className="w-5 h-5 text-green-400" />
                          </div>
                          Export Options
                        </h3>
                        
                        <div className="space-y-3">
                          {exportFormats.map((format, index) => (
                            <motion.button
                              key={index}
                              className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200 flex items-center justify-between"
                              whileHover={{ x: 3 }}
                            >
                              <div className="flex items-center gap-3">
                                {format.icon}
                                <span className="text-white font-medium">{format.name}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-white/60 text-sm">{format.size}</span>
                                <Download className="w-4 h-4 text-white/60" />
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
      
      {/* Error Modal */}
      <ErrorModal
        isOpen={error !== null}
        onClose={() => setError(null)}
        title={error?.title || 'Error'}
        message={error?.message || 'An unexpected error occurred'}
        onRetry={handleRetry}
      />
    </div>
  );
};
