// @ts-ignore
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");



// @ts-ignore
const socket = io('/collab');

/*
document.addEventListener('keydown', function (event) {
    if (editor.getValue()) {
    }
});
*/

editor.session.on('change', function (event: any) {
    socket.emit('sendText', editor.getValue());
})


socket.on('updateText', (data: any) => {
    if (event != editor.getValue()) {
        editor.setValue(data);
    }
});

console.log(socket);
// setEventHandlers();

// document.addEventListener('keydown',function (event) {
//     if (event.keyCode == 13){
//
//     }
// })




