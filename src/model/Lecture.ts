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

    constructor(obj?: LectureInterface){
        this.key = obj && obj.key || null;
        this.name = obj && obj.name || null;
        this.categoryKey = obj && obj.categoryKey || null;
        this.list = obj && obj.list || null;
    }
}