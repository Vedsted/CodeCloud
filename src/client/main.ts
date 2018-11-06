// @ts-ignore
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");


// @ts-ignore
const socket = io('/collab');

var changeLock = false;

/*
document.addEventListener('keydown', function (event) {
    if (editor.getValue()) {
    }
});
*/

editor.session.on('change', function (event: any) {

    if (changeLock) return
    socket.emit('sendText', editor.getValue());

})


socket.on('updateText', (data: any) => {

    changeLock = true;
    editor.setValue(data,1);
    changeLock = false;

});

console.log(socket);
// setEventHandlers();

// document.addEventListener('keydown',function (event) {
//     if (event.keyCode == 13){
//
//     }
// })




