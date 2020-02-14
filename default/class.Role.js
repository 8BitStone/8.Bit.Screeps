class Role{
    constructor(name){
        this._name = name;
    }
    
    get name(){
        return this._name;
    }
}

class HarvesterRole extends Role{
    constructor(){
        super("harvester");
    }
}

module.exports = {   
    Role,
    HarvesterRole
}