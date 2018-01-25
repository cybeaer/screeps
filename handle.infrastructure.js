'use strict';

module.exports = {
    spawnMessage(room){
        let theSpawn = Game.rooms[room].find(FIND_MY_SPAWNS)[0];
        if(theSpawn) {
            if (theSpawn.spawning) {
                let spawningCreep = Game.creeps[theSpawn.spawning.name];
                Game.rooms[room].visual.text(
                    'new ' + spawningCreep.getJob()+' / '+spawningCreep.getRole(),
                    theSpawn.pos.x + 1,
                    theSpawn.pos.y + 1,
                    {align: 'left', opacity: 0.8}
                );
            }
        }
    }
};