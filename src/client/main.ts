// @ts-ignore
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");



// @ts-ignore
const socket = io('/collab');



editor.session.on('change', function (event: any) {
    socket.emit('sendText', event.getValue());
})

socket.on('updateText', (data: any) => {
    editor.setValue('');
    editor.setValue(data);
});

console.log(socket);
// setEventHandlers();

// document.addEventListener('keydown',function (event) {
//     if (event.keyCode == 13){
//
//     }
// })




