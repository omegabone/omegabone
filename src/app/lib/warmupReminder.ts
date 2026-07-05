/**
 * Builds a downloadable .ics calendar file containing a daily repeating
 * "Vocal Warm-Up" event at the chosen local time, linking back to the
 * practice portal. Floating local time (no TZID) keeps the reminder at the
 * same wall-clock time wherever the student travels.
 */

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function icsEscape(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function buildWarmupIcs(timeHHMM: string, portalUrl: string): string {
  const [hours, minutes] = timeHHMM.split(":").map(Number);

  // First occurrence: today, unless the chosen time already passed.
  const start = new Date();
  start.setHours(hours, minutes, 0, 0);
  if (start.getTime() <= Date.now()) start.setDate(start.getDate() + 1);

  const end = new Date(start.getTime() + 15 * 60 * 1000);
  const fmt = (d: Date) =>
    `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}T${pad2(d.getHours())}${pad2(d.getMinutes())}00`;
  const stampUtc = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");

  const description = icsEscape(`Daily vocal warm-up with Omega Bone.\nPractice here: ${portalUrl}`);

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Omega Bone//Vocal Warm-Up//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:warmup-${start.getTime()}@omegabone.com`,
    `DTSTAMP:${stampUtc}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    "RRULE:FREQ=DAILY",
    "SUMMARY:Vocal Warm-Up 🎤",
    `DESCRIPTION:${description}`,
    `URL:${portalUrl}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Time to warm up your voice",
    "TRIGGER:-PT0M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadWarmupIcs(timeHHMM: string, portalUrl: string) {
  const ics = buildWarmupIcs(timeHHMM, portalUrl);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "daily-vocal-warmup.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Give the browser a beat to start the download before revoking
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
