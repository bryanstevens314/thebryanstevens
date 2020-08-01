const Manager = () => { }

Manager.fetch = async (url, options = {}, override = false) => {
    try{
        options = !override ? {
            jwt: localStorage.getItem('token'),
            ...options
        } : options
        const res = await axios.get(url, {
            headers: options
        })
        return res.data
    } catch(error){
        console.log(error)
    }
}
Manager.longPoll = function(url, options = {}, override = false, callback){
    setTimeout(async () => {
        console.log(`Polling ${url}...`)
        const data = await Manager.fetch(...arguments)
        if(data){
            callback(data)
        }
        Manager.longPoll(...arguments)
    }, 5000);
}