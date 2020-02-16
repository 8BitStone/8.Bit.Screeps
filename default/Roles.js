let Actions = require('Actions');
class Role{
    get name(){
        return 'Role';
    }

    canProceed(creepWrapper){
        if(!creepWrapper.action){
            creepWrapper.action = this.getNextAction(creepWrapper);
        }

        return creepWrapper.action.isValidForCreep(creepWrapper);
    }

    getNextAction(creepWrapper){
        //ToDo: Implement logic to get succeeding action
        return new Actions.Action();
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

function createRole(string){
    //ToDo: Implement logic which role to take
    return new Role();
}

module.exports = {
    Role,
    createRole
}