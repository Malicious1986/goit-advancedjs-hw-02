import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const button = document.querySelector('button');
const form = document.querySelector('form');
const fieldset = document.querySelector('fieldset');
const delay = document.querySelector('input[type=number]');

let promiseType;
let radioTarget;
let parsedDelay;

setButtonState();

function setButtonState() {
  if (parsedDelay && promiseType) {
    button.removeAttribute('disabled');
  } else {
    button.setAttribute('disabled', 'disabled');
  }
}

delay.addEventListener('input', e => {
  parsedDelay = +e.target.value;
  setButtonState();
});

form.addEventListener('submit', e => {
  e.preventDefault();

  try {
    if (parsedDelay > 0) {
      button.setAttribute('disabled', 'disabled');
      radioTarget.checked = false;
      delay.value = '';
      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          if (promiseType === 'fulfilled') {
            resolve('fulfilled');
          } else {
            reject('rejected');
          }
        }, parsedDelay);
      });
      promise
        .then(
          () =>
            iziToast.show({
              message: `Fulfilled promise in ${parsedDelay}ms`,
              color: 'green',
              position: 'topCenter',
            }),
          () =>
            iziToast.show({
              message: `Rejected promise in ${parsedDelay}ms`,
              color: 'red',
              position: 'topCenter',
            })
        )
        .finally(() => {
          promiseType = null;
          parsedDelay = 0;
        });
    }
  } catch (error) {
    console.error(error);
  }
});

fieldset.addEventListener('input', e => {
  radioTarget = e.target;
  promiseType = radioTarget.value;
  if (parsedDelay > 0) {
    button.removeAttribute('disabled');
  }
});
