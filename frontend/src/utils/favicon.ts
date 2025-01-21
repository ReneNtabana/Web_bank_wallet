import logo from '../assets/logo.png';

export const setFavicon = () => {
  const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (favicon) {
    favicon.href = logo;
  }
}; 