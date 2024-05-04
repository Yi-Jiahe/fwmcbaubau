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
      <input id='play-global-baus-checkbox' type='checkbox' checked={playGlobalBausSetting}
        onChange={() => setPlayGlobalBausSetting(!playGlobalBausSetting)} />
      <label htmlFor='play-global-baus-checkbox'>Play Global Baus</label>
    </Modal>
  );
}

export default Settings;