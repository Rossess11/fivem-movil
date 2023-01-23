local QBCore = exports['qb-core']:GetCoreObject()

QBCore.Functions.CreateCallback('ros_phone:server:GetPhoneData', function(source, cb)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if Player ~= nil then

        -- diccionario para guardar todos los datos
        local PhoneData = {
            PlayerContacts = {},
            Chats = {}
        }

        -- llamada a sql para contactos
        local result = MySQL.query.await('SELECT * FROM player_contacts WHERE citizenid = ? ORDER BY name ASC', {Player.PlayerData.citizenid})
        if result[1] ~= nil then
            PhoneData.PlayerContacts = result
        end

        -- llamada a sql para mensajes 
        local messages = MySQL.query.await('SELECT * FROM phone_messages WHERE citizenid = ?', {Player.PlayerData.citizenid})
        if messages ~= nil and next(messages) ~= nil then
            PhoneData.Chats = messages
        end

        local prueba = MySQL.query.await('SELECT * FROM phone_messages WHERE citizenid = ?',{"prueba"})
        if prueba[1] ~= nil  then
            PhoneData.Base = prueba
        end

        -- devolvemos todo el diccionario con datos a la funcion 
        cb(PhoneData)

    end
end)


--Inserts

RegisterNetEvent('ros_movil:sendMessage', function(message,numberChat,charEnfo,senderNumber)
    local src = source
    local SenderData = QBCore.Functions.GetPlayer(src)

    local query = '%' .. numberChat .. '%'
    local Player = MySQL.query.await('SELECT * FROM players WHERE charinfo LIKE ?', {query})
    local TargetData = QBCore.Functions.GetPlayerByCitizenId(Player[1].citizenid)
    if Player[1] ~= nil then
        print(Player[1].citizenid)
        MySQL.insert('INSERT INTO phone_messages (citizenid, number, messages) VALUES (?, ?, ?)', {Player[1].citizenid, senderNumber, json.encode(charEnfo)})
        MySQL.insert('INSERT INTO phone_messages (citizenid, number, messages) VALUES (?, ?, ?)', {SenderData.PlayerData.citizenid, numberChat, json.encode(charEnfo)})
        print("ok")
    end

    --if Player[1] ~= nil then
        --local TargetData = QBCore.Functions.GetPlayerByCitizenId(Player[1].citizenid)
        --if TargetData ~= nil then
            --print("ok")
            --MySQL.insert('INSERT INTO phone_messages (citizenid, number, messages) VALUES (?, ?, ?)', {TargetData.PlayerData.citizenid, senderNumber, json.encode(charEnfo)})
            --MySQL.insert('INSERT INTO phone_messages (citizenid, number, messages) VALUES (?, ?, ?)', {pData.PlayerData.citizenid, numberChat, json.encode(charEnfo)})
        --end
    --end
end)