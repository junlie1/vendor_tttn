import { utcToZonedTime, format } from 'date-fns-tz';
import { vi } from 'date-fns/locale';

export const formatVietnamTime = (isoString) => {
    const localTime = utcToZonedTime(isoString, 'Asia/Ho_Chi_Minh');
    return format(localTime, 'HH:mm dd/MM/yyyy', { locale: vi });
};