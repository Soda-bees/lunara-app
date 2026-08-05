import { FastingSession } from '../../services/api';

export const formatDuration = (minutes: number | null | undefined) => {
  if (!minutes || minutes <= 0) return '0h 00m';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${h}h ${pad(m)}m`;
};

export const formatTimerHHMMSS = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return '00:00:00';

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const padMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${displayHours}:${padMinutes} ${ampm}`;
};

export const getElapsedSeconds = (session: FastingSession | null): number => {
  if (!session) return 0;
  const start = new Date(session.startTime);
  const end = session.endTime ? new Date(session.endTime) : new Date();
  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) return 0;
  return Math.floor(diffMs / 1000);
};

export const getTargetEndDate = (
  session: FastingSession | null,
  targetMinutes: number | null | undefined,
): Date | null => {
  if (!session || !targetMinutes) return null;
  const start = new Date(session.startTime);
  return new Date(start.getTime() + targetMinutes * 60 * 1000);
};

export const getTargetEndTime = (
  session: FastingSession | null,
  targetMinutes: number | null | undefined,
): string | null => {
  const endDate = getTargetEndDate(session, targetMinutes);
  if (!endDate) return null;
  return formatTime(endDate.toISOString());
};

export const formatDateDisplay = (date: Date): string => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
};
