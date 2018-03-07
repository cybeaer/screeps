'use strict';

global.HEARTBEAT_LOW     = 'hb_low';
global.HEARTBEAT_HIGH    = 'hb_high';

global.ROLE_MINER       = 'miner';          // mining rare minterals
global.ROLE_HARVESTER   = 'harvester';          // mining rare minterals
global.ROLE_BUILDER     = 'builder';        // builds and repairs things (build first!)
global.ROLE_UPGRADER    = 'upgrader';       // mines and upgrades rcl
global.ROLE_DISPATCHER  = 'dispatcher';
global.ROLE_RECHARGER   = 'recharger';
global.ROLE_GUARD       = 'guard';
global.ROLE_CLAIMER     = 'claimer';

global.soldiers = {
    //TODO
}

global.roles = {
    harvester: {
        body: [
            [WORK,MOVE],
            [WORK,WORK,CARRY,MOVE],
            [WORK,WORK,WORK,WORK,CARRY,MOVE],
            [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
            [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
            [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
            [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
            [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
            [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE]
        ],
        job: 'worker',
        role: ROLE_HARVESTER,
        fallback: true,
        memory: {
            type: RESOURCE_ENERGY
        },
        reuse: 20,
        path: {
            stroke: '#ffd557',
            lineStyle: 'dashed',
            opacity: 0.2
        }
    },
    miner: {
        body: [
            [],
            [WORK,WORK,CARRY,MOVE],
            [WORK,WORK,WORK,WORK,CARRY,MOVE],
            [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
            [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
            [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
            [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
            [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
            [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE]
        ],
        job: 'worker',
        role: ROLE_MINER,
        fallback: true,
        memory: {
            type: RESOURCE_ENERGY
        },
        reuse: 20,
        path: {
            stroke: '#ffd557',
            lineStyle: 'dashed',
            opacity: 0.2
        }
    },
    upgrader: {
        body: [
            [],
            [WORK,CARRY,CARRY,MOVE,MOVE],
            [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
            [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
            [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
            [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
            [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
            [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
            [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]
        ],
        job: 'worker',
        role: ROLE_UPGRADER,
        fallback: true,
        memory: {
        },
        reuse: 20,
        path: {
            stroke: '#ffd557',
            lineStyle: 'dashed',
            opacity: 0.2
        }
    },
    builder: {
        body: [
            [],
            [WORK,CARRY,CARRY,MOVE,MOVE],
            [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
            [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
            [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
            [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
            [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
            [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
            [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]
        ],
        job: 'worker',
        role: ROLE_BUILDER,
        fallback: false,
        memory: {
        },
        reuse: 20,
        path: {
            stroke: '#ffd557',
            lineStyle: 'dashed',
            opacity: 0.2
        }
    },
    dispatcher: {
        body: [
            [],
            [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],
            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
        ],
        job: 'transporter',
        role: ROLE_DISPATCHER,
        fallback: true,
        memory: {
            type: RESOURCE_ENERGY
        },
        reuse: 20,
        path: {
            stroke: '#ffd557',
            lineStyle: 'dashed',
            opacity: 0.2
        }
    },
    recharger: {
        body: [
            [],
            [CARRY,MOVE],
            [CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
        ],
        job: 'transporter',
        role: ROLE_RECHARGER,
        fallback: false,
        memory: {
            type: RESOURCE_ENERGY
        },
        reuse: 20,
        path: {
            stroke: '#ffd557',
            lineStyle: 'dashed',
            opacity: 0.2
        }
    },
    guard: {
        body: [
            [],
            [TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,MOVE,MOVE],
            [TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,MOVE,HEAL,MOVE],
            [
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,
                ATTACK,ATTACK,ATTACK,
                MOVE,MOVE,MOVE,HEAL,MOVE
            ],
            [
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,
                ATTACK,ATTACK,ATTACK,
                MOVE,MOVE,MOVE,HEAL,MOVE
            ],
            [
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,
                ATTACK,ATTACK,ATTACK,
                MOVE,MOVE,MOVE,HEAL,MOVE
            ],
            [
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                ATTACK,ATTACK,ATTACK,
                MOVE,MOVE,MOVE,MOVE,MOVE,
                MOVE,MOVE,MOVE,MOVE,MOVE,
                MOVE,MOVE,MOVE,MOVE,MOVE,
                HEAL,MOVE
            ],
            [
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                ATTACK,ATTACK,ATTACK,
                MOVE,MOVE,MOVE,MOVE,MOVE,
                MOVE,MOVE,MOVE,MOVE,MOVE,
                MOVE,MOVE,MOVE,MOVE,MOVE,
                HEAL,MOVE
            ],
            []
        ],
        job: 'security',
        role: ROLE_GUARD,
        fallback: false,
        memory: {
        },
        reuse: 15,
        path: {
            stroke: '#ffd557',
            lineStyle: 'dashed',
            opacity: 0.2
        }
    }
};

(function(){
    for(let role in roles){
        for(let part in roles[role].body){
            roles[role].costs += BODYPART_COST[part];
        }
    }
    for(let role in soldiers){
        for(let part in soldiers[role].body){
            soldiers[role].costs += BODYPART_COST[part];
        }
    }
}());

global.requirements = [
    {},
    { harvester: 1, upgrader: 1, builder: 2, guard: 1},  // Room Lvl 1
    { harvester: 1, dispatcher: 1, upgrader: 1, builder: 2, guard: 1, recharger: 1 },  // Room Lvl 2
    { harvester: 1, dispatcher: 1, upgrader: 1, builder: 2, guard: 1, recharger: 1 },  // Room Lvl 3
    { harvester: 1, dispatcher: 1, upgrader: 2, builder: 2, guard: 2, recharger: 1 },  // Room Lvl 4
    { harvester: 1, dispatcher: 1, upgrader: 2, builder: 2, guard: 2, recharger: 1 },  // Room Lvl 5
    { harvester: 1, dispatcher: 1, upgrader: 2, builder: 2, guard: 3, recharger: 1 },  // Room Lvl 6
    { harvester: 1, dispatcher: 1, upgrader: 2, builder: 2, guard: 3, recharger: 1 },  // Room Lvl 7
    { harvester: 1, dispatcher: 1, upgrader: 2, builder: 2, guard: 3, recharger: 1 },  // Room Lvl 8
];