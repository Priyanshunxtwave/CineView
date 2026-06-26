export const formatLocaleDate = (
    date: string | Date | undefined,
    locale: string,
    options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }
  ): string => {
    if (!date) return '';
  
    const value = typeof date === 'string' ? new Date(date) : date;
    if (Number.isNaN(value.getTime())) return '';
  
    return new Intl.DateTimeFormat(locale, options).format(value);
  };
  
  export const formatLocaleYear = (
    date: string | undefined,
    locale: string
  ): string => {
    if (!date) return '';
    return formatLocaleDate(date, locale, { year: 'numeric' });
  };