export interface UserLogInterface {
    createDate: string;
    type: string;
    uid: string;
}

export class UserLog implements UserLogInterface {
    createDate: string;
    type: string;
    uid: string;

    vKey?: string;
    cnt?: number;

    constructor(){

    }
}