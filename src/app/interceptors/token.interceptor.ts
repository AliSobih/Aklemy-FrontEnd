import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // احصل على الـ Token من LocalStorage
  let token = sessionStorage.getItem('authToken');
  if (token == null || token == undefined) {
    token = localStorage.getItem('authToken');
  }

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedReq); // أرسل الطلب المعدل مع الـ Token
  }

  // إذا لم يكن هناك Token، أرسل الطلب كما هو
  return next(req);
};
