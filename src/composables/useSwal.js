import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { useLanguageStore } from '~/stores/language';

export default function useSwal() {
  const success = (title) => {
    const language = useLanguageStore();
    Swal.fire({
      icon: 'success',
      title: title ?? (language ? language.translate('Common_Client_004') : '操作成功'),
      text: '',
      confirmButtonColor: '#6fba2a',
      confirmButtonText: language ? language.translate('Common_Client_005') : '確定'
    });
    setTimeout(() => {
      document.querySelector('.swal2-confirm').focus();
    }, 100);
  };

  const fail = (title, text = '') => {
    const language = useLanguageStore();  
    Swal.fire({
      icon: 'error',
      title: `<span>${title ?? (language ? language.translate('Common_Client_006') : '操作失敗')}</span>`,
      text,
      confirmButtonColor: '#6fba2a',
      confirmButtonText: language ? language.translate('Common_Client_005') : '確認'
    });
    setTimeout(() => {
      document.querySelector('.swal2-confirm').focus();
    }, 100);
  };

  const warning = (title, text = '') => {
    const language = useLanguageStore();
    Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonColor: '#6fba2a',
      confirmButtonText: language ? language.translate('Common_Client_005') : '確定'
    });
    setTimeout(() => {
      document.querySelector('.swal2-confirm').focus();
    }, 100);
  };

  const info = (title) => {
    const language = useLanguageStore();
    Swal.fire({
      icon: 'info',
      title,
      text: '',
      confirmButtonColor: '#6fba2a',
      confirmButtonText: language ? language.translate('Common_Client_005') : '確定'
    });
    setTimeout(() => {
      document.querySelector('.swal2-confirm').focus();
    }, 100);
  };

  const confirm = (title = '', confirmCallback, confirmButtonText, text = '', cancelCallback = null) => {
    const language = useLanguageStore();
    const swalWithButtons = Swal.mixin({
      customClass: {
        confirmButton: 'button swal-primary',
        cancelButton: 'button swal-light'
      },
      buttonsStyling: false
    });
    swalWithButtons
      .fire({
        title,
        text,
        showCancelButton: true,
        // cancelButtonColor: '#d33',
        cancelButtonText: language ? language.translate('Common_Client_007') : '取消',
        // confirmButtonColor: '#6fba2a',
        // html: true,
        confirmButtonText: confirmButtonText ?? (language ? language.translate('Common_Client_005') : '確定'),
        reverseButtons: true
      })
      .then((result) => {
        if (result.isConfirmed) {
          confirmCallback();
        } else {
          if (cancelCallback && typeof cancelCallback === 'function') cancelCallback();
        }
      });
  };

  // return Promise: result.isConfirmed
  const confirmAsync = (title = '', confirmButtonText, text = '', cancelButtonText) => {
    const language = useLanguageStore();
    const swalWithButtons = Swal.mixin({
      customClass: {
        confirmButton: 'button swal-primary',
        cancelButton: 'button swal-light'
      },
      buttonsStyling: false
    });
    return swalWithButtons.fire({
      title,
      text,
      showCancelButton: true,
      // cancelButtonColor: '#d33',
      cancelButtonText: cancelButtonText ?? (language ? language.translate('Common_Client_007') : '取消'),
      // confirmButtonColor: '#6fba2a',
      confirmButtonText: confirmButtonText ?? (language ? language.translate('Common_Client_005') : '確定'),
      reverseButtons: true
    });
  };

  const $swal = {};
  $swal.success = success;
  $swal.fail = fail;
  $swal.fire = Swal.fire; // 範例可參考: https://sweetalert2.github.io/
  $swal.confirm = confirm;
  $swal.warning = warning;
  $swal.info = info;
  $swal.confirmAsync = confirmAsync;
  $swal.getInstance = () => Swal;
  return {
    $swal
  };
}
