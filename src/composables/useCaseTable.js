// 待核付表格
import { useHomeStore } from '~/stores/home';
import { isEmpty } from 'lodash-es';
import useSwal from './useSwal';

export default async function useCaseTable(property, startDate = '', endDate = '') {
  const homeStore = useHomeStore();
  const { $swal } = useSwal();
  try {
    homeStore.refreshPersonalDataCnt();
    const result = await homeStore.queryTableData(startDate, endDate);
    const data = !isEmpty(property) ? reactive(result[property]) : result;
    return data;
  } catch (e) {
    // 錯誤或空資料處理
    $swal.fail(e);
    return [];
  }
  // if(result.)
}
