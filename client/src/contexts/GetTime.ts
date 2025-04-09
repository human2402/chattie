export default function getTimestamp(): string {
    const now = new Date();
  
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');
  
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // Extracts HH:mm from a datetime string like '2025-04-09 16:19:47'
 export function extractTime(datetime: string): string {
    const [, timePart] = datetime.split(' ');
    return timePart.slice(0, 5); // 'HH:mm'
  }
  
  // Extracts DD.MM.YY from a datetime string like '2025-04-09 16:19:47'
  export function extractDate(datetime: string): string {
    const [datePart] = datetime.split(' ');
    const [year, month, day] = datePart.split('-');
    return `${day}.${month}.${year.slice(2)}`; // 'DD.MM.YY'
  }