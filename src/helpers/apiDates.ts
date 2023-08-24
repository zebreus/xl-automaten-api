/** Format a date for use with the XL Automaten API */
export const formatApiDate = (date: Date): string => {
  return date.toISOString().slice(0, 19).replace("T", " ")
}

/** Parse a date string from the XL Automaten API into a javascript Date */
export const parseApiDate = (date: string): Date => {
  if (!date) {
    throw new Error("Received invalid date from the API")
  }
  return new Date(date + " UTC")
}
