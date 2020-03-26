const Container = function(){
    this.cardFooter = document.getElementsByClassName('card-footer')[0]
    this.cardDetail = $('.card-detail')
    this.projects = $('.projects')
    this.template = $('.template')
    this.open = '198px'
    this.close = '177px'
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
}

Container.prototype.fetchAndDisplayProjects = async function(){
    this.factory = new Factory()
    const response = await axios.get('/api/data-control/projects')
    if(response){
        this.factory.constructProject(this.projects, response.data)
    }

}

window.onload = function(){
    const container = new Container()
    // container.initializeEventListeners()
    container.fetchAndDisplayProjects()
}