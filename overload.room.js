'use strict';

global.STRUCT_HP_CRITICAL = 'struct_hp_crit';
global.STRUCT_HP_MAINTAINANCE = 'struct_hp_maintain';

Room.prototype.getLevel = function getLevel() {
	if (this.energyCapacityAvailable === 0)
		return 0;
	else if (this.energyCapacityAvailable < 550)      // lvl 1, 300 energy
		return 1;
	else if (this.energyCapacityAvailable < 800)      // lvl 2, 550 energy
		return 2;
	else if (this.energyCapacityAvailable < 1300)     // lvl 3, 800 energy
		return 3;
	else if (this.energyCapacityAvailable < 1800)     // lvl 4, 1300 energy
		return 4;
	else if (this.energyCapacityAvailable < 2300)     // lvl 5, 1800 energy
		return 5;
	else if (this.energyCapacityAvailable < 5600)     // lvl 6, 2300 energy
		return 6;
	else if (this.energyCapacityAvailable < 12900)    // lvl 7, 5600 energy
		return 7;
	else											  // lvl 8, 12900 energy
		return 8;
};

Room.prototype.getLowEnergy = function getLowEnergy(){
	let returnValue = 0;
	switch(this.getLevel()){
		case 1:
            returnValue = 300;
            break;
        case 2:
            returnValue = 550;
            break;
        case 3:
            returnValue = 500;
            break;
        case 4:
            returnValue = 800;
            break;
        case 5:
        case 6:
        case 7:
        case 8:
            returnValue = 1000;
            break;
	}
    return returnValue;
};

Room.prototype.getLevelByAvailableEnergy = function getLevel() {
	if (this.energyAvailable < 550)
		return 1;
	else if (this.energyAvailable < 800)
		return 2;
	else if (this.energyAvailable < 1300)
		return 3;
	else if (this.energyAvailable < 1800)
		return 4;
	else if (this.energyAvailable < 2300)
		return 5;
	else if (this.energyAvailable < 5600)
		return 6;
	else if (this.energyAvailable < 12900)
		return 7;
	else
		return 8;
};

Room.prototype.getWallTargetHealth = function getWallTarget() {
	let level = this.getLevel();		
	let t = [
		0,
		10000,
		25000,
		50000,
		100000,
		500000,
		1000000,
		2500000,
		5000000 
	];
	return t[level];
};
	
Room.prototype.getRepair = function getRepair(type, creep=null) {
    if(type === STRUCT_HP_CRITICAL){
        if(creep){
            return creep.pos.findClosestByRange(FIND_STRUCTURES, {
    			filter: (s) => {
    				return this.filterCritical(s);
    			}});
        }else{
    		return this.find(FIND_STRUCTURES, {
    			filter: (s) => {
    				return this.filterCritical(s);
    			}}).sort((a, b) => {return a.hits - b.hits;});
        }
    }else if (type === STRUCT_HP_MAINTAINANCE){
        if(creep){
            return creep.pos.findClosestByRange(FIND_STRUCTURES, {
    			filter: (s) => {
    				return this.filterMaintain(s);
    			}});
        }else{
    		return this.find(FIND_STRUCTURES, {
    			filter: (s) => {
    				return this.filterMaintain(s);
    			}}).sort((a, b) => {return a.hits - b.hits;});
        }
    } else {
        return null;
    }
};

Room.prototype.filterCritical = function filterCritical(s){
    return (s.structureType === STRUCTURE_RAMPART && s.hits < this.getWallTargetHealth() * 0.1)
		|| (s.structureType === STRUCTURE_WALL && s.hits < this.getWallTargetHealth() * 0.1)
		|| (s.structureType === STRUCTURE_CONTAINER && s.hits < s.hitsMax * 0.1)
		|| (s.structureType === STRUCTURE_ROAD && s.hits < s.hitsMax * 0.1);
};

Room.prototype.filterMaintain = function filterMaintain(s){
    return (s.structureType === STRUCTURE_RAMPART && s.hits < this.getWallTargetHealth())
		|| (s.structureType === STRUCTURE_WALL && s.hits < this.getWallTargetHealth())
		|| (s.structureType === STRUCTURE_CONTAINER && s.hits < s.hitsMax * 0.8)
		|| (s.structureType === STRUCTURE_ROAD && s.hits < s.hitsMax * 0.8)
		|| ((s.structureType === STRUCTURE_SPAWN ||
			s.structureType === STRUCTURE_EXTENSION ||
			s.structureType === STRUCTURE_LINK ||
			s.structureType === STRUCTURE_STORAGE||
			s.structureType === STRUCTURE_TOWER ||
			s.structureType === STRUCTURE_OBSERVER ||
			s.structureType === STRUCTURE_EXTRACTOR ||
			s.structureType === STRUCTURE_LAB ||
			s.structureType === STRUCTURE_TERMINAL ||
			s.structureType === STRUCTURE_NUKER ||
			s.structureType === STRUCTURE_POWER_SPAWN ) && s.hits < s.hitsMax);
};

Room.prototype.getSources = function getSources(type, notEmpty=true){
    if(type !== RESOURCE_ENERGY){
        return this.find(FIND_MINERALS, {
            filter: (s) => {
                return (notEmpty) ? s.mineralAmount > 0 : true; 
            }
        });
    }else{
        return this.find(FIND_SOURCES, {
            filter: (s) => {
                return (notEmpty) ? s.energy > 0 : true; 
            }
        });
    }
    return sources;
};

Room.prototype.getStructures = function getStructures(objects,creep,options){
    /*
	Options:
		nearToCreep=false,
		storeRelated=false,
		type=RESOURCE_ENERGY,
		inverted=false)
	*/
	options.nearToCreep = (options.nearToCreep) ? options.nearToCreep : false;
    options.storeRelated = (options.storeRelated) ? options.storeRelated : false;
    options.type = (options.type) ? options.type : RESOURCE_ENERGY;
    options.inverted = (options.inverted) ? options.inverted : false;
    let stores = null;
    if(options.nearToCreep){
        stores = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return this.filterStructures(options,objects,structure);
            }
        });
        if(!stores){
            stores = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return this.filterStructures(options,objects,structure);
                }
            });
        }
    }else{
        stores = creep.room.find(FIND_STRUCTURES,{
            filter: (structure) => {
                return this.filterStructures(options,objects,structure);
            }
        });
        if(!stores){
            stores = creep.room.find(FIND_MY_STRUCTURES,{
                filter: (structure) => {
                    return this.filterStructures(options,objects,structure);
                }
            });
        }
    }
    return stores;
};

Room.prototype.getConstructionSites = function getConstructionSites(creep,nearToCreep=false){
    let css = null;
    if(nearToCreep){
        css = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    }else{
        css = creep.room.find(FIND_CONSTRUCTION_SITES);
    }
    return css;
};

Room.prototype.findFirstSpawn = function findFirstSpawn(){
  return this.find(FIND_MY_SPAWNS)[0];
};

Room.prototype.filterStructures = function filterStructures(options,objects,structure){
    /*
    Options:
        nearToCreep=false,
        storeRelated=false,
        type=RESOURCE_ENERGY,
        inverted=false)
    */
    let typeOk = (objects.indexOf(structure.structureType) > -1);
    let loadOk = true;
    if(options.storeRelated) {
        let structType = (
            (structure.structureType === STRUCTURE_CONTAINER) ||
            (structure.structureType === STRUCTURE_STORAGE) ||
            (structure.structureType === STRUCTURE_TERMINAL)
        );
    	if(!options.inverted) {
            loadOk = (structType) ? _.sum(structure.store) < structure.storeCapacity :  structure.energy < structure.energyCapacity;
        }else{
			loadOk = (structType) ? _.sum(structure.store) > 0 : structure.energy > 0;
		}
    }
    return typeOk && loadOk;
}