let Wrappers = require('class.Wrapper');

module.exports.loop = function () {
    let spawn = Game.spawns["Spawn1"];
    
    var tower = Game.getObjectById('5d376b784ddb537d0a6b8d81');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
	
	for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    let harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    let builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    let upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
	
	if(!spawn.spawning){
        if(harvester.length < 6){
            spawn.spawnCreep([WORK, WORK, MOVE, CARRY], 'h' + Game.time, {memory: {role: 'harvester'}});
        }else if(harvester.length > 0 && builder.length < 4 && !spawn.spawning){
            spawn.spawnCreep([WORK, WORK, MOVE, MOVE, CARRY, CARRY], 'b' + Game.time, {memory: {role: 'builder'}});
        }else if(harvester.length > 0 && upgrader.length < 6 && !spawn.spawning){
            spawn.spawnCreep([WORK, WORK, MOVE, MOVE, CARRY, CARRY], 'u' + Game.time, {memory: {role: 'upgrader'}});
        }   
	}
	
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        let wrapper = new Wrappers.CreepWrapper(creep);
        
        try {
            while(!wrapper.state.ongoing){
                wrapper.state = wrapper.state.operation(wrapper);
            }
        }catch (e) {
            console.log('ERR in Stateloop!');
            console.log(e.stack);
            continue;
        }
        // }
    }
}