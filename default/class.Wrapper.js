let States = require('class.State');

class CreepWrapper{
    constructor(creep){
        this._creep = creep;
        //this._creep.memory.state = new States.IdleState();
        this._state = new States.InitialState();
        this._action = null;
        this._behaviour = null;
    }

    get role(){
        return this._creep.memory.role;
    }

    set role(value){
        this._creep.memory.role = value;
    }

    get isBusy(){
        return this._creep.memory.isBusy;
    }

    set isBusy(value){
        this._creep.memory.isBusy = value;
    }
    
    get state(){
        return this._state;
    }
    
    set state(state){
        this._state = state;
    }
    
    get creep(){
        return this._creep;
    }

    get action(){
        return this._action;
    }

    set action(action){
        this._action = action;
    }
    get behaviour(){
        return this._behaviour;
    }

    set behaviour(behaviour){
        this._behaviour = behaviour;
    }
}

module.exports = {
    CreepWrapper
};