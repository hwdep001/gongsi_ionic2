export interface VerificationInterface {
    key: string;
    createDate?: string;
    vUid?: string;
    vDate?: string;
}

export class Verification implements VerificationInterface {
    key: string;
    createDate?: string;
    vUid?: string;
    vDate?: string;

    constructor(){

    }

}