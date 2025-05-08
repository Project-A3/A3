export default function () {
  // 產開header第二層選單
  let activeHeaderNav = document.querySelector('.header-nav .active');
  if (activeHeaderNav) {
    document.querySelector('.header-nav [data-page="apply"]').addEventListener('mouseenter', (e) => {
      // alert('enter!');
      let subHeader = document.querySelector('.sub-header');
      let stickyCard = document.querySelector('.isSticky');
      if (subHeader) {
        subHeader.classList.remove('is-hidden');
      }
      if (stickyCard) {
        stickyCard.classList.add('has-sub-header');
      }
    });
  }
  document.querySelectorAll('.header-nav li:not([data-page="apply"])').forEach((el) => {
    el.addEventListener('mouseenter', (e) => {
      let subHeader = document.querySelector('.sub-header');
      let stickyCard = document.querySelector('.isSticky');
      if (subHeader) {
        subHeader.classList.add('is-hidden');
      }
      if (stickyCard) {
        stickyCard.classList.remove('has-sub-header');
      }
    });
  });

  // 決策引導收合
  let btnDecisionDrag = document.querySelector('.button-drag.decision-dragger');
  let decisionAside = document.querySelector('aside');
  let decisionFooter = document.querySelector('.decision-footer');
  let btnAsideToTop = document.querySelector('.button-scroll-to-top.is-in-aside');
  if (btnDecisionDrag && decisionAside && decisionFooter) {
    btnDecisionDrag.addEventListener('click', () => {
      if (btnDecisionDrag.classList.contains('phase1')) {
        btnDecisionDrag.classList.remove('phase1');
        document.querySelectorAll('.tabs').forEach((e) => {
          e.classList.remove('expand');
        });
        decisionAside.scrollTo({
          top: 0,
          behavior: 'auto'
        });
        document.querySelector('main').classList.remove('hide-right');
        decisionAside.style = '';
        decisionFooter.style = '';
        btnAsideToTop.style = '';
      } else {
        btnDecisionDrag.classList.add('phase1');
        decisionAside.style.cssText = 'width: 49.5%; border-left: 5px solid #898991;';
        decisionFooter.style.width = '49.5%';
        btnAsideToTop.style.left = '75.5%';
        decisionAside.querySelectorAll('.tabs').forEach((e) => {
          if (!e.classList.contains('expand')) {
            e.classList.add('expand');
          }
        });
      }

      // 舊的三段式，註解保留
      // if (btnDecisionDrag.classList.contains('phase1')) {
      //   document.querySelector('main').classList.add('hide-right');
      //   btnDecisionDrag.classList.remove('phase1');
      //   btnDecisionDrag.classList.add('phase2');
      //   document.querySelectorAll('.tabs').forEach((e) => {
      //     e.classList.remove('expand');
      //   });
      //   btnAsideToTop.style.left = '130%';
      //   decisionAside.scrollTo({
      //     top: 0,
      //     behavior: 'auto'
      //   });
      // } else if (btnDecisionDrag.classList.contains('phase2')) {
      //   btnDecisionDrag.classList.remove('phase2');
      //   document.querySelector('main').classList.remove('hide-right');
      //   decisionAside.style = '';
      //   decisionFooter.style = '';
      //   btnAsideToTop.style = '';
      // } else {
      //   btnDecisionDrag.classList.add('phase1');
      //   decisionAside.style.cssText = 'width: 49.5%; border-left: 5px solid #898991;';
      //   decisionFooter.style.width = '49.5%';
      //   btnAsideToTop.style.left = '75.5%';
      //   decisionAside.querySelectorAll('.tabs').forEach((e) => {
      //     if (!e.classList.contains('expand')) {
      //       e.classList.add('expand');
      //     }
      //   });
      // }
    });
  }
}
