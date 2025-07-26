const chrono = require("chrono-node");

function parseDeadlinesFromText(text) {
  const lines = text.split("\n");
  const itemsWithDeadline = [];

  lines.forEach((line) => {
    const date = chrono.parseDate(line);
    if (date) {
      itemsWithDeadline.push({
        line: line.trim(),
        deadline: date.toISOString().split("T")[0],
      });
    }
  });

  return itemsWithDeadline;
}

module.exports = parseDeadlinesFromText;
