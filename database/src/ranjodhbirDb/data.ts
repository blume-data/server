export class Data {

    readonly id: string;
    readonly spaceApplicationLanguage: string;

    constructor(id: string, language: string) {
        this.id = id;
        this.spaceApplicationLanguage = language;
    }
}