<template>
  <render v-bind="$attrs" ref="group" @click="onClickGroup">
    <slot></slot>
  </render>
  <button
    v-if="props.onClickInsert && isGroupEditing"
    class="button apply-btn is-editing"
    @click="onClickInsert(props.data, $event)"
  >
    <span>新增</span>
    <img :src="insertIcon" alt="ADD" />
    <input type="hidden" class="for-picker" />
  </button>
</template>
<script setup>
  import { useEditableStore } from '~/stores/editable.js';
  import useDatetimePicker from '~/composables/useDatetimePicker';
  import { uuid } from '~/common/utils';
  import { nextTick, h, useSlots } from 'vue';
  import { get, orderBy } from 'lodash-es';
  import iconAdd from '~/assets/images/icon-add.svg';
  import iconAddDate from '~/assets/images/icon-calendar-w.svg';
  import { throttledWatch } from '@vueuse/core';
  const slots = useSlots();

  const props = defineProps({
    multipleDate: {
      type: Array,
      required: false,
      default: null
    },
    onClickInsert: {
      type: Function,
      required: false,
      default: null
    },
    data: {
      type: [Array, Object],
      required: false,
      default: []
    },
    disableGroupClick: {
      type: Boolean,
      required: false,
      default: false
    },
    tag: {
      type: String,
      required: false,
      default: 'div'
    },
    javaClass: {
      type: String,
      required: false,
      default: ''
    }
  });

  const insertIcon = props.multipleDate ? iconAddDate : iconAdd;

  const key = uuid(6);
  const editableStore = useEditableStore();
  // const slots = useSlots();
  // console.log(slots.default());
  // console.log(slots.default().map((m) => m.props));
  const group = ref(null);
  const groupId = `g_${key}`;
  const currentGroup = reactive({
    id: groupId,
    elements: []
  });
  const isGroupEditing = computed(() => editableStore.currentEditableGroup === groupId);

  // 刷新Group
  const refreshGroup = async (editing = false) => {
    await nextTick();
    editableStore.refreshGroup(groupId, editing);
  };

  const onClickGroup = () => {
    if (!isGroupEditing.value && !props.disableGroupClick) {
      let g = editableStore.editableGroups.find((e) => e.id === groupId);
      for (const field of g.elements) {
        editableStore.editableFields[field] = true;
      }
      // 設成現在群組
      editableStore.currentEditableGroup = groupId;
    }
  };

  const onClickInsert = async (data, event) => {
    if (props.multipleDate) {
      let pickerRef = event.currentTarget.querySelector('.for-picker');
      console.log(pickerRef);
      if (pickerRef) {
        if (pickerRef.bulmaCalendar) {
          await new Promise((r) => setTimeout(r, 100));
          pickerRef.bulmaCalendar.datePicker.highlightedDates = props.multipleDate.filter((d) => d).map((e) => new Date(e));
          pickerRef.bulmaCalendar.refresh();
          pickerRef.bulmaCalendar.show();
        } else {
          console.log(props.multipleDate);
          const { datetimePicker } = useDatetimePicker(pickerRef, {
            multiselectMode: true,
            highlightedDates: props.multipleDate.filter((d) => d),
            maxDate: new Date()
          });
          await new Promise((r) => setTimeout(r, 100));
          datetimePicker.show();
          datetimePicker.onSelect = (date) => {
            if (date?.data?.date?.start) {
              datetimePicker.hightlightDate(date?.data?.date?.start);
            }
          };

          datetimePicker.onSave = async (dates) => {
            dates = orderBy(dates);
            await props.onClickInsert(data, dates, event, props.javaClass);
            await nextTick();
            editableStore.refreshGroup(groupId);
            editableStore.currentEditableGroup = '';
          };

          // setTimeout(() => {}, 100);
        }
      }
    } else {
      await props.onClickInsert(data, event, props.javaClass);
      await nextTick();
      editableStore.refreshGroup(groupId, true);
    }
  };

  onMounted(() => {
    let fields = group.value.querySelectorAll('[data-editing-type]');

    for (const field of fields) {
      currentGroup.elements.push(field.id);
    }
    editableStore.editableGroups.push(currentGroup);
    // console.log(editableStore.editableGroups);
    // console.log(editableStore.editableFields);
  });

  const render = () => {
    return h(
      props.tag,
      {
        id: groupId,
        class: `${props.tag === 'div' ? 'column ' : ''}group-editing${props.disableGroupClick ? '' : ' cursor-pointer'}`
      },
      slots.default()
    );
  };

  if (props.multipleDate) {
    throttledWatch(
      isGroupEditing,
      (newValue) => {
        let emptyDate = props.data.filter((date) => !date.CFM_STR_DATE);
        let notEmptyDate = props.data.filter((date) => date.CFM_STR_DATE);
        let orderData = orderBy(notEmptyDate, 'CFM_STR_DATE', 'asc');
        orderData.push(...emptyDate);
        props.data.length = 0;
        props.data.push(...orderData);
      },
      { throttle: 500 }
    );
  }

  // expose出去讓其他地方使用
  defineExpose({
    refreshGroup,
    isGroupEditing,
    groupId
  });
</script>
<style lang="scss" scoped>
  .group-editing {
    min-height: 20px;
  }
</style>
<style lang="scss">
  .cursor-pointer {
    cursor: pointer;
  }
  .button.apply-btn.is-editing {
    .datetimepicker-dummy {
      display: none;
    }
    .datetimepicker {
      left: -140px;
      top: 50px;
      width: max-content;
    }
  }
</style>
