import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

const TIMER_STEP = 1000;

let userSelectedDate;
let timerId;

const datePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose,
};

const iziToastOptions = {
  title: '',
  message: 'Please choose a date in the future',
  color: 'red',
  position: 'topCenter',
};
flatpickr('#datetime-picker', options);

setButtonState({ isDisabled: true });

function onClose(selectedDates) {
  const selectedTime = selectedDates[0].getTime();
  const currentTime = Date.now();

  if (currentTime >= selectedTime) {
    return iziToast.show(iziToastOptions);
  }
  userSelectedDate = selectedTime - currentTime;
  setButtonState({ isDisabled: false });
}

function runTimer() {
  clearInterval(timerId);
  datePicker.setAttribute('disabled', 'disabled');
  timerId = setInterval(() => {
    userSelectedDate = userSelectedDate - TIMER_STEP;

    if (userSelectedDate < TIMER_STEP) {
      clearInterval(timerId);
      datePicker.removeAttribute('disabled');
    }

    renderTime(userSelectedDate);
  }, TIMER_STEP);
}

function addLeadingZero(number) {
  const strNumber = number.toString();
  if (strNumber.length === 1) {
    return number.toString().padStart(2, 0);
  }
  return strNumber;
}

function renderTime(ms) {
  const res = convertMs(ms);
  daysSpan.innerHTML = addLeadingZero(res.days);
  hoursSpan.innerHTML = addLeadingZero(res.hours);
  minutesSpan.innerHTML = addLeadingZero(res.minutes);
  secondsSpan.innerHTML = addLeadingZero(res.seconds);
}

function setButtonState({ isDisabled }) {
  if (isDisabled) {
    startButton.setAttribute('disabled', 'disabled');
  } else {
    startButton.removeAttribute('disabled');
  }
}

startButton.addEventListener('click', () => {
  renderTime(userSelectedDate);
  setButtonState({ isDisabled: true });
  runTimer();
});

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
