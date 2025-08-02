function generateShorterner(urls) {
  for (var i = 0; i < 10; i++) {
    const code = Math.random().toString(36).substring(2, 8);
    if (!urls[code]) return code;
  }
  return (
    Math.random().toString(36).substring(2, 6) +
    Date.now().toString(36).slice(-4)
  );
}

export { generateShorterner };
