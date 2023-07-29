export function formatDateInDDMMYYYY(input: string, showTime = false) {
  if (!showTime) return new Intl.DateTimeFormat("en-in").format(new Date(input))
  return new Intl.DateTimeFormat("en-in", {
    timeStyle: "medium",
    dateStyle: "short",
  }).format(new Date(input))
}
