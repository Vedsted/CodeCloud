export class Collaborator {

    public id: string;
    public position: { row: number, column: number };

    constructor(id: string,
        position: { row: number, column: number }) {

        this.id = id;
        this.position = position;
    }
}