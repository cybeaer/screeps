'use strict';

global.MINING_FLAG = 1;
global.BUILDING_FLAG = 0;

module.exports = {
    claimer(creep){
        if(creep.room.name === creep.memory.room){
            let blockingWall = null;
            if(Game.flags['destroy_wall']) {
                blockingWall = Game.flags['destroy_wall'].pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: {structureType: STRUCTURE_WALL}
                });
            }
            if(blockingWall){
                if(creep.attack(blockingWall) === ERR_NOT_IN_RANGE){
                    creep.moveTo(blockingWall);
                }
            }else{
                if(creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.controller);
                }else{
                    manualSpawn(creep.memory.origSpawn,'builder',1,creep.memory.room);
                    creep.memory.role =  'builder';
                    creep.memory.job =  'worker';
                    creep.memory.roaming =  false;
                }
            }
        }else{
            const target = new RoomPosition(25,25,creep.memory.room);
            const path = creep.pos.findPathTo(target);
            if(path){
                creep.move(path[0].direction);
            }
        }
    },
    harvest(creep,idx,type=RESOURCE_ENERGY){
        let sources;
        if(type===RESOURCE_ENERGY) {
            let targetFlag = (idx === MINING_FLAG) ? '_mining' : '_building';
            sources = Game.flags[creep.room.name + targetFlag].pos.findClosestByRange(FIND_SOURCES)
        }else{
            sources = creep.room.find(FIND_MINERALS);
            sources = sources[0];
            creep.memory.type = sources.mineralType;
        }
        if(sources){
            if(creep.harvest(sources) === ERR_NOT_IN_RANGE){
                creep.say('⚡');
                creep.moveTo(sources,{reusePath: 20, visualizePathStyle: roles[creep.getRole()].path});
            }
        }else{
            this.nothingTodo(creep);
        }
    },
    loadStatus(creep){
        if(_.sum(creep.carry) === 0){
            creep.memory.loaded = false;
        }
        if(!creep.memory.loaded && _.sum(creep.carry) === creep.carryCapacity){
            creep.memory.loaded = true;
        }
    },
    mining(creep, type=RESOURCE_ENERGY){
        this.loadStatus(creep);
        if(!creep.memory.loaded){ // load up
            this.harvest(creep,MINING_FLAG,type);
        }else{
            let options = {
                nearToCreep: true,
                storeRelated: true,
                type: type,
                debug: true
            };
            let stores = creep.room.getStructures([STRUCTURE_CONTAINER],creep,options);
            if(type === RESOURCE_ENERGY) {
                if (!stores) {
                    stores = creep.room.getStructures([STRUCTURE_EXTENSION], creep, options);
                }
                if (!stores) {
                    stores = creep.room.getStructures([STRUCTURE_SPAWN], creep, options);
                }
            }
            if(!stores){
                stores = creep.room.getStructures([STRUCTURE_STORAGE],creep,options);
            }
            if(stores){
                if(creep.transfer(stores,creep.getType()) === ERR_NOT_IN_RANGE){
                    creep.say('🏃');
                    creep.moveTo(stores,{reusePath: roles[creep.getRole()].reuse, visualizePathStyle: roles[creep.getRole()].path});
                }
            }else{
                this.nothingTodo(creep);
            }
        }
    },
    upgrading(creep){
        this.loadStatus(creep);
        if(!creep.memory.loaded) { // load up
            this.harvest(creep,BUILDING_FLAG,RESOURCE_ENERGY);
        }else {
            if (creep.room.controller) {
                if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.say('🌀 '+creep.room.controller.pos.x+'/'+creep.room.controller.pos.y);
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    },
    building(creep){
        this.loadStatus(creep);
        if(!creep.memory.loaded) { // load up
            this.harvest(creep,BUILDING_FLAG,RESOURCE_ENERGY);
            creep.memory.buildingId = 0;
        }else {
            let target = creep.room.getConstructionSites(creep,true);
            if(target){
                if(creep.build(target)===ERR_NOT_IN_RANGE){
                    creep.say('🚧'+target.pos.x+'/'+target.pos.y);
                    creep.moveTo(target,{reusePath: roles[creep.getRole()].reuse, visualizePathStyle: roles[creep.getRole()].path});
                }
            }else {
                let theRoom = creep.room
                if(creep.memory.buildingId === 0 || creep.memory.buildingId === undefined){
                    let target = theRoom.getRepair(STRUCT_HP_CRITICAL);
                    if(!target[0]){
                        target = theRoom.getRepair(STRUCT_HP_MAINTAINANCE);
                    }
                    if(target[0])
                        creep.memory.buildingId = target[0].id;
                    else
                        creep.memory.buildingId = 0;
                }
                if(creep.memory.buildingId !== 0){
                    target = Game.getObjectById(creep.memory.buildingId);
                
                    if(target.hits === target.hitsMax){
                        target = null;
                        creep.memory.buildingId = 0;
                    }
                }
                if(target){
                    if(creep.repair(target)===ERR_NOT_IN_RANGE){
                        creep.say('🔨 '+target.pos.x+'/'+target.pos.y);
                        creep.moveTo(target,{reusePath: roles[creep.getRole()].reuse, visualizePathStyle: roles[creep.getRole()].path});
                    }else{
                        creep.memory.buildingId = target.id;
                    }
                }else{
                    this.nothingTodo(creep);
                }
            }
        }
    },
    worker(creep){
        switch(creep.getRole()){
            case ROLE_HARVESTER:
                this.mining(creep);
                break;
            case ROLE_MINER:
                this.mining(creep, RESOURCE_MINERAL);
                break;
            case ROLE_UPGRADER:
                this.upgrading(creep);
                break;
            case ROLE_BUILDER:
                this.building(creep);
                break;
            default:
                creep.say('*'+creep.getRole()+'*');
                break;
        }
    },
    dispatch(creep,from,to){
        let options = {
            nearToCreep: true,
            storeRelated: true,
            type: creep.getType(),
            inverted: true,
            min: 200
        };
        if(!creep.memory.loaded) { // load up
            if(from) {
                if (creep.withdraw(from, creep.getType()) === ERR_NOT_IN_RANGE) {
                    creep.say('⚡');
                    creep.moveTo(from, {reusePath: roles[creep.getRole()].reuse, visualizePathStyle: roles[creep.getRole()].path});
                }
            }else{
                this.nothingTodo(creep);
            }
        }else{
            if(to) {
                //if(!(from.structureType === to.structureType)) {
                    options.inverted = false;
                    if (creep.transfer(to, creep.getType()) === ERR_NOT_IN_RANGE) {
                        creep.say('🏃');
                        creep.moveTo(to, {reusePath: roles[creep.getRole()].reuse, visualizePathStyle: roles[creep.getRole()].path});
                    }
                //}
            }else{
                this.nothingTodo(creep);
            }
        }
    },
    collect(creep,from,to){
        this.loadStatus(creep);
        if(!creep.memory.loaded) { // load up
            if (creep.pickup(from) === ERR_NOT_IN_RANGE) {
                creep.moveTo(from, {reusePath: roles[creep.getRole()].reuse, visualizePathStyle: roles[creep.getRole()].path});
            }
        }else{
            _.forEach(creep.carry, (resource,type) => {
                if (creep.transfer(to, type) === ERR_NOT_IN_RANGE) {
                    creep.say('🏃');
                    creep.moveTo(to, {reusePath: roles[creep.getRole()].reuse, visualizePathStyle: roles[creep.getRole()].path});
                }
            });
        }
    },
    transporter(creep){
        let options = {
            nearToCreep: true,
            storeRelated: true,
            type: creep.getType(),
            inverted: true,
            min: 200
        };
        let from = null;
        let to = null;
        switch(creep.getRole()){
            case ROLE_DISPATCHER:
                this.loadStatus(creep);
                from = creep.room.getStructures([STRUCTURE_CONTAINER],creep,options);
                if(!from){
                    from = creep.room.getStructures([STRUCTURE_STORAGE],creep,options);
                }
                options.inverted = false;
                to = creep.room.getStructures([STRUCTURE_SPAWN,STRUCTURE_EXTENSION],creep,options);
                if(!to){
                    to = creep.room.getStructures([STRUCTURE_STORAGE],creep,options);    
                }
                if(from !==  to) {
                    this.dispatch(creep, from, to);
                }
                break;
            case ROLE_RECHARGER:
                this.loadStatus(creep);
                from = creep.room.getStructures([STRUCTURE_CONTAINER],creep,options);
                if(!from){
                    from = creep.room.getStructures([STRUCTURE_STORAGE],creep,options);    
                }
                options.inverted = false;
                to = creep.room.getStructures([STRUCTURE_TOWER],creep,options);
                if(from !== to) {
                    this.dispatch(creep, from, to);
                }
                break;
            case ROLE_GRAVEDIGGER:
                this.loadStatus(creep);
                let sources = creep.room.find(FIND_DROPPED_RESOURCES);
                if(!sources)
                    sources = creep.room.find(FIND_DROPPED_ENERGY);
                if(!sources)
                    sources = creep.room.find(FIND_TOMBSTONES);
                if(sources)
                    from = sources[0];
                options.inverted = false;
                to = creep.room.getStructures([STRUCTURE_STORAGE],creep,options);
                if(from && to) {
                    this.collect(creep, from, to);
                }
                break;
            case ROLE_MINECART:
                this.loadStatus(creep);
                if(!creep.getType()) {
                    let sources = creep.room.find(FIND_MINERALS);
                    creep.memory.type = sources[0].mineralType;
                    options.type = creep.getType();
                }
                options.min = 0;
                from = creep.room.getStructures([STRUCTURE_CONTAINER],creep,options);
                if(!from){
                    from = creep.room.getStructures([STRUCTURE_STORAGE],creep,options);
                }
                options.inverted = false;
                to = creep.room.getStructures([STRUCTURE_TERMINAL],creep,options);
                if(!to){
                    to = creep.room.getStructures([STRUCTURE_STORAGE],creep,options);
                }
                if(from && to) {
                    this.dispatch(creep, from, to);
                }
                break;
            default:
                creep.say('*'+creep.getRole()+'*');
                break;
        }
    },
    guarding(creep){
        let closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile){
            if(creep.hits < creep.hitsMax/2){
                creep.heal(creep);
            }
            if(creep.attack(closestHostile) === ERR_NOT_IN_RANGE ){
                //rangedAttack
                creep.moveTo(closestHostile);
            }
        }else{
            if(creep.hits < creep.hitsMax){
                creep.heal(creep);
            }else{
                let damagedCreeps = creep.room.find(FIND_MY_CREEPS, {
                    filter: (c) => c.hits < c.hitsMax
                });
                if (damagedCreeps.length > 0){
                    if(creep.heal(damagedCreeps[0]) === ERR_NOT_IN_RANGE){
                        creep.moveTo(damagedCreeps[0]);
                    }
                }
            }
        }
    },
    security(creep){
        switch(creep.getRole()){
            case ROLE_GUARD:
                this.guarding(creep);
                break;
            default:
                creep.say('*'+creep.getRole()+'*');
                break;
        }
    },
    nothingTodo(creep){
        creep.say('💤');
    }
};