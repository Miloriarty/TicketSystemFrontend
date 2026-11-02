import {HttpInterceptor, HttpInterceptorFn} from '@angular/common/http'
import { API_URL } from './api';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) =>
  req.url.startsWith(API_URL) ? next(req.clone({withCredentials: true})) : next(req);



