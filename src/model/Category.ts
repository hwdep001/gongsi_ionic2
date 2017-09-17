export interface CategoryInterface {
    key?: string;
    name?: string;

    list?: Array<any>;
}

export class Category implements CategoryInterface {
    key?: string;
    name?: string;

    list?: Array<any>;

    constructor(key: string, name: string){
        this.key = key;
        this.name = name;
    }
}