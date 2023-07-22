const socket = io()

socket.on("newMessage", (message) => {
    console.log(message);
})

const chatForm = document.getElementById("chat-form");
const messageInput = chatForm.querySelector("input");
const sendButton = chatForm.querySelector("button");
chatForm.addEventListener("submit", onSubmit);

const sendLocationButton = document.getElementById("send-location");
sendLocationButton.addEventListener("click", onSendLocationClick);

function onSubmit(event) {
    event.preventDefault();
    sendButton.setAttribute("disabled", "disabled");
    socket.emit("sendMessage", this.message.value, (error) => {
        if(error){
            return console.log(error);
        }
        sendButton.removeAttribute("disabled");
        messageInput.value = "";
        messageInput.focus();
        // chatForm.reset();
        console.log("The message was delivered!");
    });
    
}

function onSendLocationClick(event) {
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser!");
    }
    sendLocationButton.setAttribute("disabled", "disabled");
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log("latitude, longitude:", latitude, longitude);
        socket.emit("sendLocation", { latitude, longitude }, () => {
            console.log("Location shared!");
            sendLocationButton.removeAttribute("disabled");
        })
    })
}