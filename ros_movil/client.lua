local QBCore = exports['qb-core']:GetCoreObject()

PhoneData = {
    PlayerData = nil,
    Contacts = {},
    Chats = {}
}

--funcion ver si ese numero esta dentro de contactos
local function IsNumberInContacts(num)
    local retval = num
    for _, v in pairs(PhoneData.Contacts) do
        if num == v.number then
            retval = v.name
        end
    end
    return retval
end

--funcion principal cargar datos del telefono
local function LoadPhone()
    Wait(100)

    -- hacemos llamada a funcion para phone data en server (sql)
    QBCore.Functions.TriggerCallback('ros_phone:server:GetPhoneData', function(pData)

        -- informacion del jugador
        PhoneData.PlayerData = QBCore.Functions.GetPlayerData()

        -- si datos de contactos diferente de vacio, recogemos contactos
        if pData.PlayerContacts ~= nil and next(pData.PlayerContacts) ~= nil then
            PhoneData.Contacts = pData.PlayerContacts
        end

        -- segun mensajes se hace chats en server, recogidos dentro de chats
        if pData.Chats ~= nil and next(pData.Chats) ~= nil then
            PhoneData.Chats = pData.Chats
        end

        if pData.Base ~= nil then
            PhoneData.Base = pData.Base
        end

        -- llamada a javascript
        SendNUIMessage({
            action = "LoadPhoneData",
            PhoneData = PhoneData,
            PlayerData = PhoneData.PlayerData,
            PlayerId = GetPlayerServerId(PlayerId())
        })

    end)
end



RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    LoadPhone()
end)


--Open phone

local function OpenPhone()

    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "open",
        PlayerData = PhoneData.PlayerData,
    })

end

--Commands

RegisterCommand('phone', function()
    local PlayerData = QBCore.Functions.GetPlayerData()
        if not PlayerData.metadata['ishandcuffed'] and not PlayerData.metadata['inlaststand'] and not PlayerData.metadata['isdead'] and not IsPauseMenuActive() then
            OpenPhone()
            LoadPhone()
        else
            QBCore.Functions.Notify("Imposible...", "error")
        end
end)

RegisterKeyMapping('phone', 'Open Phone', 'keyboard', 'M')


-- Nui Callbacks

RegisterNUICallback("sendMessage", function(data, cb)
    if data.mensaje then
        TriggerServerEvent('ros_movil:sendMessage', data.mensaje,data.chatActual,data.charInfo,data.senderNumber)
        cb("ok")
    end
    cb(nil)
end)