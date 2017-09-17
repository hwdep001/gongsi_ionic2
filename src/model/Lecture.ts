export interface LectureInterface {
    key?: string;
    name?: string;
    categoryKey?: string;

    list?: Array<any>;
}

export class Lecture implements LectureInterface {
    key?: string;
    name?: string;
    categoryKey?: string;

    list?: Array<any>;

    constructor(key: string, name: string, categoryKey?: string){
        this.key = key;
        this.name = name;
        this.categoryKey = categoryKey;
    }
}