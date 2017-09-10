export interface UserInterface {
    uid?: string;
    email?: string;
    name?: string;
    photoURL?: string;

    createDate?: any;
    lastSigninDate?: any;
    ad?: boolean;

    authenticated?: boolean;
}

export class User implements UserInterface {
    uid?: string;
    email?: string;
    name?: string;
    photoURL?: string;

    createDate?: any;
    lastSigninDate?: any;
    ad?: boolean;

    authenticated?: boolean;

    constructor(){

    }
}