// 將Script include進來
const includeScript = (src, type = 'module') => {
  let uiScript = document.createElement('script');
  uiScript.setAttribute('src', src);
  uiScript.setAttribute('type', type);
  document.head.appendChild(uiScript);
};

// 拚出索賠類別Tippy文字
const handleClamCatText = (CLAM_CAT, CLAM_CAT_NAME) => {
  if (CLAM_CAT && CLAM_CAT_NAME) {
    let catArray = CLAM_CAT.split('.');
    let catNameArray = CLAM_CAT_NAME.split('.');
    let concatArray = [];
    for (let i = 0; i < catArray.length; i++) {
      concatArray.push(`${catNameArray[i]}(${catArray[i]})`);
    }
    return concatArray.join('、');
  }
  return '';
};

const initStickyThead = () => {
  const theadObserver = new IntersectionObserver(([e]) => e.target.toggleAttribute('stuck', e.intersectionRatio < 1), {
    root: document.querySelector('#dataTable thead'),
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
};

const bindScrollToTop = (root, scrollButton, offset = 0.04) => {
  // Scroll to top button
  var scrollToTopBtn = document.querySelector(scrollButton);
  var rootElement = document.querySelector(root);
  // console.log(scrollToTopBtn);
  function handleScroll() {
    // console.log(rootElement.scrollTop, rootElement.scrollHeight, rootElement.clientHeight);
    // Do something on scroll
    var scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;
    if (rootElement.scrollTop / scrollTotal > offset) {
      // Show button
      scrollToTopBtn.classList.add('show');
    } else {
      // Hide button
      scrollToTopBtn.classList.remove('show');
    }
  }

  function scrollToTop() {
    // Scroll to top logic
    rootElement.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    scrollToTopBtn.classList.remove('show');
  }
  if (scrollToTopBtn) scrollToTopBtn.addEventListener('click', scrollToTop);
  if (rootElement && scrollToTopBtn) rootElement.addEventListener('scroll', handleScroll);
};

const scrollToElement = (element, offset = 0, behavior = 'instant') => {
  const y = element.offsetTop + window.scrollY - offset;
  console.log(element.offsetTop);
  document.querySelector('#mainSection').scroll({
    top: y,
    behavior: behavior
  });
};

const checkAllInTable = (parent, cbSelectAll = '.select-all', trActiveClass = '') => {
  // 全選、點擊tr選取checkbox
  let root = document.querySelector(parent);
  let checkboxTableTr = root.querySelectorAll('table tbody tr');
  let checkAllCheckbox = root.querySelector(cbSelectAll);
  let checkboxes = root.querySelectorAll('table tbody tr td input[type=checkbox]');

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      if (checkbox.checked) {
        if (trActiveClass != '') {
          checkbox.closest('tr').classList.add(trActiveClass);
        }

        // tr.classList.add('checked');
        if (
          root.querySelectorAll('tbody input[type=checkbox]:checked').length ===
          root.querySelectorAll('tbody input[type=checkbox]').length
        ) {
          checkAllCheckbox.checked = true;
        }
      } else {
        if (trActiveClass != '') {
          checkbox.closest('tr').classList.remove(trActiveClass);
        }
        checkAllCheckbox.checked = false;
      }
    });
  });

  checkAllCheckbox.addEventListener('click', (event) => {
    // console.log(event.currentTarget.checked);
    checkboxes.forEach((checkbox) => {
      checkbox.checked = event.currentTarget.checked;
      checkbox.dispatchEvent(new Event('change'));
    });
  });
};

// 卡片收合
const toggleCard = (root = document) => {
  // 卡片收合
  root.querySelectorAll('.card-toggle-btn').forEach((element) => {
    // click card toggle button
    let toggle = function (e) {
      let element = e.currentTarget;
      // console.log(element);
      // toggle expand class
      element.classList.toggle('expand');

      // toggle parts
      let card = element.parentElement;

      card.querySelectorAll('.hidden-parts').forEach((hiddenElement) => {
        // console.log(hiddenElement.style.display);
        if (getComputedStyle(hiddenElement).display === 'none') {
          hiddenElement.style.display = 'block';
        } else {
          hiddenElement.style.display = 'none';
        }
        // console.log(hiddenElement);
      });

      if (element.classList.contains('expand')) {
        card.classList.add('is-expanded');
      } else {
        card.classList.remove('is-expanded');
      }
    };
    element.removeEventListener('click', toggle);
    element.addEventListener('click', toggle);
  });
};

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const uuid = (length = 16) =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(length)
  );

const sequence = (arr, field) => Math.max(...arr.map((n) => n[field]).concat(0)) + 1;

const toCurrency = (num, defaultText = '0') => {
  if (!num) return defaultText;
  var parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

export {
  includeScript,
  handleClamCatText,
  initStickyThead,
  bindScrollToTop,
  scrollToElement,
  checkAllInTable,
  toggleCard,
  $,
  $$,
  uuid,
  sequence,
  toCurrency
};
