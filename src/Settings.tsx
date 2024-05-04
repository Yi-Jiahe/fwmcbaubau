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
        <span>Play Global Baus</span>
      </label>

    </Modal>
  );
}

export default Settings;