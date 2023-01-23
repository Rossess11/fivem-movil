/*  Reloj  */

setInterval(reloj,1000)

function reloj(){
    momento = new Date();
    hora = momento.getHours();
    minuto = momento.getMinutes();
    segundo = momento.getSeconds();
    document.getElementById('hora').textContent = hora + ':' + minuto; 
}

/*Codigo principal*/


$(function () {

    /*Botones*/

    $("#messages-table").click(function(e) {
        //console.log("valor: " + e.target.className);
        var chats = ROS.Phone.Data.Chats;
        for(var i=0; i<chats.length; i++) {
            if(e.target.className==chats[i].number){
                ROS.Phone.Functions.OpenChat(chats[i].number);
            }
        }
    });

    $("#call").click(function() {
        document.getElementById('call-container').style.display = 'flex';
    });

    $("#messages").click(function() {
        document.getElementById('messages-container').style.display = "flex";
    });

    $("#contacts").click(function() {
        document.getElementById('contacts-container').style.display = "flex";
    });

    $("#boton-inicio").click(function() {
        document.getElementById('call-container').style.display = 'none';
        document.getElementById('messages-container').style.display = 'none';
        document.getElementById('contacts-container').style.display = "none";
        document.getElementById('chat-container').style.display = "none";
    });

    $("#call-perdidas").click(function() {
        document.getElementById('call-perdidas').style.backgroundColor = "rgba(186,0,66,0.4)";
        document.getElementById('call-todas').style.backgroundColor = "#2e2e2e";
    });

    $("#call-todas").click(function() {
        document.getElementById('call-todas').style.backgroundColor = "rgba(186,0,66,0.4)";
        document.getElementById('call-perdidas').style.backgroundColor = "#2e2e2e";
    });

    $("#chat-send").click(function() {
        var message = document.getElementById('chat-input').value;
        var fecha = new Date();
        console.log(message);
        console.log(ActualChat);
        Base[0].messages.message = message;
        Base[0].messages.date = fecha.toString();
        Base[0].messages.time = fecha.getHours() + '-' + fecha.getMinutes();
        Base[0].messages.sender = ROS.Phone.Data.PlayerData.citizenid;
        $.post('https://ros_movil/sendMessage', JSON.stringify({
            mensaje: message,chatActual: ActualChat,charInfo: Base[0].messages,senderNumber: ROS.Phone.Data.PlayerData.charinfo.phone
        }));
        document.getElementById('chat-input').value = "";
    });


    /*Funciones*/






    /*eventos*/

});