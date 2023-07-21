const socket = io()

socket.on("newMessage", (message) => {
    console.log(message);
})

document.getElementById("chat-form").addEventListener("submit", onSubmit);
document.getElementById("send-location").addEventListener("click", onSendLocationClick);

function onSubmit(event) {
    event.preventDefault();
    socket.emit("sendMessage", this.message.value, (error) => {
        if(error){
            return console.log(error);
        }
        console.log("The message was delivered!");
    });
}

function onSendLocationClick(event) {
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser!");
    }

    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log("latitude, longitude:", latitude, longitude);
        socket.emit("sendLocation", { latitude, longitude }, () => {
            console.log("Location shared!");
        })
    })
}