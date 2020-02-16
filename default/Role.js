let Action = require('Action');

module.exports = class Role{
    get name(){
        return 'Role';
    }

    static createRole(string){
        //ToDo: Implement logic which role to take
        return new Role();
    }

    canProceed(creepWrapper){
        if(!creepWrapper.action){
            creepWrapper.action = this.getNextAction(creepWrapper);
        }

        return creepWrapper.action.isValidForCreep(creepWrapper);
    }

    getNextAction(creepWrapper){
        //ToDo: Implement logic to get succeeding action
        return new Action();
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