// Tab切換
const ACTIVE_CLASS = 'is-active';

function initTabs(range = document) {
  const TABS = [...range.querySelectorAll('.tabs > ul > li:not(.is-link)')];

  TABS.forEach((tab) => {
    tab.removeEventListener('click', handler);
    tab.addEventListener('click', handler);
  });
}

function setActiveTab(tabTarget) {
  let content = tabTarget.getAttribute('data-content');
  // console.log(tab);
  updateActiveTab(tabTarget);
  updateActiveContent(tabTarget, content);
}

function handler(event) {
  let tab = event.currentTarget;
  let content = tab.getAttribute('data-content');
  // console.log(tab);
  updateActiveTab(tab);
  updateActiveContent(tab, content);
}

function updateActiveTab(selected) {
  selected.parentElement.querySelectorAll('li').forEach((e) => {
    e.classList.remove(ACTIVE_CLASS);
  });
  selected.classList.add(ACTIVE_CLASS);
}

function updateActiveContent(tab, content) {
  tab
    .closest('.tabs')
    .querySelectorAll('.tab-content')
    .forEach((e) => {
      e.classList.remove(ACTIVE_CLASS);
    });
  let contentElement = document.getElementById(content);
  // debugger;
  if (contentElement) {
    contentElement.classList.add(ACTIVE_CLASS);
  }
}

export { initTabs, setActiveTab };
