let darkmode = localStorage.getItem('darkmode');
const modeswitch = document.getElementById('toggle');
const body = document.body;

const enabledarkmode = () => {
  body.classList.add('darkmode');
  localStorage.setItem('darkmode', 'active');
};

const disabledarkmode = () => {
  body.classList.remove('darkmode');
  localStorage.setItem('darkmode', 'inactive');
};

modeswitch.addEventListener('click', () => {
  darkmode = localStorage.getItem('darkmode');
  if (darkmode !== 'active') {
    enabledarkmode();
  } else {
    disabledarkmode();
  }
});
