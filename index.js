var map = L.map('map').setView([51,-114],11);

var tileLayer = L.tileLayer(
    'https://api.mapbox.com/styles/v1/mahmoudali1/cltqrv9m701h601oigguobcos/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFobW91ZGFsaTEiLCJhIjoiY2xyOW0wbW5sMDRyODJscnBlMnN4NjlvbiJ9.E1lIVvH7V0ad0ud-xp9jgQ', {
        tileSize: 512,
        zoomOffset: -1,
        attribution: '"© OpenStreetMap contributors"'
    }).addTo(map);
    
const iconBlue = L.icon({
    iconUrl: "Images/blue_marker.svg",
    iconSize: [38, 38],
});

const iconGreen = L.icon({
    iconUrl: "Images/green_marker.svg",
    iconSize: [38, 38],
});

const iconRed = L.icon({
    iconUrl: "Images/red_marker.svg",
    iconSize: [38, 38],
});

const iconLayer = L.layerGroup().addTo(map);

    
var client;

function startConnection() {
    document.getElementById('brokerHost').disabled = true;
    document.getElementById('brokerPort').disabled = true;
    document.getElementById('startButton').disabled = true;
    document.getElementById('endButton').disabled = false;

    const host = document.getElementById('brokerHost').value;
    const port = parseInt(document.getElementById('brokerPort').value);
    const clientId = "web_client_" + parseInt(Math.random() * 100, 10);
    console.log("clinetID: " + clientId);

    client = new Paho.MQTT.Client(host, port, clientId);
    client.onMessageArrived = onMessageArrived;
    client.connect({
        timeout: 4000,
        onSuccess: onConnect,
        useSSL: true
    });
}

function onConnect() {
    alert("Connected to MQTT Broker");
    // Subscribe to your topic
    const topic = "ENGO551/Mahmoud/my_temperature";
    client.subscribe(topic);
}

function onMessageArrived(message) {

    // Hide Loading Indicatior
    document.getElementById('buttonText').style.display = '';
    document.getElementById('loadingIndicator').style.display = 'none';

    console.log("onMessageArrived: " + message.payloadString);
    const data = JSON.parse(message.payloadString);
    console.log(data)
    

    let icon; 
    let temperature = data.temperature;
    iconLayer.clearLayers();

    if(temperature <= 10){
        icon = iconBlue
    }
    else if (temperature > 10 && temperature <= 30) {
        icon = iconGreen;
        } else{
            icon = iconRed;
        }
    var marker = L.marker([data.latitude, data.longitude], {icon:icon}).bindPopup(`Temperature: ${data.temperature}°C`).openPopup();
    iconLayer.addLayer(marker);
    
}

function shareMyStatus() {

    // Show Loading Indicator
    document.getElementById('buttonText').style.display = 'none';
    document.getElementById('loadingIndicator').style.display = '';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const temperature = Math.floor(Math.random() * 100) - 40; // Random temperature
            console.log(Math.random())
            const payload = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                temperature: temperature
            };
            const message = new Paho.MQTT.Message(JSON.stringify(payload));
            message.destinationName = "ENGO551/Mahmoud/my_temperature";
            client.send(message);
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

function endConnection() {
    document.getElementById('brokerHost').disabled = false;
    document.getElementById('brokerPort').disabled = false;
    document.getElementById('startButton').disabled = false;
    document.getElementById('endButton').disabled = true;

    if (client) client.disconnect();
    alert("Disconnected from MQTT Broker");
}
      