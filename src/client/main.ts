// @ts-ignore
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");


// @ts-ignore
const socket = io('/collab');

var silent = false;

/*
document.addEventListener('keydown', function (event) {
    if (editor.getValue()) {
    }
});
*/

editor.session.on('change', function (event: any) {

    if (silent) return
    socket.emit('sendText', editor.getValue());

})


socket.on('updateText', (data: any) => {
    // if (data != editor.getValue()) {
        silent = true;
        editor.setValue(data);
        silent = false;
    // }
});

console.log(socket);
// setEventHandlers();

// document.addEventListener('keydown',function (event) {
//     if (event.keyCode == 13){
//
//     }
// })




