'use strict';

require('overload.global');
require('overload.room');
require('overload.creep');

let population = require('handle.population');
let infrastructure = require('handle.infrastructure');

module.exports.loop = function () {
    
    _.each(Game.rooms,function(room){
        population.checkPopulation(room.name);
        population.work(room.name);
        infrastructure.spawnMessage(room.name);
    });
    population.checkMilitary();
    population.military();
}