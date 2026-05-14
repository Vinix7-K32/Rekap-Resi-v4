const FORMULA_PREFIX_PATTERN = /^[=+\-@\t\r]/;

export function parseCsvRows(content) {
  const text = String(content ?? "");
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (inQuotes) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[index + 1] === "\n") {
        index += 1;
      }
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (inQuotes) {
    return { rows: [], error: "Format CSV tidak valid: tanda kutip tidak ditutup." };
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return { rows, error: null };
}

export function escapeCsvCell(value) {
  let text = String(value ?? "");

  if (FORMULA_PREFIX_PATTERN.test(text.trimStart())) {
    text = `'${text}`;
  }

  if (/[",\r\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
}

export function stringifyCsv(rows) {
  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");
}
