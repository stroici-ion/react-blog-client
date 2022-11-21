import $api from '../http';
import { RegisterUserType, UserType } from '../models/user.model';

export async function logout() {
  return $api.post('/api/user/logout');
}

export async function forgotPassword(email: string) {
  return $api.post('/api/user/recover', { email }).then((res) => res.data);
}

export async function confirmEmailAndUniqueKey(email: string, key: string) {
  return $api.post('/api/user/recover/confirm', { email, key }).then((res) => res.data);
}

export async function confirmNewPassword(email: string, password: string) {
  return $api
    .post('/api/user/recover/reset', {
      password,
      email,
    })
    .then((res) => res.data);
}
