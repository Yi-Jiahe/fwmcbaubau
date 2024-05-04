import './Settings.css';
import Modal from './Modal';

type SettingsProps = {
  closeSettings: () => void
  playGlobalBausSetting: boolean
  setPlayGlobalBausSetting: (playGlobalBausSetting: boolean) => void
}

function Settings({ closeSettings, playGlobalBausSetting, setPlayGlobalBausSetting }: SettingsProps) {
  return (
    <Modal closeModal={closeSettings}>
      <h1>Settings</h1>

      <label>
        <input type='checkbox' checked={playGlobalBausSetting}
          onChange={() => setPlayGlobalBausSetting(!playGlobalBausSetting)} />
        <div className='custom-checkbox' />
        <div className='tooltip'>
          <span>Play Global Baus</span>
          <span className='tooltip-text'>When enabled, other Ruffians BAU BAUs can also be heard.</span>
        </div>
      </label>


    </Modal>
  );
}

export default Settings;