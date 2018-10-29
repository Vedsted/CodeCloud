
function speak(): string {
    return "Hello World";
}

let num = 1;

document.addEventListener('keypress', function (event) {
    if (event.keyCode !== 13) {
        return;
    }
    let line = document.createElement('div');

    num++;

    let l = document.createElement('label');
    l.innerHTML = num + '. ';

    let i = document.createElement('input');



    line.appendChild(l);
    line.appendChild(i);

    document.body.appendChild(line);
    i.focus();
})