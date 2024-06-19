import Modal from './Modal';

type AboutProps = {
  closeAbout: () => void
}

function About({ closeAbout }: AboutProps) {
  return (
    <Modal closeModal={closeAbout}>
      <h1>About</h1>
      <p>Hello fellow Ruffian and welcome to fwmcbaubau.com!</p>

      <p>To begin with, I would like to thank you for stopping by. It means a lot to me to be able contribute to the community.</p>

      <p>I would also like to credit <a href='https://faunaraara.com/' target="_blank" rel="noreferrer">faunaraara.com</a> for giving me the inspiration to create this site.</p>

      <p>If you have any suggestions or would like to report an issue, feel free to contact me on <a href='https://twitter.com/Activepaste1' target="_blank" rel="noreferrer">Twitter</a> or <a href='https://discordapp.com/users/196269893698453504' target="_blank" rel="noreferrer">Discord</a>.</p>

      <p>fwmcbaubau.com a site built by a Ruffian for Ruffians. The use of robots for the express purpose of inflating the count is not encouraged. Measures have been taken to reduce the impact of bots, but the priority is not to impact actual Ruffians' experiences.</p>

      <p>Have fun! BAU BAU 🐾</p>

      <h2>Credits</h2>
      <p>FUWAMOCO for their lovely voices, and everyone involved in the design of their models and stream assets which this site is based upon.</p>
      
      <p>Ruffians for enjoying the site and respecting the rules.</p>
    </Modal>
  );
}

export default About;