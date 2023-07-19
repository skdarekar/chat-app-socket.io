const socket = io()

socket.on("newMessage", (message) => {
    console.log("New message received: ", message);
})

document.getElementById("chat-form").addEventListener("submit", onSubmit);

function onSubmit(event){
    event.preventDefault();
    socket.emit("sendMessage", this.message.value);
}