function isValid(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export { isValid };
