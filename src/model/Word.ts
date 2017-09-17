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

    constructor(){

    }
}