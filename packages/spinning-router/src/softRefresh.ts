export const softRefresh = () => {
  window.dispatchEvent(new Event("softRefresh"));
};
