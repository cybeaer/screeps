'use strict';

let jobs = require('handle.roles');
let army = require('handle.army');

global.manualSpawn = function manualSpawn(theSpawnName,role,lvl,room=''){
    if(roles[role]===undefined){
        return 'Role '+role+' does not exist!';
    }
    if(roles[role].body[lvl]===undefined || roles[role].body[lvl] === []){
        return 'Body for lvl '+lvl+' does not exist!';
    }
    let theSpawn = Game.spawns[theSpawnName];
    if(!theSpawn) {
        return 'Spawn '+theSpawnName+' does not exist!';
    }
    if(room==='' || Game.rooms[room]===undefined){
        room = theSpawn.room.name;
    }
    let mem = { memory: {
            role: role,
            job: roles[role].job,
            lvl: lvl,
            origSpawn: theSpawnName,
            room: room
        }};
    _.each(roles[role].memory,function(entry,key){
            mem.memory[key] = entry;
        });
    let ret = theSpawn.spawnCreep(roles[role].body[lvl],role+'(manual)'+Game.time,mem);
    return spawnMessageNoEnergy(ret, roles[role].body[lvl]);
};

global.claimRoom = function claimRoom(from,room){
    let theSpawn = Game.spawns[from];
    if(!Game.map.isRoomAvailable(room)){
        return 'Room '+room+' does not exist!'; 
    }
    if(!theSpawn) {
        return 'Spawn '+from+' does not exist!';
    }
    let mem = { memory: {
            role: 'claimer',
            job: 'claimer',
            lvl: 1,
            room: room,
            roaming: true
        }};
    let body = [
            ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
            WORK,
            CARRY,CARRY,
            MOVE,MOVE,MOVE,MOVE,MOVE,
            MOVE,MOVE,MOVE,MOVE,MOVE,
            CLAIM
        ];
    let ret = theSpawn.spawnCreep(body,'Claimer('+room+')'+Game.time,mem)
    return spawnMessageNoEnergy(ret, body);
};

global.spawnMessageNoEnergy = function spawnMessageNoEnergy(ret, body){
    if (ret === ERR_NOT_ENOUGH_ENERGY){
        let costs = 0;
        for(let part in body){
            costs += BODYPART_COST[body[part]];
        }
        return 'Not Enough Energy: '+costs;
    }else{
        return ret;
    }
}

module.exports = {
    cleanUp(){
        for(let name in Memory.creeps){
            if(!Game.creeps[name]){
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    },
    moveToRoom(creep){
        const target = new RoomPosition(25,25,creep.memory.room);
        const path = creep.pos.findPathTo(target);
        if(path){
            creep.moveByPath(path);
        }
    },
    work(room){
        _.each(_.filter(Game.creeps, (creep) => (creep.isInRoom(room)&&!creep.isArmy())), (creep)=>{
            if(room !== creep.memory.room && !creep.isRoamer()){
                this.moveToRoom(creep,room);
            }else{
                creep.updateHeartBeat();
                if(creep.getHeartbeat() === HEARTBEAT_LOW &&
                    creep.room.energyAvailable > creep.room.getLowEnergy() &&
                    creep.memory.lvl === creep.room.getLevel()){
                    this.refreshCreep(creep);
                }else{
                    if (typeof jobs[creep.memory.job] === 'function') {
                        jobs[creep.memory.job](creep);
                    } else {
                        console.log('unknown role ' + creep.memory.job);
                    }
                }
            }
        });
    },
    military(){
        _.each(_.filter(Game.creeps, (creep) => creep.isArmy()), (creep)=>{
            console.log('Creep '+creep.name+' is in Army!');
            //TODO get army
            //TODO tactics?
        });
    },
    checkMilitary(){
        //TODO
    },
    refreshCreep(creep){
        let theSpawn = creep.room.findFirstSpawn();
        if(theSpawn) {
            if (theSpawn.renewCreep(creep) === ERR_NOT_IN_RANGE) {
                creep.moveTo(
                    theSpawn,
                    {visualizePathStyle: {stroke: '#ff0000',lineStyle: 'dashed',opacity: 0.8}}
                );
            }
        }
    },
    checkPopulation(room){
        this.cleanUp();
        let lvl = Game.rooms[room].getLevel();
        let population = this.getPopulation(room);
        _.some(requirements[lvl],(req,key)=>{
            if(population[key] < req){
                this.create(room,key,lvl);
                return true;
            }
        });
    },
    getPopulation(room){
        return {
            harvester:  _.filter(Game.creeps, (creep) => (creep.isRole(ROLE_HARVESTER) && creep.isInRoom(room))).length,
            upgrader:   _.filter(Game.creeps, (creep) => (creep.isRole(ROLE_UPGRADER) && creep.isInRoom(room))).length,
            builder:    _.filter(Game.creeps, (creep) => (creep.isRole(ROLE_BUILDER) && creep.isInRoom(room))).length,
            dispatcher: _.filter(Game.creeps, (creep) => (creep.isRole(ROLE_DISPATCHER) && creep.isInRoom(room))).length,
            recharger:  _.filter(Game.creeps, (creep) => (creep.isRole(ROLE_RECHARGER) && creep.isInRoom(room))).length,
            guard:      _.filter(Game.creeps, (creep) => (creep.isRole(ROLE_GUARD) && creep.isInRoom(room))).length
        };
    },
    create(room,role,lvl,memory=null){
        let theSpawn = Game.rooms[room].findFirstSpawn();
        if(theSpawn === undefined){
            return -99;
        }
        if(roles[role].roaming === undefined){
            roles[role].roaming = false;
        }
        let mem = { memory: {
            role: role,
            job: roles[role].job,
            lvl: lvl,
            room: room,
            roaming: roles[role].roaming
        }};
        if(memory !== null){
            _.each(memory,function(entry,key){
                mem.memory[key] = entry;
            });
        }
        _.each(roles[role].memory,function(entry,key){
            mem.memory[key] = entry;
        });
        let spawnResult = theSpawn.spawnCreep(roles[role].body[lvl],role+'('+room+')'+Game.time,mem);
        if(spawnResult === ERR_NOT_ENOUGH_ENERGY && roles[role].fallback){
            mem.memory.lvl = 1;
            return theSpawn.spawnCreep(roles[role].body[1],role+'('+room+')'+Game.time,mem);
        }
    }
    
};