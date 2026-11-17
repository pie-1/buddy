export function currentWeekStart() {
  const now = new Date();
  const day = now.getDay(); 
  const diff = day === 0 ? 6 : day - 1; 
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - diff);
  return monday;
}

export function nextWeekStart() {
  const monday = currentWeekStart();
  const next = new Date(monday);
  next.setDate(next.getDate() + 7);
  return next;
}

export function weekEnd(start) {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function weekLabel(start) {
  const end = weekEnd(start);
  const fmt = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `${fmt(start)} – ${fmt(end)}`;
}