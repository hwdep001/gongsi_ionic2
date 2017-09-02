export interface UserInterface {
    uid?: string;
    email?: string;
    name?: string;
    photoURL?: string;

    createDate?: any;
    lastSigninDate?: any;
    signinCnt?: number;
    vKey?: any;
    vDate?: any;
}

export class User implements UserInterface {
    uid?: string;
    email?: string;
    name?: string;
    photoURL?: string;

    createDate?: any;
    lastSigninDate?: any;
    signinCnt?: number;
    vKey?: any;
    vDate?: any;

    constructor(){

    }
}