export interface CategoryInterface {
    key?: string;
    name?: string;

    list?: Array<any>;
}

export class Category implements CategoryInterface {
    key?: string;
    name?: string;

    list?: Array<any>;

    constructor(obj?: CategoryInterface) {
        this.key = obj && obj.key || null;
        this.name = obj && obj.name || null;
        this.list = obj && obj.list || null;
    }
}