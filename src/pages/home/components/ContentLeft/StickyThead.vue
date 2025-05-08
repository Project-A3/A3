<template>
  <thead ref="target">
    <slot></slot>
  </thead>
</template>

<script setup>
  const target = ref(null);
  // 只For個人化首頁的Table使用
  onMounted(() => {
    let trInside = target.value.querySelector('tr');
    if (trInside && !trInside.classList.contains('scroll-fix')) {
      trInside.classList.add('scroll-fix');
    }
    const theadObserver = new IntersectionObserver(([e]) => e.target.toggleAttribute('stuck', e.intersectionRatio < 1), {
      root: target.value,
      threshold: [1]
    });
    const normalObserver = new IntersectionObserver(([e]) => e.target.toggleAttribute('stuck', e.intersectionRatio < 1), {
      threshold: [1]
    });
    document.querySelectorAll('.scroll-fix').forEach((el) => {
      // console.log(el.parentElement.tagName);
      if (el.parentElement.tagName === 'THEAD') {
        theadObserver.observe(el);
      } else {
        normalObserver.observe(el);
      }
    });
  });
</script>
