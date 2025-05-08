import '~/assets/sass/main.scss';
import { bindScrollToTop, scrollToElement, toggleCard } from '../utils';

let OpenDropdown = function (e) {
  if (e.target.closest('.dropdown')) {
    let dropdown = e.target.closest('.dropdown');
    // e.stopPropagation();
    let dropdownMenu = e.target.closest('.dropdown-menu');
    if (dropdownMenu === null) {
      dropdown.classList.toggle('is-active');
    } else if (e.target.closest('.select-no-close') === null && e.target.matches('.dropdown-item, .dropdown-item *')) {
      dropdown.classList.toggle('is-active');
      let selectOptionText = e.target.innerText;
      // 設定選擇項目文字
      // dropdown.querySelector('.dropdown-trigger button span').innerHTML = selectOptionText;
      let dot = e.target.closest('.dropdown-item').querySelector('.dot');
      if (dot != null) {
        dropdownMenu.previousElementSibling.querySelector('.dot').classList = dot.classList;
      }
    }
  }
};

let closeDropdowns = function (e) {
  let customDropdownsEl = document.querySelectorAll('.dropdown');
  customDropdownsEl.forEach(
    (el) => el !== e.target.closest('.dropdown') && el.classList.contains('is-active') && el.classList.remove('is-active')
  );
};

export default function () {
  document.removeEventListener('click', OpenDropdown, true);
  document.addEventListener('click', OpenDropdown, true);

  window.removeEventListener('click', closeDropdowns);
  window.addEventListener('click', closeDropdowns);

  // 收合右側
  let btnDrag = document.querySelector('.button-drag:not(.decision-dragger)');
  if (btnDrag) {
    btnDrag.addEventListener('click', (e) => {
      e.currentTarget.style = null;
      document.querySelector('aside').style = null;
      let resizer = document.getElementById('resizer');
      document.getElementsByTagName('main')[0].classList.toggle('hide-right');
      let isHideRight = () => document.getElementsByTagName('main')[0].classList.contains('hide-right');
      if (resizer) {
        if (isHideRight()) {
          resizer.style.display = 'none';
        } else {
          setTimeout(() => {
            resizer.style.display = 'block';
            console.log(document.querySelector('aside').clientWidth + 10);
            resizer.style.right = document.querySelector('aside').clientWidth + 10 + 'px';
          }, 500);
        }
      }
      let btnActualAmount = document.getElementById('btnActualAmount');
      if (btnActualAmount) {
        if (isHideRight()) {
          btnActualAmount.style.right = '3%';
          document.querySelector('.payment-each-beneficiary').style.right = '3.15%';
        } else {
          btnActualAmount.style = '';
          document.querySelector('.payment-each-beneficiary').style = '';
        }
      }

      let decisionFooter = document.querySelector('.decision-footer');
      if (decisionFooter) {
        if (isHideRight()) {
          // decisionFooter.style = '500px';
          decisionFooter.style.right = `-${decisionFooter.getBoundingClientRect().width}px`;
        } else {
          decisionFooter.style = '';
          // decisionFooter.style.display = 'block';
        }
      }
    });
  }

  let subHeader = document.querySelector('.sub-header');
  if (subHeader) {
    subHeader.addEventListener('mouseleave', (e) => {
      // alert('leave!');
      // let subHeader = document.querySelector('.sub-header');
      if (subHeader) {
        subHeader.classList.add('is-hidden');
      }
      let stickyCard = document.querySelector('.isSticky');
      if (stickyCard) {
        stickyCard.classList.remove('has-sub-header');
      }
    });

    subHeader.querySelectorAll('li a').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        event.preventDefault();
        console.log(anchor.getAttribute('href'));
        let scrollElement = document.getElementById(anchor.getAttribute('href').replace('#', ''));
        subHeader.classList.add('is-hidden');
        let stickyCard = document.querySelector('.isSticky');
        if (stickyCard) {
          stickyCard.classList.remove('has-sub-header');
        }
        if (anchor.getAttribute('href') !== '#ApplyFirstCard') {
          scrollToElement(scrollElement, 80, 'smooth');
        } else {
          scrollToElement(document.querySelector('header'), 0, 'smooth');
        }
        // alert('asf');
      });
    });
  }

  // Scroll to top button
  bindScrollToTop('main > section', 'section .button-scroll-to-top');
  bindScrollToTop('main > aside', '.is-in-aside.button-scroll-to-top');
}
