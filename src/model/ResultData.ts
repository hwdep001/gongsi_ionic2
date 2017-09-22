export interface ResultDataInterface {
    result: boolean;
    msg: string;
}

export class ResultData implements ResultDataInterface {
    result: boolean;
    msg: string;

    constructor(result: boolean, msg?: string){
        this.result = result;
        this.msg = msg;
    }
}