export interface SubjectInterface {
    key?: string;
    name?: string;
    num?: number;

    list?: Array<any>;
}

export class Subject implements SubjectInterface {
    key?: string;
    name?: string;
    num?: number;

    list?: Array<any>;

    constructor(name: string, num: number){
        this.name = name;
        this.num = num;
    }
}