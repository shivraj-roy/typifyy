import { FaBolt, FaChevronDown, FaBullseye, FaVolumeUp } from "react-icons/fa";
import { Bounce, toast } from "react-toastify";
import SubSetting from "../components/SubSetting";
import { useSettings } from "../context/Settings";
import CustomToast from "../components/ui/CustomToast";
import { playKeySound, preloadSounds } from "../utils/soundPlayer";

const Settings = () => {
   const {
      minSpeedMode,
      setMinSpeedMode,
      minSpeedValue,
      setMinSpeedValue,
      minAccuracyMode,
      setMinAccuracyMode,
      minAccuracyValue,
      setMinAccuracyValue,
      soundMode,
      setSoundMode,
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
         }
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
         }
      );
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
         <div className="pageSettings flex flex-col gap-8">
            <button
               className="sectionDropdown text-[2rem] p-2 flex gap-4 items-center text-fade-100"
               id="group_behavior"
            >
               <FaChevronDown size={28} />
               <span>behavior</span>
            </button>
            <div className="sectionGroup behavior grid gap-8 mx-3">
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
                           minSpeedValue.toString()
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
                           minAccuracyValue.toString()
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
                              playKeySound(57, "nk cream"); // Space key
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
                              playKeySound(57, "osu"); // Space key
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
            </div>
         </div>
      </>
   );
};
export default Settings;
