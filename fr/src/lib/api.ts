import axios from 'axios';

// API Configuration
const API_BASE_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes for video generation
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Types
export interface VideoGenerationRequest {
  prompt: string;
  quality?: 'low_quality' | 'medium_quality' | 'high_quality';
  format?: string;
  include_audio?: boolean;
}

export interface VideoGenerationResponse {
  success: boolean;
  message: string;
  video_id?: string;
  status?: 'processing' | 'completed' | 'failed';
  video_path?: string;
  audio_path?: string;
  error?: string;
  complexity_analysis?: {
    complexity: string;
    word_count: number;
    line_count: number;
    estimated_duration: number;
  };
  audio_enabled?: boolean;
}

export interface VideoStatusResponse {
  success: boolean;
  video_id: string;
  status: 'processing' | 'completed' | 'failed';
  video_path?: string;
  audio_path?: string;
  error?: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  features: {
    video_generation: boolean;
    audio_narration: boolean;
    manim_available: boolean;
  };
}

// API Functions
export const apiService = {
  // Health check
  async checkHealth(): Promise<HealthResponse> {
    const response = await api.get<HealthResponse>('/health');
    return response.data;
  },

  // Generate video from prompt
  async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    const response = await api.post<VideoGenerationResponse>('/api/generate-video', request);
    return response.data;
  },

  // Check video status
  async checkVideoStatus(videoId: string): Promise<VideoStatusResponse> {
    try {
      const response = await api.get<VideoStatusResponse>(`/api/video/${videoId}/status`);
      return response.data;
    } catch (error) {
      // If status endpoint doesn't exist, try to check if files exist
      try {
        await api.get(`/api/videos/${videoId}`, { 
          method: 'HEAD',
          timeout: 5000 
        });
        return {
          success: true,
          video_id: videoId,
          status: 'completed',
          video_path: `${videoId}_with_audio.mp4`
        };
      } catch {
        return {
          success: false,
          video_id: videoId,
          status: 'processing'
        };
      }
    }
  },

  // Poll for video completion
  async waitForVideoCompletion(videoId: string, maxAttempts: number = 30): Promise<VideoStatusResponse> {
    let attempts = 0;
    
    // Wait initial delay before starting to poll (give backend time to start processing)
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before first check
    
    while (attempts < maxAttempts) {
      try {
        // Check if video files exist by trying to access them
        const videoWithAudio = `${videoId}_with_audio.mp4`;
        const videoWithoutAudio = `${videoId}.mp4`;
        
        // Check for video with audio first
        try {
          const response = await fetch(`${API_BASE_URL}/static/videos/${videoWithAudio}`, { 
            method: 'HEAD',
            cache: 'no-cache'
          });
          if (response.ok) {
            return {
              success: true,
              video_id: videoId,
              status: 'completed',
              video_path: videoWithAudio,
              audio_path: videoWithAudio
            };
          }
        } catch (error) {
          console.log(`Attempt ${attempts + 1}: Video with audio not ready yet`);
        }
        
        // Try video without audio
        try {
          const response = await fetch(`${API_BASE_URL}/static/videos/${videoWithoutAudio}`, { 
            method: 'HEAD',
            cache: 'no-cache'
          });
          if (response.ok) {
            return {
              success: true,
              video_id: videoId,
              status: 'completed',
              video_path: videoWithoutAudio
            };
          }
        } catch (error) {
          console.log(`Attempt ${attempts + 1}: Video without audio not ready yet`);
        }
        
        // Video not ready yet, wait and try again
        console.log(`Polling attempt ${attempts + 1}/${maxAttempts} - waiting 3 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds between attempts
        attempts++;
        
      } catch (error) {
        console.error('Error checking video status:', error);
        await new Promise(resolve => setTimeout(resolve, 3000));
        attempts++;
      }
    }
    
    return {
      success: false,
      video_id: videoId,
      status: 'failed',
      error: 'Video generation timeout - please try again'
    };
  },

  // Get video file URL
  getVideoUrl(filename: string): string {
    return `${API_BASE_URL}/static/videos/${filename}`;
  },

  // Get audio file URL
  getAudioUrl(filename: string): string {
    return `${API_BASE_URL}/static/videos/${filename}`;
  }
};

export default apiService;
