let Actions = require('Actions');

class Role{

    get name(){
        return 'Role';
    }

    static createRole(string){
        //ToDo: Implement logic which role to take
        switch (string.toUpperCase()) {
            case "H":
                return new HarvesterRole();
            case "B":
                return new BuilderRole();
            case 'R':
                return new RepairRole();
            case "U":
                return new UpgraderRole();
        }
        console.log("Role.createRole: No Role found for Input: " + string);
    }

    get actions(){
        return [];
    }

    isExecutionNeeded(creepWrapper){
        return true;
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

    isExecutionNeeded(creepWrapper){
        return this.actions[1].nextTarget(creepWrapper) != null;
    }

    get actions(){
        return [
            new Actions.HarvestAction,
            new Actions.BuildAction
        ]
    }
}

class RepairRole extends Role{
    get name(){
        return 'R';
    }

    isExecutionNeeded(creepWrapper){
        return this.actions[1].nextTarget(creepWrapper) != null;
    }

    get actions(){
        return [
            new Actions.HarvestAction,
            new Actions.RepairAction
        ]
    }
}

class UpgraderRole extends Role{
    get name(){
        return 'B';
    }

    isExecutionNeeded(creepWrapper){
        return this.actions[1].nextTarget(creepWrapper) != null;
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
    RepairRole,
    UpgraderRole
}