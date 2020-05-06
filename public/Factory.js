const Factory = function(floor){
    this.floor = floor
    return this
}

Factory.prototype.construct = async function(data){
    this.floor.empty()
    const length = data.payload.length
    for(let x = 0; x < length; x++){
        if(data.type === 'projects'){
            new Project(template=>{ this.floor.append(template({item: data.payload[x]})) })
        }
    }
    return this
}

const Project = function(callback){ 
    $.get('templates/project.hbs', function (data) { 
        callback(Handlebars.compile($(data).html())) 
    }, 'html')
}