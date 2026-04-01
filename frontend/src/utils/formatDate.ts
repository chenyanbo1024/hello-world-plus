import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, 'yyyy 年 M 月 d 日', { locale: zhCN });
}
