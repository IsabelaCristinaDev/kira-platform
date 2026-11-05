// Monta e baixa arquivos CSV (separador ";" e BOM para abrir certo no Excel em pt-BR) · API: nenhuma
const escapeCell = (value) => {
  const text = String(value ?? "");
  return /[";\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/**
 * @param {{ label: string, value: (row: object) => string | number }[]} columns
 * @param {object[]} rows
 */
export const toCsv = (columns, rows) =>
  [columns.map((c) => escapeCell(c.label)), ...rows.map((row) => columns.map((c) => escapeCell(c.value(row))))]
    .map((line) => line.join(";"))
    .join("\r\n");

export const downloadCsv = (filename, content) => {
  const url = URL.createObjectURL(new Blob(["﻿", content], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
