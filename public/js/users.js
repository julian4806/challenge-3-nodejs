const socket = io();

socket.on('user-list', (obj) => {
    for (const [key, room] of Object.entries(obj)) {
        console.log(`${room.username}: ${room.room}`);
        document.getElementById('player-list').innerHTML +=
            `
        <div class="w-full flex justify-between">
            <div>
                <span class="">🔴</span>
                <span class="">Cinderella</span>
            </div>
            <span class="text-black">Chillout place</span>
        </div>
        `
    }
})