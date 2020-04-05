const Factory = function(floor){
    this.floor = floor
    return this
}

Factory.prototype.construct = function(data){
    this.floor.empty()
    const length = data.payload.length
    for(let x = 0; x < length; x++){
        if(data.type === 'projects'){
            var project = new Project(data.payload[x]).build()
            this.floor.append(project)
        }
    }
    return this
}

const Project = function(item){
    this.bluePrint = `         
        <div id="template" class="card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">${item.description}</p>
                <a href="${item.href}" target="_blank" class="card-link">Card link</a>
            </div>
        </div>
    `
    return this
}

Project.prototype.build = function(){
    return $(this.bluePrint)
}