const Factory = function(){ }

Factory.create = async (type, data = {}, options= {target:'#tables', pend:'append'}) => {
    return new Promise(resolve=>{
        $.get(`assets/templates/${type}.hbs`, function (html) { 
            $(`.${type}`).remove()
            const template = Handlebars.compile($(html).html())
            if(!options.target) options.target = '#tables'
            if(!options.pend) options.pend = 'append'
            $(options.target)[options.pend](template(data))
            resolve() 
        }, 'html')
    })
}

Factory.fetchAndDisplayProjects = async function(target){
    try{
        const response = await axios.get('/api/projects')
        if(response){
            $(target).empty()
            $(target).append('')

        }
    } catch(error){
        console.log('Error on fetchAndDisplayProjects: ', error);
    }
    return this
}