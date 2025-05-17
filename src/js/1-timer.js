import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

const TIMER_STEP = 1000;

let userSelectedDate = null;
let timerId = null;

const datePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

flatpickr(datePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedTime = selectedDates[0].getTime();
    if (selectedTime <= Date.now()) {
      iziToast.show({
        title: '',
        message: 'Please choose a date in the future',
        color: 'red',
        position: 'topCenter',
      });
      setButtonState(true);
    } else {
      userSelectedDate = selectedTime;
      setButtonState(false);
    }
  },
});

setButtonState(true);

startButton.addEventListener('click', () => {
  setButtonState(true);
  datePicker.setAttribute('disabled', 'disabled');

  timerId = setInterval(() => {
    const remaining = userSelectedDate - Date.now();

    if (remaining <= 0) {
      clearInterval(timerId);
      renderTime(0);
      datePicker.removeAttribute('disabled');
      return;
    }

    renderTime(remaining);
  }, TIMER_STEP);
});

function renderTime(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);
  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}

function addLeadingZero(num) {
  return String(num).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  return {
    days: Math.floor(ms / day),
    hours: Math.floor((ms % day) / hour),
    minutes: Math.floor((ms % hour) / minute),
    seconds: Math.floor((ms % minute) / second),
  };
}

function setButtonState(isDisabled) {
  startButton.disabled = isDisabled;
}
