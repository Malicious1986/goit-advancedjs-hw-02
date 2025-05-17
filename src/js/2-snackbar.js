import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const button = document.querySelector('button');
const form = document.querySelector('form');
const delayInput = document.querySelector('input[name=delay]');
const radioInputs = document.querySelectorAll('input[name=state]');

let parsedDelay = null;
let promiseType = null;

function setButtonState() {
  button.disabled = !(parsedDelay > 0 && promiseType);
}

delayInput.addEventListener('input', e => {
  parsedDelay = Number(e.target.value);
  setButtonState();
});

radioInputs.forEach(input => {
  input.addEventListener('change', e => {
    promiseType = e.target.value;
    setButtonState();
  });
});

form.addEventListener('submit', e => {
  e.preventDefault();

  button.disabled = true;
  form.reset();
  const delay = parsedDelay;

  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (promiseType === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  })
    .then(delay => {
      iziToast.show({
        message: `✅ Fulfilled promise in ${delay}ms`,
        color: 'green',
        position: 'topCenter',
      });
    })
    .catch(delay => {
      iziToast.show({
        message: `❌ Rejected promise in ${delay}ms`,
        color: 'red',
        position: 'topCenter',
      });
    });
});
