window.onload = async function(){
    await Factory.create('loader', {}, {target: '#main'})
    // const events = await Manager.fetch('/api/server/events')
    // console.log(events)
    // await Factory.create('system_log', {events}, {target:'#main'})
    await Factory.create('about_me', {}, {target:'#main'})
    $('.display-messages').on('click', function(){
        $('.activity-display').toggleClass('activity-display-collapse')
        $('.activity-body').toggleClass('hidden')
    })
    const projects = await Manager.fetch('/api/projects')
    await Factory.create('projects', {projects: projects.payload}, {target: '#main'})
    $('.loader').remove()
}