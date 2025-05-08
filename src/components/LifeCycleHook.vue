<template>
  <slot></slot>
</template>
<script setup>
  import { useThrottleFn } from '@vueuse/core';
  import initUI from '~/common/ui/initial';
  import { toggleCard } from '~/common/utils';
  import { useFooterStore } from '~/stores/footer';
  const footerStore = useFooterStore();
  const props = defineProps({
    onKeydownSave: {
      type: Function,
      required: false,
      default: () => {
        console.log('save!');
      }
    }
  });
  let observer = null;
  let unsubscribe = null;
  onMounted(() => {
    console.log('init UI');
    initUI();
    toggleCard(document.getElementById('mainSection'));

    console.log('onMounted');
    // 綁定鍵盤儲存事件
    const throttledFn = useThrottleFn(
      async (e) => {
        await props.onKeydownSave();
      },
      3500,
      false
    );

    document.onkeydown = async (e) => {
      // do something, it will be called at most 1 time 5 seconds
      // console.log(e);
      var keyCode = e.keyCode || e.which || e.charCode;
      var ctrlKey = e.ctrlKey || e.metaKey;
      // Ctrl + Q
      if (ctrlKey && keyCode == 81) {
        e.preventDefault();
        throttledFn();
      }
      return true;
    };

    // get the sticky element
    const stickyElm = document.querySelector('.second-card .sticky-basic-info');
    if (stickyElm) {
      observer = new IntersectionObserver(
        ([e]) => {
          // console.log(e.intersectionRatio);
          let stick = document.querySelector('.sticky');
          if (stick) {
            stick.classList.toggle('isSticky', e.intersectionRatio < 1);
          }
          // e.target.classList.toggle('isSticky', e.intersectionRatio < 1);
        },
        {
          // rootMargin: '0px',
          threshold: [1]
        }
      );

      observer.observe(stickyElm);
    }
    // 綁定該頁送出事件
    // 資料送出
    unsubscribe = footerStore.$onAction(
      ({
        name, // name of the action
        store, // store instance, same as `someStore`
        args, // array of parameters passed to the action
        after // hook after the action returns or resolves
      }) => {
        // a shared variable for this specific action call
        const startTime = Date.now();
        // this will trigger before an action on `store` is executed
        console.log(`Start "${name}"`);
        // this will trigger if the action succeeds and after it has fully run.
        // it waits for any returned promised
        if (name === 'submitPageData') {
          // console.log(isSuccess);
          // after click save
          after(async (result) => {
            console.log(args);
            const hasCallback = args.length > 0 && typeof args[0] === 'function';
            let isSuccess = await props.onKeydownSave(hasCallback);
            // 如果有call back，就把結果帶入
            if (hasCallback) await args[0](isSuccess);
            console.log(`Finished "${name}" after ${Date.now() - startTime}ms.\nResult: ${result}.`);
          });
        }
      }
    );
  });
  // // 換頁的話要把註冊的送出取消掉，其他頁會重新註冊
  onUnmounted(() => {
    console.log('onUnmounted');
    if (unsubscribe) unsubscribe();
    document.onkeydown = null;
    if (observer) observer.disconnect();
  });

  // 換頁的話要把註冊的送出取消掉，其他頁會重新註冊
  onDeactivated(() => {
    console.log('deactivated');
    if (unsubscribe) unsubscribe();
    document.onkeydown = null;
    if (observer) observer.disconnect();
  });
</script>
