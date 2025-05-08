import { orderBy, xor } from 'lodash-es';
export default function useTableSort(data, { preSort, defaultSort } = {}) {
  // 排序邏輯
  const sortName = ref('');
  const isSortDesc = ref(false); // 排序方法是不是desc
  // 固定的前置排序
  let hasPresort = preSort && preSort?.key && preSort?.method;
  // 預設的排序欄位
  let hasDefaultSort = defaultSort && defaultSort?.key && defaultSort?.method;
  const setSort = (name, isDesc = null, isResort = false) => {
    //console.log(name);
    if (!isResort) {
      if (name === sortName.value) {
        isSortDesc.value = !isSortDesc.value;
      } else {
        isSortDesc.value = true;
      }
    }
    if (isDesc != null) {
      isSortDesc.value = isDesc;
    }
    sortName.value = name;
    let sortParam1 = [name];
    let sortParam2 = [isSortDesc.value ? 'desc' : 'asc'];
    if (hasPresort) {
      sortParam1.unshift(preSort.key);
      sortParam2.unshift(preSort.method);
    }
    // debugger;
    // 有可能是ref 或 reactive
    if (isRef(data)) {
      data.value = orderBy(data.value, sortParam1, sortParam2);
    } else {
      let orderData = orderBy(data, sortParam1, sortParam2);
      data.splice(0, data.length, ...orderData);
    }
  };
  const clearSort = () => {
    sortName.value = '';
    isSortDesc.value = false;
  };

  const reSort = () => setSort(sortName.value, null, true);
  watch(data, (newData, oldData) => {
    // hacky，For切換篩選條件時使用，當資料變換時要Reset Sort(如果日後有新增修改刪除要考慮其他作法)
    if (newData?.length !== oldData?.length || xor(newData, oldData).length !== 0) {
      if (hasDefaultSort) setSort(defaultSort.key, true);
      else clearSort();
    }
  });

  // 如果有預設排序就先sort一次
  if (hasDefaultSort) {
    setSort(defaultSort.key);
    // TODO: 擴充 defaultSort.method
  }

  return {
    sortName,
    isSortDesc,
    setSort,
    reSort
  };
}
