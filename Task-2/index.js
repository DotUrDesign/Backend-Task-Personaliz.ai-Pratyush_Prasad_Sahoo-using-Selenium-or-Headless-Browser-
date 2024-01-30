const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');

const whatsapp = new Client({
    authStrategy: new LocalAuth()
});

// Function to send a video message
async function sendVideoMessage(contact, videoPath) {
    try {
        const chat = await whatsapp.getChatById(contact);
        const videoData = fs.readFileSync(videoPath, 'base64');
        const videoMessage = new whatsapp.MessageMedia('video/mp4', videoData, 'video.mp4');
        await chat.sendMessage(videoMessage, { sendVideoAsGif: false });
        console.log(`Video message sent to ${contact}`);
    } catch (error) {
        console.error(`Error sending video message to ${contact}: ${error.message}`);
    }
}

// listen for various events
whatsapp.on('qr', qr => {
    qrcode.generate(qr, {
        small: true
    });
});

whatsapp.on('message', async message => {
    if (message.body === "hello" || message.body === "Hello" || message.body === "Hello") {
        message.reply("Hello! My name is Pratyush, and I would love to work with interactly.video.");
    }
});

whatsapp.on('ready', () => {
    console.log("Client is ready");

    // Replace these with actual contact numbers
    const contactsToSend = ['Mrinal IIIT', 'Harsh IIIT', 'Rudra IIIT', 'Mridul IIIT', 'Baljeet IIIT', 'Yash IIIT', 'Madhusudhan IIIT', 'Sidharth IIIT', 'Ankit IIIT', 'Pranav IIIT'];

    // Replace this with the actual path to your video file
    const videoFilePath = './Windows 11 Bloom Animation Loop (60 FPS).mp4';

    contactsToSend.forEach(contact => sendVideoMessage(contact, videoFilePath));
});

whatsapp.initialize();
