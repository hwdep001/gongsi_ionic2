export interface WordInterface {
    key?: string;
    head1?: string;
    head2?: string;
    body1?: string;
    body2?: string;
    num?: number;
    levels?: CustomObject;

    categoryKey?: string;
    categoryName?: string;
    lectrueKey?: string;
    lectrueName?: string;
}

export class Word implements WordInterface {
    key?: string;
    head1?: string;
    head2?: string;
    body1?: string;
    body2?: string;
    num?: number;
    levels?: CustomObject;

    categoryKey?: string;
    categoryName?: string;
    lectrueKey?: string;
    lectrueName?: string;

    status?: number;

    constructor(obj?: WordInterface){
        this.key = obj && obj.key || null;
        this.head1 = obj && obj.head1 || null;
        this.head2 = obj && obj.head2 || null;
        this.body1 = obj && obj.body1 || null;
        this.body2 = obj && obj.body2 || null;
        this.num = obj && obj.num || 0;
        this.levels = obj && obj.levels || null;

        this.categoryKey = obj && obj.categoryKey || null;
        this.categoryName = obj && obj.categoryName || null;
        this.lectrueKey = obj && obj.lectrueKey || null;
        this.lectrueName = obj && obj.lectrueName || null;

        this.status = 0;
    }
}