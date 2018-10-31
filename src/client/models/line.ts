import { Collaborator } from './collaborator';

export class Line {

    lineNum: number;
    text: string;
    activeCollaborators: Collaborator[];

    constructor(number: number, text: string) {
        this.lineNum = number;
        this.text = text;
        this.activeCollaborators = [];
    }

    createElement(): HTMLDivElement {
        let eShell = document.createElement('div');

        let eLinenumber = document.createElement('div');
        eLinenumber.className = 'lineNumber';
        eLinenumber.innerText = String(this.lineNum + '.  ');

        let eText = document.createElement('div');
        eText.className = 'content';
        eText.contentEditable = 'true';
        eText.innerText = this.text;


        eShell.appendChild(eLinenumber);
        eShell.appendChild(eText);

        return eShell;
    }

    addCollaborator(collaborator: Collaborator) {
        this.activeCollaborators.push(collaborator);
    }

    removeCollaborator(collaborator: Collaborator) {
        this.activeCollaborators = this.activeCollaborators.filter(c => c.name !== collaborator.name);
    }
}