import { CanActivateFn } from '@angular/router';

export const directionGuard: CanActivateFn = (route, state) => {
  const path = state.url;

  // تحقق إذا كانت المسار يبدأ بـ '/home'
  if (path.startsWith('/home')) {
    // إذا كان المسار يبدأ بـ '/home'، قم بتطبيق الإعدادات
    if (document.documentElement.getAttribute('dir') === 'rtl') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.style.fontFamily = "'Katibeh', serif";
    }
  } else {
    // إذا لم يكن المسار يبدأ بـ '/home'، إعادة تعيين الإعدادات إلى الافتراضية
    if (document.documentElement.getAttribute('dir') === 'ltr') {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.style.fontFamily = '';
    }
  }

  return true; // السماح بالانتقال
};
