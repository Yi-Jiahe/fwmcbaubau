import { ReactNode, createContext, useEffect, useReducer } from 'react';
import { setGlobalBauVolume, setMasterGain } from './Audio';

export const SettingsContext = createContext<null | Settings>(null);
export const SettingsDispatchContext = createContext<null | React.Dispatch<any>>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, dispatch] = useReducer(settingsReducer, function (){
    const storedSettings = localStorage.getItem("settings");
    return storedSettings === null ? initialSettings : JSON.parse(storedSettings);
  }());

  useEffect(() => {
    setMasterGain(settings.masterVolume);
    setGlobalBauVolume(settings.globalBausVolume);
  }, [])

  return (
    <SettingsContext.Provider value={settings} >
      <SettingsDispatchContext.Provider value={dispatch}>
        {children}
      </SettingsDispatchContext.Provider>
    </SettingsContext.Provider>
  );
}

function settingsReducer(settings: Settings, action: any): Settings {
  let newSettings;

  switch (action.type) {
    case 'togglePlayGlobalBaus':
      newSettings = {
        ...settings,
        playGlobalBaus: !settings.playGlobalBaus
      }
      break;
    case 'togglePlayConfetti':
        newSettings = {
          ...settings,
          playConfetti: !settings.playConfetti
        }
        break;
    case 'setMasterVolume':
      setMasterGain(action.value);
      newSettings = {
        ...settings,
        masterVolume: action.value
      } 
      break;
    case 'setGlobalBausVolume':
      setGlobalBauVolume(action.value);
      newSettings = {
        ...settings,
        globalBausVolume: action.value
      }
      break;
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }

  localStorage.setItem("settings", JSON.stringify(newSettings));

  return newSettings;
}

type Settings = {
  playGlobalBaus: boolean,
  playConfetti: boolean,
  masterVolume: number,
  globalBausVolume: number,
}

const initialSettings: Settings = {
  playGlobalBaus: false,
  playConfetti: true,
  masterVolume: 1,
  globalBausVolume: 0.7,
}