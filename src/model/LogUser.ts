export interface LogUserInterface {
    createDate: string;
    type: string;
    uid: string;
}

export class LogUser implements LogUserInterface {
    createDate: string;
    type: string;
    uid: string;

    vKey?: string;
    cnt?: number;

    constructor(){

    }
}