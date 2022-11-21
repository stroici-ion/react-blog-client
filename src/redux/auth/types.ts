import { SerializedError } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { AuthUserType } from '../../models/user.model';
import { StatusType } from '../posts/types';

export interface IUserState {
  data: AuthUserType | null;
  status: StatusType;
  error: any;
}
