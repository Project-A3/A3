import moment from 'moment';

export default function useMoment() {
  const format = (dateTime, formatter) => (dateTime && formatter ? moment(dateTime).format(formatter) : '');
  /**
   *
   * @param {dateTime} dateTime 西元時間
   * @returns 民國時間
   */
  const getROCDate = (dateTime, formatter = 'DD/MM', yearSep = '/') => {
    if (dateTime === '' || dateTime === null || typeof dateTime === 'undefined') return '';

    return  moment(dateTime).format(formatter) + yearSep + moment(dateTime).year();
  };

  /**
   *
   * @param {dateTime} dateTime 西元時間
   * @returns 西元時間
   */
  const getVNDate = (dateTime, formatter = 'DD-MM-YYYY') => {
    if (dateTime === '' || dateTime === null || typeof dateTime === 'undefined') return '';

    return moment(dateTime).format(formatter);
  };

  /**
   *
   * @returns 西元時間
   */
  const getDate = (dateTime, offset = 0) => moment(dateTime).add(offset, 'days').format('YYYY-MM-DD');
  const diff = (datetime1, datetime2) => moment(datetime1).diff(moment(datetime2), 'days');
  const now = (formatter) => moment().format(formatter ?? 'YYYY-MM-DD HH:mm:ss');
  const isValidDate = (datetime, formatter, isStrict = false) => moment(datetime, formatter, isStrict).isValid();
  const isBetween = (date, rangeStartDate, rangeEndDate) => moment(date).isBetween(rangeStartDate, rangeEndDate);
  const isSameOrAfter = (date1, date2) => moment(date1).isSameOrAfter(date2);
  const getAge = (birthday) => (birthday ? moment().diff(moment(birthday), 'years') : '');
  const getOcrAge = (aplyDate, birthday) => (birthday ? moment(aplyDate).diff(moment(birthday), 'years') : '');
  const add = (datetime, num, unit, formatter = 'YYYY-MM-DD') => moment(datetime).add(num, unit).format(formatter);
  return {
    format,
    getDate,
    now,
    getROCDate,
    getVNDate,
    diff,
    isValidDate,
    isBetween,
    getAge,
    isSameOrAfter,
    add,
    getOcrAge
  };
}
