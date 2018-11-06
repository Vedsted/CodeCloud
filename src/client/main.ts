

const socket = io('/collab');


socket.emit('sendText', "A lovely message");
socket.on('updateText', (data : any)=>{
    console.log(data)
});
console.log(socket);
// setEventHandlers();

// document.addEventListener('keydown',function (event) {
//     if (event.keyCode == 13){
//
//     }
// })




