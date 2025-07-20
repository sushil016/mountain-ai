import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Download, Sparkles, FileText, Video, X, ExternalLink } from 'lucide-react';

export const GenerateFlowchartPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedFlowchart, setGeneratedFlowchart] = useState<any>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [typingText, setTypingText] = useState('');
  const [showSplitView, setShowSplitView] = useState(false);
  const [messages, setMessages] = useState<Array<{id: string, type: 'ai' | 'user', content: string, images?: File[]}>>([]);
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
    
    // Clear the input
    setPrompt('');
    setUploadedImages([]);
    
    // Simulate AI generation progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsGenerating(false);
          setGeneratedFlowchart({
            title: "Generated Flowchart",
            duration: "2.3s",
            format: "MP4 • 1080p"
          });
          
          // Add AI success message
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: "Perfect! I've created your animated flowchart. You can preview it on the right and export it in various formats."
          }]);
          
          return 100;
        }
        return prev + 10;
      });
    }, 300);
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

  const openVideoInNewTab = () => {
    // In a real implementation, this would open the actual video file
    window.open('/generated-flowchart-preview.html', '_blank');
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
      
      <div className="relative z-10 pt-32 pb-20 px-4">
        {!showSplitView ? (
          // Initial Simple Input Interface
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.06] backdrop-blur-xl rounded-full border border-white/[0.08] mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-white/80 text-sm font-medium">AI-Powered Flowchart Generator</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                Generate
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  Flowcharts
                </span>
              </h1>
              
              <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                Transform your ideas into beautiful animated flowcharts with AI. 
                Simply describe what you need, and watch it come to life.
              </p>
            </motion.div>

            {/* Main Input Card */}
            <motion.div
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 shadow-2xl">
                {/* Uploaded Images Preview */}
                {uploadedImages.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-6 p-4 bg-white/[0.04] rounded-xl border border-white/[0.08]">
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

                <div className="space-y-6">
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
                      className="w-full min-h-[120px] bg-white/[0.06] border border-white/[0.12] rounded-xl px-6 py-4 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-lg"
                      rows={4}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = Math.max(120, target.scrollHeight) + 'px';
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Attach button */}
                    <button 
                      onClick={handleAttachClick}
                      className="flex items-center gap-2 px-4 py-3 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.12] rounded-xl transition-all duration-200 hover:scale-105"
                    >
                      <FileText className="w-5 h-5 text-white/70" />
                      <span className="text-white/80 font-medium">Attach</span>
                    </button>
                    
                    {/* Generate button */}
                    <motion.button
                      onClick={handleGenerate}
                      disabled={!prompt.trim() || isGenerating}
                      className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-xl font-semibold text-white transition-all duration-200"
                      whileHover={{ scale: !isGenerating ? 1.02 : 1 }}
                      whileTap={{ scale: !isGenerating ? 0.98 : 1 }}
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>Generate Flowchart</span>
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Input hints */}
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span>Press Enter to generate • Shift + Enter for new line</span>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-green-400" />
                      <span>AI-Powered</span>
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
              </div>
            </motion.div>
          </div>
        ) : (
          // Split View - Chat + Preview
          <div className="max-w-7xl mx-auto h-[calc(100vh-12rem)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              {/* Left Side - Chat Interface */}
              <motion.div
                className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl flex flex-col"
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
                className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl flex flex-col"
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

                <div className="flex-1 p-6">
                  {!generatedFlowchart ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center text-white/50">
                        <Play className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg">Your animated flowchart will appear here</p>
                        <p className="text-sm mt-2">Start a conversation to generate your flowchart</p>
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="h-full flex flex-col"
                    >
                      {/* Video Preview */}
                      <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-white/20 flex items-center justify-center relative overflow-hidden mb-6">
                        {/* Animated flowchart simulation */}
                        <div className="absolute inset-4">
                          <svg className="w-full h-full" viewBox="0 0 400 200">
                            <motion.circle
                              cx="50" cy="50" r="20"
                              fill="#3b82f6"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.5 }}
                            />
                            <motion.rect
                              x="150" y="30" width="100" height="40" rx="5"
                              fill="#8b5cf6"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.8 }}
                            />
                            <motion.circle
                              cx="350" cy="50" r="20"
                              fill="#10b981"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 1.1 }}
                            />
                            <motion.path
                              d="M70 50 L150 50"
                              stroke="#ffffff"
                              strokeWidth="2"
                              fill="none"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ delay: 0.6, duration: 0.5 }}
                            />
                            <motion.path
                              d="M250 50 L330 50"
                              stroke="#ffffff"
                              strokeWidth="2"
                              fill="none"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ delay: 0.9, duration: 0.5 }}
                            />
                          </svg>
                        </div>
                        <div className="absolute top-4 left-4 bg-black/50 rounded-full p-2">
                          <Play className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      
                      {/* Video Controls */}
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {generatedFlowchart.title}
                          </h3>
                          <p className="text-white/60 text-sm">
                            {generatedFlowchart.duration} • {generatedFlowchart.format}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={openVideoInNewTab}
                            className="px-3 py-2 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.12] text-white rounded-lg transition-colors flex items-center gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span className="hidden sm:inline">Open</span>
                          </button>
                          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2">
                            <Play className="w-4 h-4" />
                            Play
                          </button>
                        </div>
                      </div>

                      {/* Export Options */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
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
                              whileHover={{ x: 5 }}
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
    </div>
  );
};
