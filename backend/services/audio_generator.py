"""
Audio Generator Service for Flowchart Video Generator.
Converts text explanations to speech using various TTS engines.
"""
import os
import tempfile
import logging
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import asyncio
from concurrent.futures import ThreadPoolExecutor

try:
    import pyttsx3
    PYTTSX3_AVAILABLE = True
except ImportError:
    PYTTSX3_AVAILABLE = False

try:
    from gtts import gTTS
    GTTS_AVAILABLE = True
except ImportError:
    GTTS_AVAILABLE = False

try:
    import azure.cognitiveservices.speech as speechsdk
    AZURE_SPEECH_AVAILABLE = True
except ImportError:
    AZURE_SPEECH_AVAILABLE = False

try:
    from google.cloud import texttospeech
    GOOGLE_CLOUD_TTS_AVAILABLE = True
except ImportError:
    GOOGLE_CLOUD_TTS_AVAILABLE = False

from pydub import AudioSegment
from pydub.effects import normalize


logger = logging.getLogger(__name__)


class AudioGenerator:
    """
    Generate audio narration for flowchart videos using various TTS engines.
    """
    
    def __init__(self):
        self.temp_dir = Path(tempfile.mkdtemp())
        self.executor = ThreadPoolExecutor(max_workers=2)
        
        # Initialize available TTS engines
        self.engines = {}
        self._initialize_engines()
    
    def _initialize_engines(self):
        """Initialize available TTS engines."""
        if PYTTSX3_AVAILABLE:
            try:
                engine = pyttsx3.init()
                # Configure voice settings
                voices = engine.getProperty('voices')
                if voices:
                    # Prefer female voice if available
                    for voice in voices:
                        if 'female' in voice.name.lower() or 'zira' in voice.name.lower():
                            engine.setProperty('voice', voice.id)
                            break
                
                engine.setProperty('rate', 160)  # Speaking rate
                engine.setProperty('volume', 0.9)  # Volume level
                self.engines['pyttsx3'] = engine
                logger.info("✅ Initialized pyttsx3 TTS engine")
            except Exception as e:
                logger.warning(f"⚠️  Failed to initialize pyttsx3: {e}")
        
        if GTTS_AVAILABLE:
            self.engines['gtts'] = True
            logger.info("✅ Google TTS (gTTS) available")
        
        if AZURE_SPEECH_AVAILABLE:
            # Check for Azure Speech API key
            if os.getenv('AZURE_SPEECH_KEY') and os.getenv('AZURE_SPEECH_REGION'):
                self.engines['azure'] = True
                logger.info("✅ Azure Speech TTS available")
        
        if GOOGLE_CLOUD_TTS_AVAILABLE:
            # Check for Google Cloud credentials
            if os.getenv('GOOGLE_APPLICATION_CREDENTIALS'):
                self.engines['google_cloud'] = True
                logger.info("✅ Google Cloud TTS available")
    
    async def generate_narration_script(self, flowchart_elements: Dict) -> str:
        """
        Generate a natural narration script from flowchart elements.
        
        Args:
            flowchart_elements: Dictionary containing nodes, connections, and metadata
            
        Returns:
            str: Natural language narration script
        """
        try:
            nodes = flowchart_elements.get('nodes', [])
            connections = flowchart_elements.get('connections', [])
            title = flowchart_elements.get('title', 'Flowchart')
            
            script_parts = []
            
            # Introduction
            script_parts.append(f"Welcome to this {title} explanation.")
            script_parts.append("Let's walk through each step of this process.")
            
            # Describe nodes in logical order
            for i, node in enumerate(nodes):
                node_text = node.get('text', f'Step {i+1}')
                node_type = node.get('type', 'process')
                
                if node_type == 'start':
                    script_parts.append(f"We begin with: {node_text}")
                elif node_type == 'decision':
                    script_parts.append(f"Next, we make a decision: {node_text}")
                elif node_type == 'process':
                    script_parts.append(f"Then we proceed to: {node_text}")
                elif node_type == 'end':
                    script_parts.append(f"Finally, we reach: {node_text}")
                else:
                    script_parts.append(f"At this point: {node_text}")
            
            # Describe connections if meaningful
            if connections:
                script_parts.append("The arrows show the flow between these steps.")
                
                # Highlight decision branches
                decision_connections = [c for c in connections if c.get('condition')]
                if decision_connections:
                    script_parts.append("Notice the different paths based on the decisions made.")
            
            # Conclusion
            script_parts.append("This completes our walkthrough of the flowchart.")
            script_parts.append("Thank you for watching.")
            
            return " ".join(script_parts)
            
        except Exception as e:
            logger.error(f"Error generating narration script: {e}")
            return "Welcome to this flowchart explanation. Please review the visual elements to understand the process flow."
    
    async def generate_audio(
        self, 
        text: str, 
        engine: str = 'auto', 
        voice_settings: Optional[Dict] = None
    ) -> Path:
        """
        Generate audio from text using specified TTS engine.
        
        Args:
            text: Text to convert to speech
            engine: TTS engine to use ('auto', 'pyttsx3', 'gtts', 'azure', 'google_cloud')
            voice_settings: Optional voice configuration
            
        Returns:
            Path: Path to generated audio file
        """
        if engine == 'auto':
            engine = self._select_best_engine()
        
        if engine not in self.engines:
            raise ValueError(f"TTS engine '{engine}' not available")
        
        try:
            if engine == 'pyttsx3':
                return await self._generate_with_pyttsx3(text, voice_settings)
            elif engine == 'gtts':
                return await self._generate_with_gtts(text, voice_settings)
            elif engine == 'azure':
                return await self._generate_with_azure(text, voice_settings)
            elif engine == 'google_cloud':
                return await self._generate_with_google_cloud(text, voice_settings)
            else:
                raise ValueError(f"Unknown engine: {engine}")
                
        except Exception as e:
            logger.error(f"Audio generation failed with {engine}: {e}")
            # Fallback to simplest available engine
            if engine != 'pyttsx3' and 'pyttsx3' in self.engines:
                return await self._generate_with_pyttsx3(text, voice_settings)
            raise
    
    def _select_best_engine(self) -> str:
        """Select the best available TTS engine."""
        priority = ['azure', 'google_cloud', 'gtts', 'pyttsx3']
        for engine in priority:
            if engine in self.engines:
                return engine
        raise RuntimeError("No TTS engines available")
    
    async def _generate_with_pyttsx3(self, text: str, voice_settings: Optional[Dict]) -> Path:
        """Generate audio using pyttsx3 (offline)."""
        def _generate():
            engine = self.engines['pyttsx3']
            
            if voice_settings:
                if 'rate' in voice_settings:
                    engine.setProperty('rate', voice_settings['rate'])
                if 'volume' in voice_settings:
                    engine.setProperty('volume', voice_settings['volume'])
            
            audio_file = self.temp_dir / f"audio_{os.urandom(8).hex()}.wav"
            engine.save_to_file(text, str(audio_file))
            engine.runAndWait()
            return audio_file
        
        loop = asyncio.get_event_loop()
        audio_file = await loop.run_in_executor(self.executor, _generate)
        
        # Normalize audio
        await self._normalize_audio(audio_file)
        return audio_file
    
    async def _generate_with_gtts(self, text: str, voice_settings: Optional[Dict]) -> Path:
        """Generate audio using Google TTS (online)."""
        def _generate():
            language = voice_settings.get('language', 'en') if voice_settings else 'en'
            tld = voice_settings.get('tld', 'com') if voice_settings else 'com'
            slow = voice_settings.get('slow', False) if voice_settings else False
            
            tts = gTTS(text=text, lang=language, tld=tld, slow=slow)
            audio_file = self.temp_dir / f"audio_{os.urandom(8).hex()}.mp3"
            tts.save(str(audio_file))
            return audio_file
        
        loop = asyncio.get_event_loop()
        audio_file = await loop.run_in_executor(self.executor, _generate)
        
        # Convert to WAV and normalize
        wav_file = await self._convert_to_wav(audio_file)
        await self._normalize_audio(wav_file)
        return wav_file
    
    async def _generate_with_azure(self, text: str, voice_settings: Optional[Dict]) -> Path:
        """Generate audio using Azure Speech Services."""
        def _generate():
            speech_key = os.getenv('AZURE_SPEECH_KEY')
            service_region = os.getenv('AZURE_SPEECH_REGION')
            
            speech_config = speechsdk.SpeechConfig(
                subscription=speech_key, 
                region=service_region
            )
            
            voice_name = voice_settings.get('voice', 'en-US-AriaNeural') if voice_settings else 'en-US-AriaNeural'
            speech_config.speech_synthesis_voice_name = voice_name
            
            audio_file = self.temp_dir / f"audio_{os.urandom(8).hex()}.wav"
            audio_config = speechsdk.audio.AudioOutputConfig(filename=str(audio_file))
            
            synthesizer = speechsdk.SpeechSynthesizer(
                speech_config=speech_config, 
                audio_config=audio_config
            )
            
            result = synthesizer.speak_text_async(text).get()
            
            if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
                return audio_file
            else:
                raise Exception(f"Azure TTS failed: {result.reason}")
        
        loop = asyncio.get_event_loop()
        audio_file = await loop.run_in_executor(self.executor, _generate)
        await self._normalize_audio(audio_file)
        return audio_file
    
    async def _generate_with_google_cloud(self, text: str, voice_settings: Optional[Dict]) -> Path:
        """Generate audio using Google Cloud TTS."""
        def _generate():
            client = texttospeech.TextToSpeechClient()
            
            synthesis_input = texttospeech.SynthesisInput(text=text)
            
            language_code = voice_settings.get('language', 'en-US') if voice_settings else 'en-US'
            voice_name = voice_settings.get('voice', 'en-US-Wavenet-F') if voice_settings else 'en-US-Wavenet-F'
            
            voice = texttospeech.VoiceSelectionParams(
                language_code=language_code,
                name=voice_name
            )
            
            audio_config = texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.LINEAR16
            )
            
            response = client.synthesize_speech(
                input=synthesis_input,
                voice=voice,
                audio_config=audio_config
            )
            
            audio_file = self.temp_dir / f"audio_{os.urandom(8).hex()}.wav"
            with open(audio_file, 'wb') as out:
                out.write(response.audio_content)
            
            return audio_file
        
        loop = asyncio.get_event_loop()
        audio_file = await loop.run_in_executor(self.executor, _generate)
        await self._normalize_audio(audio_file)
        return audio_file
    
    async def _convert_to_wav(self, audio_file: Path) -> Path:
        """Convert audio file to WAV format."""
        def _convert():
            audio = AudioSegment.from_file(str(audio_file))
            wav_file = audio_file.with_suffix('.wav')
            audio.export(str(wav_file), format='wav')
            return wav_file
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self.executor, _convert)
    
    async def _normalize_audio(self, audio_file: Path):
        """Normalize audio levels."""
        def _normalize():
            audio = AudioSegment.from_wav(str(audio_file))
            normalized_audio = normalize(audio)
            normalized_audio.export(str(audio_file), format='wav')
        
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(self.executor, _normalize)
    
    def get_audio_duration(self, audio_file: Path) -> float:
        """Get audio duration in seconds."""
        audio = AudioSegment.from_file(str(audio_file))
        return len(audio) / 1000.0  # Convert milliseconds to seconds
    
    async def create_timed_narration(
        self, 
        flowchart_elements: Dict,
        total_video_duration: float
    ) -> Tuple[str, List[Dict]]:
        """
        Create timed narration script with timestamps.
        
        Args:
            flowchart_elements: Flowchart structure
            total_video_duration: Expected video duration in seconds
            
        Returns:
            Tuple of (narration_script, timing_segments)
        """
        script = await self.generate_narration_script(flowchart_elements)
        
        # Split script into segments based on flowchart elements
        nodes = flowchart_elements.get('nodes', [])
        sentences = script.split('. ')
        
        timing_segments = []
        time_per_segment = total_video_duration / len(sentences) if sentences else total_video_duration
        
        for i, sentence in enumerate(sentences):
            if sentence.strip():
                timing_segments.append({
                    'text': sentence.strip() + '.',
                    'start_time': i * time_per_segment,
                    'duration': time_per_segment,
                    'node_index': min(i, len(nodes) - 1) if nodes else 0
                })
        
        return script, timing_segments
    
    def cleanup(self):
        """Clean up temporary files."""
        try:
            import shutil
            shutil.rmtree(self.temp_dir)
        except Exception as e:
            logger.warning(f"Failed to cleanup audio temp directory: {e}")
