class State{
    canContinue(creep){
        return true;
    }
    
    get ongoing(){
        return false;
    }
    /** @Param {CreepWrapper} creepWrapper*/
    operation(creepWrapper){
        return new State();
    }
}

class InitialState extends State{
    operation(creepWrapper){
        if(creepWrapper.isBusy || creepWrapper.creep.carry.energy == creepWrapper.creep.carryCapacity){
            creepWrapper.isBusy = false;
            return new SearchForDeliveryTargetState;
        }
        creepWrapper.isBusy = false;
        return new SearchForHarvestNodeState();
    }
}

class IdleState extends State{
    constructor(){
        super();
        this._ongoing = false;
    }

    get ongoing(){
        return this._ongoing;
    }

    operation(creepWrapper){
        creepWrapper.isBusy = false;
        this._ongoing = true;
        let targets = creepWrapper.creep.room.find(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_SPAWN); }});
        if(!targets){ return this; }
        creepWrapper.creep.moveTo(targets[0]);
        return this;
    }
}

class SearchForHarvestNodeState extends State{
    operation(creepWrapper){
        let sources = creepWrapper.creep.room.find(FIND_SOURCES);
        //ToDo: Implement NodeDispatcher
        if(creepWrapper.role == 'harvester'){
            return new HarvestingNodeState(sources[1]);
        }
        return new HarvestingNodeState(sources[0]);
    }
}

class HarvestingNodeState extends State{
    constructor(targetNode){
        super();
        this._targetNode = targetNode;
        this._ongoing = false;
    }

    get ongoing(){
        return this._ongoing;
    }
    
    operation(creepWrapper){
        if(creepWrapper.creep.carry.energy == creepWrapper.creep.carryCapacity){
            return new SearchForDeliveryTargetState;
        }
        if(creepWrapper.creep.harvest(this._targetNode) == ERR_NOT_IN_RANGE) {
            creepWrapper.creep.moveTo(this._targetNode, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        this._ongoing = true;
        return this;
    }
}

class SearchForDeliveryTargetState extends State{
    constructor(){
        super();
        this._ongoing = false;
    }
    get ongoing(){
        return this._ongoing;
    }

    operation(creepWrapper) {
        let newState;
        switch (creepWrapper.role) {
            case 'harvester':
                newState = this.getEnergyTransferTarget(creepWrapper);
                break;
            case 'upgrader':
                newState = this.getUpgradeTarget(creepWrapper);
                break;
            case 'builder':
                newState = this.getBuildTarget(creepWrapper);
                break;
        }

        this._ongoing = (newState == this);
        return newState;
    }

    getEnergyTransferTarget(creepWrapper){
        let targets = creepWrapper.creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER);
            }
        });

        let notFullEnergyTargets = _.find(targets, function(x){ return x.energy < x.energyCapacity});
        
        if(targets.length > 0) {
            if(notFullEnergyTargets){
                return new TransferEnergyState(notFullEnergyTargets);
            }
            if(creepWrapper.creep.carry.energy < creepWrapper.creep.carryCapacity){
                return new IdleState();
            }
            return new TransferEnergyState(targets[0]);
        }
        return this;
    }

    getUpgradeTarget(creepWrapper){
        return new UpgradeState(creepWrapper.creep.room.controller);
    }

    getBuildTarget(creepWrapper){
        let targets = creepWrapper.creep.room.find(FIND_CONSTRUCTION_SITES);
        if(targets.length) {
            return new BuildState(targets[0]);
        }
        targets = creepWrapper.creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => { return structure.hits < structure.hitsMax }});
        if(targets.length) {
            return new RepairState(targets[0]);
        }
        return new IdleState();
    }
}

class DeliveryState extends State{
    constructor(target){
        super();
        this._deliveryTarget = target;
        this._ongoing = false;
    }

    get ongoing(){
        return this._ongoing;
    }

    operation(creepWrapper) {
        this._ongoing = true;
        return this;
    }
}

class TransferEnergyState extends DeliveryState{

    operation(creepWrapper){
        if(creepWrapper.creep.carry.energy == 0){
            creepWrapper.isBusy = false;
            return new InitialState();
        }
        if(creepWrapper.creep.transfer(this._deliveryTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creepWrapper.creep.moveTo(this._deliveryTarget, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        creepWrapper.isBusy = true;
        this._ongoing = true;
        return this;
    }
}

class UpgradeState extends DeliveryState{
    operation(creepWrapper){
        if(creepWrapper.creep.carry.energy == 0){
            creepWrapper.isBusy = false;
            return new InitialState();
        }
        if(creepWrapper.creep.upgradeController(this._deliveryTarget) == ERR_NOT_IN_RANGE) {
            creepWrapper.creep.moveTo(this._deliveryTarget, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        creepWrapper.isBusy = true;
        this._ongoing = true;
        return this;
    }
}

class BuildState extends DeliveryState{

    operation(creepWrapper){
        if(creepWrapper.creep.carry.energy == 0){
            creepWrapper.isBusy = false;
            return new InitialState();
        }
        if(creepWrapper.creep.build(this._deliveryTarget) == ERR_NOT_IN_RANGE) {
            creepWrapper.creep.moveTo(this._deliveryTarget, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        creepWrapper.isBusy = true;
        this._ongoing = true;
        return this;
    }
}

class RepairState extends DeliveryState{

    operation(creepWrapper){
        if(creepWrapper.creep.carry.energy == 0){
            creepWrapper.isBusy = false;
            return new InitialState();
        }
        if(creepWrapper.creep.repair(this._deliveryTarget) == ERR_NOT_IN_RANGE) {
            creepWrapper.creep.moveTo(this._deliveryTarget, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        creepWrapper.isBusy = true;
        this._ongoing = true;
        return this;
    }
}

module.exports = {
    State,
    InitialState,
    IdleState, 
    SearchForHarvestNodeState, 
    HarvestingNodeState,
    DeliveryState,
    TransferEnergyState,
    UpgradeState,
    BuildState,
    RepairState
}