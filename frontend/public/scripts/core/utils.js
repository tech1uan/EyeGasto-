export function formatToPeso(amount) {
  const num = Number(amount) || 0;

   return `₱${num.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

export function formatDate(date) {
   
  const today = dayjs(date).format('MMMM D, YYYY');
  return today;
 
}

export function removeJustifyCenter (container) {
   container.classList.remove("justify-center");
}

export function addJustifyCenter (container) {
   container.classList.add("justify-center");
}

export function getRelativeTime(timestamp) {
  const diff = Date.now() - new Date(timestamp);

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (seconds < 60) return rtf.format(-seconds, 'second');
  if (minutes < 60) return rtf.format(-minutes, 'minute');
  if (hours < 24) return rtf.format(-hours, 'hour');

  return rtf.format(-days, 'day');
}

export function isToday(timestamp) {
  const date = new Date(timestamp)
  const today = new Date()

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDay() === today.getDay()
  )
}