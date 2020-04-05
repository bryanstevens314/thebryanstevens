const Container = function(){
    this.cardFooter = $('.card-footer')
    this.cardDetail = $('.card-detail')
    this.projects = $('.projects')
    this.template = $('.template')
    this.open = '198px'
    this.close = '177px'
    return this
}

Container.prototype.initializeEventListeners = function(){
    var self = this
    self.toggle.call(self, 'open')
    self.cardFooter.addEventListener('mouseenter', function(){
        self.toggle.call(self, 'open')
    })
    self.cardFooter.addEventListener('mouseleave', function(){
        self.toggle.call(self, 'close')
    })
    return self
}

Container.prototype.toggle = function(type){
    if(this.timeout){
        clearTimeout(this.timeout)
        this.timeout = null
    }
    switch(type){
        case 'open':
            this.cardDetail.animate({
                marginTop: this.open
            }, 250);
        case 'close':
            this.timeout = setTimeout(()=>{
                this.cardDetail.animate({
                    marginTop: this.close
                }, 100);
            }, 750)
    }
    return this
}

Container.prototype.fetchAndDisplayProjects = async function(){
    try{
        const response = await axios.get('/api/data-control/projects')
        if(response){
            new Factory(this.projects).construct(response.data)
        }
    } catch(error){
        console.log('Error on fetchAndDisplayProjects: ', error);
    }
    return this
}

window.onload = function(){
    const container = new Container().fetchAndDisplayProjects()
}