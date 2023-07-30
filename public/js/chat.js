const socket = io()

const chatForm = document.getElementById("chat-form");
const messageInput = chatForm.querySelector("input");
const sendButton = chatForm.querySelector("button");
const messages = document.getElementById("messages");

chatForm.addEventListener("submit", onSubmit);

const sendLocationButton = document.getElementById("send-location");
sendLocationButton.addEventListener("click", onSendLocationClick);

//Templates
const messageTemplate = document.getElementById("message-template").innerHTML;
const locationTemplate = document.getElementById("location-template").innerHTML;

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });
console.log("username, room :", username, room);

socket.on("newMessage", (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm:ss a")
    });
    messages.insertAdjacentHTML("beforeend", html);
})

socket.on("locationMessage", (locationMsg) => {
    console.log("Location Received:", locationMsg);
    const html = Mustache.render(locationTemplate, {
        username: locationMsg.username,
        locationURL: locationMsg.url,
        createdAt: moment(locationMsg.createdAt).format("h:mm:ss a")
    });
    messages.insertAdjacentHTML("beforeend", html);
})

socket.emit("join", { username, room }, (error) => {
    if(error){
        alert(error);
        location.href = "/";
    }
});

function onSubmit(event) {
    event.preventDefault();
    sendButton.setAttribute("disabled", "disabled");
    socket.emit("sendMessage", this.message.value, (error) => {
        if (error) {
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