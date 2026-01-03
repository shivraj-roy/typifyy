import {
   FaBolt,
   FaBullseye,
   FaVolumeUp,
   FaVolumeDown,
   FaVolumeMute,
   FaChartPie,
   FaExclamationTriangle,
   FaLock,
   FaUndo,
   FaTools,
} from "react-icons/fa";
import { Bounce, toast } from "react-toastify";
import SubSetting from "../components/SubSetting";
import { useSettings } from "../context/Settings";
import CustomToast from "../components/ui/CustomToast";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
   playKeySound,
   preloadSounds,
   playErrorSound,
} from "../utils/soundPlayer";

const Settings = () => {
   useDocumentTitle("Settings");
   const {
      minSpeedMode,
      setMinSpeedMode,
      minSpeedValue,
      setMinSpeedValue,
      minAccuracyMode,
      setMinAccuracyMode,
      minAccuracyValue,
      setMinAccuracyValue,
      soundVolume,
      setSoundVolume,
      soundMode,
      setSoundMode,
      errorSoundMode,
      setErrorSoundMode,
      timeWarningMode,
      setTimeWarningMode,
      liveProgressMode,
      setLiveProgressMode,
      capsLockWarningMode,
      setCapsLockWarningMode,
   } = useSettings();

   const showSavedToast = () => {
      toast(
         <CustomToast type="success" title="Saved" message="Settings saved" />,
         {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            transition: Bounce,
         },
      );
   };

   const showErrorToast = () => {
      toast(
         <CustomToast
            type="error"
            title="Error"
            message="Failed to save settings: request took too long to complete"
         />,
         {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            transition: Bounce,
         },
      );
   };

   // Reset all settings to default values
   const resetSettings = () => {
      try {
         setMinSpeedMode("off");
         setMinSpeedValue(100);
         setMinAccuracyMode("off");
         setMinAccuracyValue(75);
         setSoundVolume(0.5);
         setSoundMode("off");
         setErrorSoundMode("off");
         setTimeWarningMode("off");
         setLiveProgressMode("mini");
         setCapsLockWarningMode("show");

         toast(
            <CustomToast
               type="success"
               title="Settings Reset"
               message="All settings have been reset to default values"
            />,
            {
               position: "top-right",
               autoClose: 2000,
               hideProgressBar: true,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: false,
               transition: Bounce,
            },
         );
      } catch {
         showErrorToast();
      }
   };

   // Validators
   const validateMinSpeed = (value: string) => {
      const num = parseInt(value, 10);
      if (isNaN(num)) {
         return { valid: false, error: "Please enter a valid number" };
      }
      if (num < 0) {
         return {
            valid: false,
            error: "Number must be greater than or equal to 0",
         };
      }
      return { valid: true };
   };

   const validateMinAccuracy = (value: string) => {
      const num = parseInt(value, 10);
      if (isNaN(num)) {
         return { valid: false, error: "Please enter a valid number" };
      }
      if (num > 100) {
         return {
            valid: false,
            error: "Number must be less than or equal to 100",
         };
      }
      if (num < 0) {
         return {
            valid: false,
            error: "Number must be greater than or equal to 0",
         };
      }
      return { valid: true };
   };

   return (
      <>
         {/* <div>Settings</div> */}
         <div className="pageSettings flex flex-col gap-4 md:gap-8">
            <button
               className="sectionDropdown text-[2rem] p-2 flex gap-4 items-center text-secondary"
               id="group_settings"
            >
               <FaTools size={28} />
               <span>settings</span>
            </button>
            <div className="sectionGroup settings grid gap-8 mx-3">
               <SubSetting
                  icon={<FaBolt size={16} />}
                  title="min speed"
                  description="Automatically fails a test if your speed falls below a threshold."
                  showInput={true}
                  inputValue={minSpeedValue}
                  onInputChange={(value) => {
                     setMinSpeedValue(value);
                     if (minSpeedMode !== "custom") {
                        setMinSpeedMode("custom");
                     }
                  }}
                  onInputCommit={() => {
                     try {
                        const validation = validateMinSpeed(
                           minSpeedValue.toString(),
                        );
                        if (validation.valid) {
                           showSavedToast();
                        }
                     } catch {
                        showErrorToast();
                     }
                  }}
                  validator={validateMinSpeed}
                  inputName="minSpeed"
                  buttons={[
                     {
                        label: "off",
                        isActive: minSpeedMode === "off",
                        onClick: () => {
                           try {
                              if (minSpeedMode !== "off") {
                                 setMinSpeedMode("off");
                                 showSavedToast();
                              }
                           } catch {
                              showErrorToast();
                           }
                        },
                     },
                     {
                        label: "custom",
                        isActive: minSpeedMode === "custom",
                        onClick: () => {
                           try {
                              if (minSpeedMode !== "custom") {
                                 setMinSpeedMode("custom");
                                 showSavedToast();
                              }
                           } catch {
                              showErrorToast();
                           }
                        },
                     },
                  ]}
               />
               <SubSetting
                  icon={<FaBullseye size={16} />}
                  title="min accuracy"
                  description="Automatically fails a test if your accuracy falls below a threshold."
                  showInput={true}
                  inputValue={minAccuracyValue}
                  onInputChange={(value) => {
                     setMinAccuracyValue(value);
                     if (minAccuracyMode !== "custom") {
                        setMinAccuracyMode("custom");
                     }
                  }}
                  onInputCommit={() => {
                     try {
                        const validation = validateMinAccuracy(
                           minAccuracyValue.toString(),
                        );
                        if (validation.valid) {
                           showSavedToast();
                        }
                     } catch {
                        showErrorToast();
                     }
                  }}
                  validator={validateMinAccuracy}
                  inputName="minAccuracy"
                  buttons={[
                     {
                        label: "off",
                        isActive: minAccuracyMode === "off",
                        onClick: () => {
                           try {
                              if (minAccuracyMode !== "off") {
                                 setMinAccuracyMode("off");
                                 showSavedToast();
                              }
                           } catch {
                              showErrorToast();
                           }
                        },
                     },
                     {
                        label: "custom",
                        isActive: minAccuracyMode === "custom",
                        onClick: () => {
                           try {
                              if (minAccuracyMode !== "custom") {
                                 setMinAccuracyMode("custom");
                                 showSavedToast();
                              }
                           } catch {
                              showErrorToast();
                           }
                        },
                     },
                  ]}
               />
               <SubSetting
                  icon={<FaVolumeDown size={16} />}
                  title="sound volume"
                  description="Change the volume of the sound effects."
                  showSlider={true}
                  sliderValue={soundVolume}
                  sliderMin={0}
                  sliderMax={1}
                  sliderStep={0.1}
                  onSliderChange={(value) => {
                     setSoundVolume(value);
                  }}
                  buttons={[]}
               />
               <SubSetting
                  icon={<FaVolumeUp size={16} />}
                  title="play sound on click"
                  description="Plays a short sound when you press a key."
                  showInput={false}
                  buttons={[
                     {
                        label: "off",
                        isActive: soundMode === "off",
                        onClick: () => {
                           try {
                              if (soundMode !== "off") {
                                 setSoundMode("off");
                                 showSavedToast();
                              }
                           } catch {
                              showErrorToast();
                           }
                        },
                     },
                     {
                        label: "nk cream",
                        isActive: soundMode === "nk cream",
                        onClick: async () => {
                           try {
                              // Preload and play preview sound
                              await preloadSounds("nk cream");
                              playKeySound(57, "nk cream", soundVolume); // Space key
                              if (soundMode !== "nk cream") {
                                 setSoundMode("nk cream");
                                 // showSavedToast();
                              }
                           } catch {
                              showErrorToast();
                           }
                        },
                     },
                     {
                        label: "osu",
                        isActive: soundMode === "osu",
                        onClick: async () => {
                           try {
                              // Preload and play preview sound
                              await preloadSounds("osu");
                              playKeySound(57, "osu", soundVolume); // Space key
                              if (soundMode !== "osu") {
                                 setSoundMode("osu");
                                 // showSavedToast();
                              }
                           } catch {
                              showErrorToast();
                           }
                        },
                     },
                  ]}
               />
               <SubSetting
                  icon={<FaVolumeMute size={16} />}
                  title="play sound on error"
                  description="Plays a short sound if you press an incorrect key or press space too early."
                  showInput={false}
                  buttons={[
                     {
                        label: "off",
                        isActive: errorSoundMode === "off",
                        onClick: () => {
                           try {
                              if (errorSoundMode !== "off") {
                                 setErrorSoundMode("off");
                                 showSavedToast();
                              }
                           } catch {
                              showErrorToast();
                           }
                        },
                     },
                     {
                        label: "blow",
                        isActive: errorSoundMode === "blow",
                        onClick: () => {
                           try {
                              // Play preview sound
                              playErrorSound("blow", soundVolume);
                              if (errorSoundMode !== "blow") {
                                 setErrorSoundMode("blow");
                                 // showSavedToast();
                              }
                           } catch {
                              showErrorToast();
                           }
                        },
                     },
                     {
                        label: "slap",
                        isActive: errorSoundMode === "slap",
                        onClick: () => {
                           try {
                              // Play preview sound
                              playErrorSound("slap", soundVolume);
                              if (errorSoundMode !== "slap") {
                                 setErrorSoundMode("slap");
                                 // showSavedToast();
                              }
                           } catch {
                              showErrorToast();
                           }
                        },
                     },
                     {
                        label: "whoosh",
                        isActive: errorSoundMode === "whoosh",
                        onClick: () => {
                           try {
                              // Play preview sound
                              playErrorSound("whoosh", soundVolume);
                              if (errorSoundMode !== "whoosh") {
                                 setErrorSoundMode("whoosh");
                                 // showSavedToast();
                              }
                           } catch {
                              showErrorToast();
                           }
                        },
                     },
                  ]}
               />
               <SubSetting
                  icon={<FaExclamationTriangle size={16} />}
                  title="play time warning"
                  description="Play a short warning sound if you are close to the end of a timed test."
                  showInput={false}
                  buttons={[
                     {
                        label: "off",
                        isActive: timeWarningMode === "off",
                        onClick: () => {
                           try {
                              if (timeWarningMode !== "off") {
                                 setTimeWarningMode("off");
                                 showSavedToast();
                              }
                           } catch {
                              showErrorToast();
                           }
                        },
                     },
                     {
                        label: "1 second",
                        isActive: timeWarningMode === "1",
                        onClick: () => {
                           try {
                              if (timeWarningMode !== "1") {
                                 setTimeWarningMode("1");
                                 // showSavedToast();
                              }
                           } catch {
                              showErrorToast();
                           }
                        },
                     },
                     {
                        label: "3 seconds",
                        isActive: timeWarningMode === "3",
                        onClick: () => {
                           try {
                              if (timeWarningMode !== "3") {
                                 setTimeWarningMode("3");
                                 // showSavedToast();
                              }
                           } catch {
                              showErrorToast();
                           }
                        },
                     },
                     {
                        label: "5 seconds",
                        isActive: timeWarningMode === "5",
                        onClick: () => {
                           try {
                              if (timeWarningMode !== "5") {
                                 setTimeWarningMode("5");
                                 // showSavedToast();
                              }
                           } catch {
                              showErrorToast();
                           }
                        },
                     },
                  ]}
               />
               <SubSetting
                  icon={<FaChartPie size={16} />}
                  title="live progress style"
                  description="Change the style of the timer/word count during a test."
                  showInput={false}
                  buttons={[
                     {
                        label: "off",
                        isActive: liveProgressMode === "off",
                        onClick: () => {
                           try {
                              if (liveProgressMode !== "off") {
                                 setLiveProgressMode("off");
                                 showSavedToast();
                              }
                           } catch {
                              showErrorToast();
                           }
                        },
                     },
                     {
                        label: "mini",
                        isActive: liveProgressMode === "mini",
                        onClick: () => {
                           try {
                              if (liveProgressMode !== "mini") {
                                 setLiveProgressMode("mini");
                                 // showSavedToast();
                              }
                           } catch {
                              showErrorToast();
                           }
                        },
                     },
                     {
                        label: "bar",
                        isActive: liveProgressMode === "bar",
                        onClick: () => {
                           try {
                              if (liveProgressMode !== "bar") {
                                 setLiveProgressMode("bar");
                                 // showSavedToast();
                              }
                           } catch {
                              showErrorToast();
                           }
                        },
                     },
                  ]}
               />
               <SubSetting
                  icon={<FaLock size={16} />}
                  title="caps lock warning"
                  description="Displays a warning when caps lock is on."
                  showInput={false}
                  buttons={[
                     {
                        label: "hide",
                        isActive: capsLockWarningMode === "hide",
                        onClick: () => {
                           try {
                              if (capsLockWarningMode !== "hide") {
                                 setCapsLockWarningMode("hide");
                                 showSavedToast();
                              }
                           } catch {
                              showErrorToast();
                           }
                        },
                     },
                     {
                        label: "show",
                        isActive: capsLockWarningMode === "show",
                        onClick: () => {
                           try {
                              if (capsLockWarningMode !== "show") {
                                 setCapsLockWarningMode("show");
                                 showSavedToast();
                              }
                           } catch {
                              showErrorToast();
                           }
                        },
                     },
                  ]}
               />
               <SubSetting
                  icon={<FaUndo size={16} />}
                  title="reset settings"
                  description={
                     <>
                        Resets settings to the default.{" "}
                        <span className="text-error-extra font-semibold">
                           You can't undo this action!
                        </span>
                     </>
                  }
                  showInput={false}
                  buttons={[
                     {
                        label: "reset settings",
                        isActive: false,
                        onClick: resetSettings,
                        className:
                           "cursor-pointer p-2 rounded-lg text-center h-min text-[1em] bg-error-extra hover:bg-primary text-primary hover:text-bg transition-colors",
                     },
                  ]}
               />
            </div>
         </div>
      </>
   );
};
export default Settings;
