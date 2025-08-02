function isValidShortcode(code) {
  return /^[a-zA-Z0-9_-]{3,20}$/.test(code);
}

export { isValidShortcode };
