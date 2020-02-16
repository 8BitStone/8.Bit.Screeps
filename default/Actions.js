class Action{
    get name(){
        return 'Action';
    }

    get isCompleted(){
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

module.exports = {
    Action
}