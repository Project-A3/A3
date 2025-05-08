import { onClickOutside } from '@vueuse/core';
import { useEditableStore } from '~/stores/editable';
import { uuid } from '~/common/utils';
import { pull } from 'lodash-es';

export default function useEditableField(
  isEditable = true,
  modelValue = null,
  { clickOutsideCallback = null, schema = null, customValidate = null, clickOutsideAnyWhere = null } = {}
) {
  const editableStore = useEditableStore();

  // 欄位區域的DOM物件
  const target = ref(null);
  // 欄位ID
  const key = uuid();
  // 綁定欄位ID對應狀態
  editableStore.editableFields[key] = false;
  // 目前是否編輯中
  const isEditing = computed(() => editableStore.editableFields[key]);
  // 檢核錯誤訊息
  const errors = reactive([]);
  // 點擊欄位事件
  const onClickField = async () => {
    editableStore.editableFields[key] = isEditable;
    await nextTick();
    if (!target.value) return;
    let group = target.value.closest('.group-editing');
    // console.log(group);
    if (group) {
      editableStore.closeCurrentGroupEditing();
      editableStore.currentEditableGroup = group.id;
      let g = editableStore.editableGroups.find((e) => e.id === group.id);
      for (const field of g.elements) {
        editableStore.editableFields[field] = isEditable;
      }
    }
    editableStore.currentEditableGroup = group ? group.id : '';
  };

  const doValidation = async () => {
    if (schema && modelValue) {
      try {
        await schema.validate(modelValue.value);
        errors.length = 0;
      } catch (e) {
        // console.log(e.name);
        // console.log(e.errors);
        if (e.name === 'ValidationError') {
          errors.length = 0;
          errors.push(...e.errors);
        } else {
          console.error(e);
        }
      }
    } else if (customValidate && typeof customValidate === 'function') {
      try {
        await customValidate();
        errors.length = 0;
      } catch (e) {
        errors.length = 0;
        errors.push(e);
      }
    }
  };

  // 點擊欄位外事件
  onClickOutside(target, async (event) => {
    // console.log(event);
    if (!event.target.closest('.is-editing') && !event.target.closest('.modal') && !event.target.closest('.swal2-container')) {
      editableStore.editableFields[key] = false;
      editableStore.currentEditableGroup = '';
      await doValidation();
      // console.log('validate finish');
      if (clickOutsideCallback && typeof clickOutsideCallback === 'function') clickOutsideCallback(event);
    }
    if(clickOutsideAnyWhere && typeof clickOutsideAnyWhere === 'function') clickOutsideAnyWhere();
  });

  const setEditing = (flag) => {
    editableStore.editableFields[key] = flag;
  };

  onUnmounted(() => {
    // console.log('destroyed');
    // console.log(editableStore.editableFields[key]);
    delete editableStore.editableFields[key];
    // console.log(editableStore.editableFields[key]);
    if (editableStore.currentEditableGroup != '') {
      let currentGroup = editableStore.editableGroups.find((e) => e.id === editableStore.currentEditableGroup);
      if (currentGroup) pull(currentGroup.elements, key);
    }
  });

  return {
    target,
    key,
    isEditing,
    onClickField,
    onClickOutside,
    editableStore,
    setEditing,
    errors,
    doValidation
  };
}
