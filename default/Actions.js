class Action{

    get name(){
        return 'Action';
    }

    isCompleted(creepWrapper){
        return false;
    }

    nextTarget(creepWrapper){
        return null;
    }

    isValidForCreep(creepWrapper){
        return true;
    }

    perform(creepWrapper, target){

    }
}

class IdleAction extends Action{
    get isCompleted(){
        return true;
    }
}

class HarvestAction extends Action{
    get name(){
        return 'HarvestAction';
    }

    isCompleted(creepWrapper){
        return creepWrapper.creep.store.getFreeCapacity() == 0;
    }

    nextTarget(creepWrapper){
        let sources = creepWrapper.creep.room.find(FIND_SOURCES);
        //ToDo: Implement NodeDispatcher
        return sources[1];
    }

    isValidForCreep(creepWrapper){
        return creepWrapper.creep.body.find(part => part.type == WORK) &&
            creepWrapper.creep.body.find(part => part.type == CARRY);
    }

    perform(creepWrapper, target){
        if(creepWrapper.creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creepWrapper.creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
}

class StoreEnergyAction extends Action{
    get name(){
        return 'SupplySpawnAction';
    }

    isCompleted(creepWrapper){
        return creepWrapper.creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0;
    }

    nextTarget(creepWrapper){
        let targets = creepWrapper.creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER);
            }
        });

        let notFullEnergyTarget = _.find(targets, function(x){ return x.store.getFreeCapacity(RESOURCE_ENERGY) > 0});

        if(targets.length > 0) {
            if(notFullEnergyTarget){
                return notFullEnergyTarget;
            }
            return new targets[0];
        }
        return null;
    }

    isValidForCreep(creepWrapper){
        return creepWrapper.creep.body.find(part => part.type == CARRY) &&
            creepWrapper.creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
    }

    perform(creepWrapper, target){
        if(creepWrapper.creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creepWrapper.creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
}

module.exports = {
    Action,
    IdleAction,
    HarvestAction,
    StoreEnergyAction
}