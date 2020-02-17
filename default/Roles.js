let Actions = require('Actions');

class Role{

    get name(){
        return 'Role';
    }

    static createRole(string){
        //ToDo: Implement logic which role to take
        return new HarvesterRole();
    }

    get actions(){
        return [];
    }

    canProceed(creepWrapper, action){
        return action.isValidForCreep(creepWrapper);
    }

    getNextAction(creepWrapper){
        let currentAction = _.find(this.actions, (action) => action.name == creepWrapper.creep.memory.action);
        if(currentAction && !currentAction.isCompleted(creepWrapper)){
            return currentAction;
        }

        if(currentAction){
            let idx = _.findIndex(this.actions, (action) => action.name == creepWrapper.creep.memory.action);
            idx = (idx + 1) % this.actions.length;
            return this.actions[idx];
        }

        return this.actions[0];
    }

    run(creepWrapper){
        let target = creepWrapper.action.nextTarget(creepWrapper);
        if(target){
            creepWrapper.action.perform(creepWrapper, target);
        }

        if(creepWrapper.action.isCompleted){
            creepWrapper.action = this.getNextAction(creepWrapper);
        }
    }
}

class HarvesterRole extends Role{
    get name(){
        return 'H';
    }

    get actions(){
        return [
            new Actions.HarvestAction,
            new Actions.StoreEnergyAction
        ];
    }
}

class BuilderRole extends Role{
    get name(){
        return 'B';
    }

    get actions(){
        return [
            new Actions.HarvestAction,
            new Actions.BuildAndRepairAction
        ]
    }
}

class UpgraderRole extends Role{
    get name(){
        return 'B';
    }

    get actions(){
        return [
            new Actions.HarvestAction,
            new Actions.UpgradeAction
         ]
    }
}

module.exports = {
    Role,
    HarvesterRole,
    BuilderRole,
    UpgraderRole
}