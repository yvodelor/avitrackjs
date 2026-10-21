export const formatDateInput = (
  date: string | Date | null | undefined
): string => {
  if (!date) return "";

  const value = String(date);

  // Si la date commence par YYYY-MM-DD, conserver cette partie
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.substring(0, 10);
  }

  return "";
};



export const formatDate = (
  value: string | Date | null | undefined
): string => {
  if (!value) return "";

  const dateString = String(value).substring(0, 10);
  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  if (isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};