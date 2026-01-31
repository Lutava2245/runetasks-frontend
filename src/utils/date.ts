export const formatDate = (date: Date): string => {
  const inputDate = new Date(date + "T00:00:00");

  if (isToday(date)) {
    return 'Hoje';
  }

  const dateString = inputDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  return dateString;
}

export const isToday = (date: Date): boolean => {
  const inputDate = new Date(date + "T00:00:00");
  const today = new Date();

  return inputDate.toDateString() === today.toDateString();
}

export const getDateString = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date + "T00:00:00") : date;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};