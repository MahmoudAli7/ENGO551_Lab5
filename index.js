var map = L.map('map').setView([51,-114],11);

var tileLayer = L.tileLayer(
    'https://api.mapbox.com/styles/v1/mahmoudali1/cltqrv9m701h601oigguobcos/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFobW91ZGFsaTEiLCJhIjoiY2xyOW0wbW5sMDRyODJscnBlMnN4NjlvbiJ9.E1lIVvH7V0ad0ud-xp9jgQ', {
        tileSize: 512,
        zoomOffset: -1,
        attribution: '"© OpenStreetMap contributors"'
    }).addTo(map);
    
    const clientId = "mqttx_2793217f";
    const client = new Paho.MQTT.Client("broker.emqx.io", 8083, "/mqtt", clientId);

    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost: " + responseObject.errorMessage);
        }
    }

    function onMessageArrived(message) {
        console.log("onMessageArrived: " + message.payloadString);
    }

    function onConnect() {
        console.log("Connected to MQTT Broker");
        client.subscribe("test/topic");

        const message = new Paho.MQTT.Message("Hello MQTT from Paho JS");
        message.destinationName = "test/topic";
        client.send(message);
    }

    client.connect({
        onSuccess: onConnect,
        useSSL: true
    });
      