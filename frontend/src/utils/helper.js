import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Dhaka');

function formatDateForViewing(renderedCellValue) {
  return dayjs(renderedCellValue).subtract(0, 'hours').format('YYYY-MM-DD HH:mm:ss');
}

function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function getInitials(name) {
  if (!name) return '';

  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getTimeBasedGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return 'Good morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good afternoon';
  } else if (hour >= 17 && hour < 21) {
    return 'Good evening';
  } else {
    return 'Good night';
  }
}

function getTTK() {
  return new Date().getTime() + 1000 * 60 * 60 * 24; // 86400000 or 24 hours
}

export { formatDateForViewing, stringToColor, getInitials, getTimeBasedGreeting, getTTK, dayjs };

export function storeToken(token) {
  localStorage.setItem('tokn', token);
}
export function getToken() {
  return localStorage.getItem('tokn');
}

export function storeUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch (error) {
    return null;
  }
}
