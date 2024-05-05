import { ReactNode, createContext, useReducer } from 'react';

export const SettingsContext = createContext<null | Settings>(null);
export const SettingsDispatchContext = createContext<null | React.Dispatch<any>>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, dispatch] = useReducer(settingsReducer, initialSettings);

  return (
    <SettingsContext.Provider value={settings} >
      <SettingsDispatchContext.Provider value={dispatch}>
        {children}
      </SettingsDispatchContext.Provider>
    </SettingsContext.Provider>
  );
}

function settingsReducer(settings: Settings, action: any): Settings {
  switch (action.type) {
    case 'togglePlayGlobalBaus':
      return {
        ...settings,
        playGlobalBaus: !settings.playGlobalBaus
      }
    case 'setMasterVolume':
      return {
        ...settings,
        masterVolume: action.value
      }
    case 'setGlobalBausVolume':
      return {
        ...settings,
        globalBausVolume: action.value
      }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

type Settings = {
  playGlobalBaus: boolean,
  masterVolume: number,
  globalBausVolume: number,
}

const initialSettings: Settings = {
  playGlobalBaus: false,
  masterVolume: 1,
  globalBausVolume: 0.7,
}