let Wrappers = require('Wrapper');

module.exports.loop = function () {
    let spawn = Game.spawns["Spawn1"];
    
    doTowerStuff();
	clearUnusedMemory();
    spawnCreeps(spawn);
    doCreepStuff();
}

function doTowerStuff(){
    let tower = Game.getObjectById('5d376b784ddb537d0a6b8d81');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
}

function clearUnusedMemory(){
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
}

function spawnCreeps(spawn){
    let harvester;
    harvester = _.filter(Game.creeps, (creep) => _.find(creep.memory.roles, (r) => r == 'h'));
    let builder = _.filter(Game.creeps, (creep) => _.find(creep.memory.roles, (r) => r == 'b'));
    let upgrader = _.filter(Game.creeps, (creep) => _.find(creep.memory.roles, (r) => r == 'u'));

    if(!spawn.spawning){
        if(harvester.length < 6){
            spawn.spawnCreep([WORK, WORK, MOVE, CARRY], 'h' + Game.time, {memory: {roles: ['h']}});
        }else if(harvester.length > 0 && builder.length < 4 && !spawn.spawning){
            spawn.spawnCreep([WORK, WORK, MOVE, MOVE, CARRY, CARRY], 'b' + Game.time, {memory: {roles: ['b']}});
        }else if(harvester.length > 0 && upgrader.length < 6 && !spawn.spawning){
            spawn.spawnCreep([WORK, WORK, MOVE, MOVE, CARRY, CARRY], 'u' + Game.time, {memory: {roles: ['u']}});
        }
    }
}

function doCreepStuff(){
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        let wrapper = new Wrappers.CreepWrapper(creep);

        try {
            for(let role in wrapper.roles){
                let nextAction = role.getNextAction(wrapper);
                if(nextAction && role.canProceed(wrapper, nextAction)){
                    wrapper.action = nextAction;
                    role.run(wrapper);
                    break;
                }
            }
        }catch (e) {
            console.log('ERR in Creeploop!');
            console.log(e.stack);
            continue;
        }
    }
}