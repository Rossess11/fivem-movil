ROS = {}
ROS.Phone = {}
ROS.Phone.Functions = {}
ROS.Phone.Data = {
    PlayerData: {},
    Contacts: {},
    Chats: {},
}
var Base
var BaseTarget;
var ActualChat;

// Functions

ROS.Phone.Functions.ScrollDiv = function() {
    var div = document.getElementById('chat-table');
    div.scrollTop = '99999';
}

ROS.Phone.Functions.LoadPhoneData = function(data) {
    ROS.Phone.Functions.LoadContacts(data.PhoneData.Contacts);
    ROS.Phone.Data.PlayerData = data.PlayerData;
    ROS.Phone.Functions.LoadChats(data.PhoneData.Chats);
    document.getElementById('personal-nombre').textContent = data.PlayerData.charinfo.firstname + ' ' +  data.PlayerData.charinfo.lastname;
    document.getElementById('personal-number').textContent = data.PlayerData.charinfo.phone;
    Base = data.PhoneData.Base;
    Base[0].messages = JSON.parse(Base[0].messages);
    //for(var i=0; i<data.PhoneData.Chats.length; i++){
        //console.log(data.PhoneData.Chats[i].messages);
        //var objeto = JSON.parse(data.PhoneData.Chats[i].messages);
        //console.log(objeto.message);
    //}
}

ROS.Phone.Functions.Open = function() {
    document.getElementById('imagen-phone').style.display = 'flex';
    document.getElementById('container-phone').style.display = 'flex';
}

ROS.Phone.Functions.IsNumberInContacts = function(number) {
    let retval = "Unknown"
    for(var i=0; i<ROS.Phone.Data.Contacts.length; i++){
        //console.log(ROS.Phone.Data.Contacts[i].number)
        if(number==ROS.Phone.Data.Contacts[i].number) {
            retval = ROS.Phone.Data.Contacts[i].name;
        }
    }
    return retval;
}

ROS.Phone.Functions.IsNumberInContacts2 = function(number) {
    let retval = number
    for(var i=0; i<ROS.Phone.Data.Contacts.length; i++){
        //console.log(ROS.Phone.Data.Contacts[i].number)
        if(number==ROS.Phone.Data.Contacts[i].number) {
            retval = ROS.Phone.Data.Contacts[i].name;
        }
    }
    return retval;
}

ROS.Phone.Functions.LoadChats = function(chats) {

    let numbersChats = new Set();
    for(var i=0; i<chats.length; i++){
        chats[i].messages = JSON.parse(chats[i].messages);
        chats[i].messages.date = new Date(chats[i].messages.date + ' ' + chats[i].messages.time);
        if(chats[i].messages.sender!=chats[i].citizenid) {
            numbersChats.add(chats[i].number);
        }
        //console.log(chats[i]);
        //console.log(typeof(chats[i].messages.date) + 'fecha: ' + chats[i].messages.date + ' mensaje: ' + chats[i].messages.message);
    }

    //for (let item of numbersChats) console.log(item)
    
    chats.sort((a, b) => a.messages.date - b.messages.date);

    //for(var i=0; i<chats.length; i++){
        //console.log(typeof(chats[i].messages.date) + 'fecha: ' + chats[i].messages.date + ' mensaje: ' + chats[i].messages.message);
    //}

    ROS.Phone.Data.Chats = chats;

    //console.log(ROS.Phone.Data.Chats);

    var contenedorTabla = document.getElementById('messages-table');
    contenedorTabla.innerHTML = "";
    var tabla = "";
    for (const clave of numbersChats.values()) {
        //console.log(clave);
        tabla += "<div id='messages-div0' value='" + clave + "' class='" + clave + "'><div id='messages-div1'>" +  ROS.Phone.Functions.IsNumberInContacts(clave).charAt(0).toUpperCase() + "</div><span id='messages-div2'>" + ROS.Phone.Functions.IsNumberInContacts(clave) + "<br><span id='messages-div3'>Last message</span></span></div>";
    }
    tabla += "";
    contenedorTabla.innerHTML = tabla;
}

ROS.Phone.Functions.LoadContacts = function(contacts) {
    ROS.Phone.Data.Contacts = contacts;
    var numFilas = contacts.length
    var contenedorTabla = document.getElementById('contacts-table');
    contenedorTabla.innerHTML = "";

    var tabla = "";
    for(var i=0; i<numFilas; i++){
        tabla += "<div id='contacts-div'><div id='contacts-div1'></div><span id='contacts-div2'>" + contacts[i].name + "<br><span id='contacts-div3'>" + contacts[i].number + "</span></span></div>"; 
    }
    tabla += "";
    contenedorTabla.innerHTML = tabla;
}

ROS.Phone.Functions.OpenChat = function(number) {

    var contenedorTabla = document.getElementById('chat-table');
    contenedorTabla.innerHTML = "";
    var tabla = "";

    var chats = ROS.Phone.Data.Chats;
    //console.log(chats);
    for(var i=0; i<chats.length; i++){
        let a = chats[i].number;
        //console.log(a);
        if(a==number) {
            if(chats[i].messages.sender==ROS.Phone.Data.PlayerData.citizenid){
                tabla += "<div id='chat-message-right'><span id='texto-right'>" + chats[i].messages.message + "</span></div>";
            }else {
                tabla += "<div id='chat-message-left'><span id='texto-left'>" + chats[i].messages.message + "</span></div>";
            } 
        }
    }
    tabla += "";
    contenedorTabla.innerHTML = tabla;

    document.getElementById('chat-header-title').textContent = ROS.Phone.Functions.IsNumberInContacts2(number);
    document.getElementById('chat-container').style.display = 'flex';
    ROS.Phone.Functions.ScrollDiv();
    ActualChat = number;

}

ROS.Phone.Functions.UpdateMessages = function(data) {
    ROS.Phone.Functions.LoadChats(data.chats);
}


// recividor principal de eventos desde cliente
$(document).ready(function(){
    window.addEventListener('message', function(event) {
        switch(event.data.action) {


            // principal para cargar data
            case "LoadPhoneData":
                ROS.Phone.Functions.LoadPhoneData(event.data);
                break;


            case "open":
                ROS.Phone.Functions.Open();
                break;

            case "updateMessages":
                ROS.Phone.Functions.UpdateMessages(event.data);

        }
    })
});

                
                
