let colors = ['red', 'green', 'blue', 'purple'];

export class Collaborator {
    name: string;
    posLine: number;
    posCharacter: number;
    color: string;

    constructor() {
        this.name = 'lars';
        this.posLine = 1;
        this.posCharacter = 1;
        this.color = colors[random(0, 4)];
    }

}

function random(from: number, to: number): number {
    let dist = to - from + 1;
    return Math.floor(Math.random() * dist) + from;
}