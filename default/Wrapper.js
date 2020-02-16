let Roles = require('Roles');

class CreepWrapper{
    constructor(creep){
        this._creep = creep;
        this._action = null;
        this._roles = _.map(this._creep.memory.roles, (r) => Roles.Role.createRole(r));
        this._target = null;
    }
    
    get creep(){
        return this._creep;
    }

    get roles(){
        return this._roles;
    }

    get action(){
        return this._action;
    }

    set action(action){
        this._action = action;
        this.creep.memory.action = action.name;
    }

    get target(){
        return this._target;
    }

    set target(target){
        this._target = target;
    }
}

module.exports = {
    CreepWrapper
};