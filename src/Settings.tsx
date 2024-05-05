import './Settings.css';
import Modal from './Modal';
import { SettingsContext, SettingsDispatchContext } from './SettingsContext';
import { useContext } from 'react';

type SettingsProps = {
  closeSettings: () => void
}

function Settings({ closeSettings }: SettingsProps) {
  const settings = useContext(SettingsContext);
  const dispatch = useContext(SettingsDispatchContext);


  return (
    <Modal closeModal={closeSettings}>
      <h1>Settings</h1>

      <label>
        <input type='checkbox' checked={settings?.playGlobalBaus}
          onChange={() => {
            if (dispatch === null) { return; }
            dispatch({ type: 'togglePlayGlobalBaus' });
          }} />
        <div className='custom-checkbox' />
        <div className='tooltip'>
          <span>Play Global Baus</span>
          <span className='tooltip-text'>When enabled, other Ruffians BAU BAUs can also be heard.</span>
        </div>
      </label>

      <h2>Volume</h2>
      <p>Master</p>
      <input type='range' value={settings === null ? 0 : settings.masterVolume * 100} min={0} max={100}
        onChange={(e) => {
          if (dispatch === null) { return; }
          dispatch({type: 'setMasterVolume', value: parseInt(e.target.value) / 100})
        }} />
        <span>{(settings === null ? 0 : settings.masterVolume * 100).toFixed(0)}%</span>
      <p>Global Baus</p>
      <input type='range' value={settings === null ? 0 : settings.globalBausVolume * 100} min={0} max={100} disabled={!settings?.playGlobalBaus} 
        onChange={(e) => {
          if (dispatch === null) { return; }
          dispatch({type: 'setGlobalBausVolume', value: parseInt(e.target.value) / 100})
        }}/>
      <span>{(settings === null ? 0 : settings.globalBausVolume * 100).toFixed(0)}%</span>

    </Modal>
  );
}

export default Settings;