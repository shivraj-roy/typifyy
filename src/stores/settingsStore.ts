import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
   ThresholdMode,
   SoundMode,
   ErrorSoundMode,
   TimeWarningMode,
   LiveProgressMode,
   CapsLockWarningMode,
} from "../types";

interface SettingsStore {
   minSpeedMode: ThresholdMode;
   minSpeedValue: number;
   minAccuracyMode: ThresholdMode;
   minAccuracyValue: number;
   soundVolume: number;
   soundMode: SoundMode;
   errorSoundMode: ErrorSoundMode;
   timeWarningMode: TimeWarningMode;
   liveProgressMode: LiveProgressMode;
   capsLockWarningMode: CapsLockWarningMode;
   setMinSpeedMode: (mode: ThresholdMode) => void;
   setMinSpeedValue: (value: number) => void;
   setMinAccuracyMode: (mode: ThresholdMode) => void;
   setMinAccuracyValue: (value: number) => void;
   setSoundVolume: (volume: number) => void;
   setSoundMode: (mode: SoundMode) => void;
   setErrorSoundMode: (mode: ErrorSoundMode) => void;
   setTimeWarningMode: (mode: TimeWarningMode) => void;
   setLiveProgressMode: (mode: LiveProgressMode) => void;
   setCapsLockWarningMode: (mode: CapsLockWarningMode) => void;
   resetSettings: () => void;
}

const DEFAULT_SETTINGS = {
   minSpeedMode: "off" as ThresholdMode,
   minSpeedValue: 100,
   minAccuracyMode: "off" as ThresholdMode,
   minAccuracyValue: 75,
   soundVolume: 0.5,
   soundMode: "off" as SoundMode,
   errorSoundMode: "off" as ErrorSoundMode,
   timeWarningMode: "off" as TimeWarningMode,
   liveProgressMode: "mini" as LiveProgressMode,
   capsLockWarningMode: "show" as CapsLockWarningMode,
};

export const useSettingsStore = create<SettingsStore>()(
   persist(
      (set) => ({
         // State (with defaults)
         ...DEFAULT_SETTINGS,

         // Actions
         setMinSpeedMode: (minSpeedMode) => set({ minSpeedMode }),
         setMinSpeedValue: (minSpeedValue) => set({ minSpeedValue }),
         setMinAccuracyMode: (minAccuracyMode) => set({ minAccuracyMode }),
         setMinAccuracyValue: (minAccuracyValue) => set({ minAccuracyValue }),
         setSoundVolume: (soundVolume) => set({ soundVolume }),
         setSoundMode: (soundMode) => set({ soundMode }),
         setErrorSoundMode: (errorSoundMode) => set({ errorSoundMode }),
         setTimeWarningMode: (timeWarningMode) => set({ timeWarningMode }),
         setLiveProgressMode: (liveProgressMode) => set({ liveProgressMode }),
         setCapsLockWarningMode: (capsLockWarningMode) =>
            set({ capsLockWarningMode }),
         resetSettings: () => set(DEFAULT_SETTINGS),
      }),
      {
         name: "settingConfig", // localStorage key (same as before)
      }
   )
);
