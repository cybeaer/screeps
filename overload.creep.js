'use strict';

Creep.prototype.updateDamage = function updateDamage(useSafemode=false){
        if(this.hits < this.memory.lastHits) {
            if(useSafemode){
                if (this.room.controller.safeModeAvailable > 0) {
                    Game.notify('Creep '+this+' has been attacked at '+this.pos+'! I enable safemode!', 60);
                    //this.room.controller.activateSafeMode();
                }else{
                    Game.notify('Creep '+this+' has been attacked at '+this.pos+'! We got no safemode left!', 60);
                }
            }
        }
        this.memory.lastHits = this.hits;
};

Creep.prototype.updateHeartBeat = function updateHeartBeat(){
    if(this.ticksToLive < 300){
        this.setHeartbeat(HEARTBEAT_LOW);
    }
    if(this.ticksToLive > 1400){
        this.setHeartbeat(HEARTBEAT_HIGH);
    }
};

Creep.prototype.setHeartbeat = function setHeartbeat(beat){
    if(beat !== HEARTBEAT_LOW && beat !== HEARTBEAT_HIGH){
        return 'The heartbeat "'+beat+'" is not defined!';
    }
    this.memory.heartbeat = beat;
    if(beat === HEARTBEAT_LOW){
        return 'set heartbeat to low';
    }else{
        return 'set heartbeat to high';
    }
};

Creep.prototype.getHeartbeat = function getHeartbeat(){
    return this.memory.heartbeat;
};

Creep.prototype.isSubtype = function isSubType(subtype){
    return (this.memory.subtype === subtype)
};

Creep.prototype.getType = function getType(){
    return this.memory.type;
};

Creep.prototype.getJob = function getJob(){
    return this.memory.job;
};

Creep.prototype.getRole = function getRole(){
    return this.memory.role;
};

Creep.prototype.isRoamer = function isRoamer(){
    return this.memory.roaming;
};

Creep.prototype.isArmy = function isArmy(){
    if(this.memory.army===undefined){
        return false;
    }else{
        return this.memory.army;
    }
};

Creep.prototype.isRole = function isRole(role){
    return this.memory.role === role;
};

Creep.prototype.isInRoom = function isInRoom(room){
    return this.room.name === room;
};

Creep.prototype.isLvl = function isLvl(lvl){
    return this.memory.lvl === lvl;
};

Creep.prototype.lvl = function lvl(){
    return this.memory.lvl;
};

Creep.prototype.getAge = function getAge(){
    if(this.memory.age === undefined){
        this.memory.age = 1;
        return 1;
    }else{
        return this.memory.age;
    }
};