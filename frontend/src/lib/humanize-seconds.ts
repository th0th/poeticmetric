import dayjs from "dayjs";

export function humanizeSeconds(seconds: number): string {
  const duration = dayjs.duration(seconds, "seconds");

  let s = "";

  const durationHours = duration.hours();
  const durationMinutes = duration.minutes();
  const durationSeconds = duration.seconds();

  if (durationHours > 0) {
    s = `${s}${durationHours}h `;
  }

  if (durationMinutes > 0) {
    s = `${s}${durationMinutes}m `;
  }

  if (durationSeconds > 0) {
    s = `${s}${durationSeconds}s `;
  }

  return s;
}
