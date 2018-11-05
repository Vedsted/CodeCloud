import { Collaborator } from './collaborator';

export class Line {
    text: string;
    activeCollaborators: Collaborator[];

    constructor(text: string) {
        this.text = text;
        this.activeCollaborators = [];
    }

    createElement(): HTMLDivElement {

        let eLine = document.createElement('div');
        eLine.className = 'line';
        eLine.contentEditable = 'true';
        eLine.innerText = this.text;

        return eLine;
    }

    addCollaborator(collaborator: Collaborator) {
        this.activeCollaborators.push(collaborator);
    }

    removeCollaborator(collaborator: Collaborator) {
        this.activeCollaborators = this.activeCollaborators.filter(c => c.name !== collaborator.name);
    }
}