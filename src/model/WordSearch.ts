export interface WordSearchInterface {
    sub?: string;
    cats?: Array<string>;
    lecs?: Array<string>;
    levs?: Array<number>;
    cnt?: number;
}

export class WordSearch implements WordSearchInterface {
    sub?: string;
    cats?: Array<string>;
    lecs?: Array<string>;
    levs?: Array<number>;
    cnt?: number;

    constructor(obj?: WordSearchInterface){
        this.sub = obj && obj.sub || null;
        this.cats = obj && obj.cats || null;
        this.lecs = obj && obj.lecs || null;
        this.levs = obj && obj.levs || null;
        this.cnt = obj && obj.cnt || 0;
    }
}