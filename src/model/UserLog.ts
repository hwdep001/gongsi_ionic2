import { User } from './User';
export interface UserLogInterface {
    createDate?: string;
    type?: string;
    uid?: string;

    user?: User;
    typeVal?: string;
}

export class UserLog implements UserLogInterface {
    createDate?: string;
    type?: string;
    uid?: string;

    user?: User;
    typeVal?: string;

    constructor(){

    }
}