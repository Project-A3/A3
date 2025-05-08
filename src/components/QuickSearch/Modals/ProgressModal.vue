<template>
  <!-- id: progressModal -->
  <!-- title: 進度列車 -->
  <Modal>
    <template v-slot:title>進度列車</template>
    <template v-slot:content>
      <ul class="timeline timeline-split">
        <li
          :class="{ 'timeline-item': true, 'is-current': index == 0 }"
          v-for="(progress, index) in progressList"
          :key="progress.NODE"
        >
          <div class="timeline-info">
            <span>{{ index == 0 && progress.CASE_APLY_STS == 'P1' ? '進件中' : '' }}</span>
            <span>{{ index == 0 && progress.CASE_APLY_STS == 'P2' ? '審理中' : '' }}</span>
            <span>{{ index == 0 && progress.CASE_APLY_STS != 'P1'&& progress.CASE_APLY_STS != 'P2' ? '結案' : '' }}</span>
          </div>
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <h3 class="timeline-title">{{ getROCDate(progress.NODE_DATE) }}</h3>
            <p class="font-eudc">{{ progress.NODE_MEMO }}</p>
          </div>
        </li>
      </ul>
    </template>
    <template v-slot:buttons>
      <button class="button is-primary" @click="props.close">關閉</button>
    </template>
  </Modal>
</template>
<script setup>
  import useMoment from '~/composables/useMoment';
  import Modal from '~/components/Modal.vue';
  const { getROCDate } = useMoment();
  const props = defineProps({
    data: {
      type: Object,
      required: true,
      default: {}
    },
    close: {
      type: Function,
      required: false,
      default: () => console.log('close modal!')
    }
  });
  // console.log(props.data);
  const progressList = props.data;
</script>
<style lang="scss"></style>
