// Sound player utility for keyboard click sounds

type SoundMode = "off" | "nk cream" | "osu";
type ErrorSoundMode = "off" | "blow" | "slap" | "whoosh";

interface SoundConfig {
   defines: Record<string, string | null>;
}

const soundConfigs: Record<string, SoundConfig | null> = {
   off: null,
   "nk cream": null,
   osu: null,
};

const audioCache: Record<string, HTMLAudioElement> = {};

// Load sound pack configuration
export const loadSoundConfig = async (mode: SoundMode) => {
   if (mode === "off") return null;

   const packPath =
      mode === "nk cream"
         ? "/assets/sounds/clicks/nk cream"
         : "/assets/sounds/clicks/Osu";

   try {
      const response = await fetch(`${packPath}/config.json`);
      const config: SoundConfig = await response.json();
      soundConfigs[mode] = config;
      return config;
   } catch (error) {
      console.error(`Failed to load sound config for ${mode}:`, error);
      return null;
   }
};

// Preload a sound file
const preloadSound = (path: string) => {
   if (audioCache[path]) return audioCache[path];

   const audio = new Audio(path);
   audio.preload = "auto";
   audioCache[path] = audio;
   return audio;
};

// Play sound for a specific key code
export const playKeySound = (
   keyCode: number,
   mode: SoundMode,
   volume: number = 0.5
) => {
   if (mode === "off") return;
   if (!keyCode || keyCode === 0) return; // Skip if keyCode is invalid

   const config = soundConfigs[mode];
   if (!config) return;

   const soundFile = config.defines[keyCode.toString()];
   if (!soundFile) return;

   const packPath =
      mode === "nk cream"
         ? "/assets/sounds/clicks/nk cream"
         : "/assets/sounds/clicks/Osu";

   const soundPath = `${packPath}/${soundFile}`;

   // Get or create audio element
   let audio = audioCache[soundPath];
   if (!audio) {
      audio = preloadSound(soundPath);
   }

   // Clone and play to allow multiple simultaneous sounds
   const audioClone = audio.cloneNode() as HTMLAudioElement;
   audioClone.volume = volume; // Set volume from parameter
   audioClone.play().catch((error) => {
      // Ignore autoplay policy errors
      if (error.name !== "NotAllowedError") {
         console.error("Error playing sound:", error);
      }
   });
};

// Preload common sounds for better performance
export const preloadSounds = async (mode: SoundMode) => {
   if (mode === "off") return;

   const config = await loadSoundConfig(mode);
   if (!config) return;

   const packPath =
      mode === "nk cream"
         ? "/assets/sounds/clicks/nk cream"
         : "/assets/sounds/clicks/Osu";

   // Preload common key sounds
   const commonKeys = Object.values(config.defines).filter(
      (file) => file !== null
   ) as string[];
   const uniqueSounds = [...new Set(commonKeys)];

   uniqueSounds.forEach((soundFile) => {
      const soundPath = `${packPath}/${soundFile}`;
      preloadSound(soundPath);
   });
};

// Play error sound
export const playErrorSound = (mode: ErrorSoundMode, volume: number = 0.5) => {
   if (mode === "off") return;

   const soundPath = `/assets/sounds/errors/${
      mode.charAt(0).toUpperCase() + mode.slice(1)
   }.mp3`;

   // Get or create audio element
   let audio = audioCache[soundPath];
   if (!audio) {
      audio = preloadSound(soundPath);
   }

   // Clone and play to allow multiple simultaneous sounds
   const audioClone = audio.cloneNode() as HTMLAudioElement;
   audioClone.volume = volume;
   audioClone.play().catch((error) => {
      // Ignore autoplay policy errors
      if (error.name !== "NotAllowedError") {
         console.error("Error playing error sound:", error);
      }
   });
};
