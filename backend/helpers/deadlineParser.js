module.exports = function parseDeadlinesFromText(text) {
  // Dummy logic – replace with actual parsing
  const matches = text.match(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/g);
  return matches || [];
};
