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
    },
    towers(room){
        let options={
    		nearToCreep: false,
    		storeRelated: true,
    		type: RESOURCE_ENERGY,
    		inverted: true
        };
        let theRoom = Game.rooms[room];
        let towers = theRoom.getStructures([STRUCTURE_TOWER],null,options);
        if(towers && towers.length > 0){
            let hostiles = theRoom.getHostiles();
            _.each(towers,function(tower){
                if(hostiles[0]){
                    tower.attack(hostiles[0]);
                }else{
                    let target = theRoom.getRepair(STRUCT_HP_CRITICAL);
                    if(!target[0]){
                        target = theRoom.getRepair(STRUCT_HP_MAINTAINANCE);
                    }
                    if(target[0]){
                        target = target[0];
                    }
                    tower.repair(target);
                }
            });
        }
    }
};