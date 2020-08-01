window.onload = async function(){
    await Factory.create('loader', {description: 'Searching for account...'})
    if(!localStorage.getItem('token')){
        const token = getCookie('token')
        if(!token) return getRedirect()
    }
    console.log('Token found!')
    const accounts = await fetchAccounts()
    if(accounts){
        await Factory.create('accounts', {accounts})
        Manager.longPoll('/api/ameritrade/accounts', {}, false, async ()=> await Factory.create('accounts', {accounts}, {pend:'prepend'}))
        const transactions = await fetchTransactions(accounts)
        if(transactions){
            await Factory.create('transactions', {transactions: JSON.stringify(transactions, null, 2)})
        }
        const orders = await fetchOrders(accounts)
        if(orders){
            await Factory.create('orders', {orders: JSON.stringify(orders, null, 2)})   
        }
        const movers = await fetchMovers()
        if(movers){
            await Factory.create('movers', {movers: JSON.stringify(movers, null, 2)})
            const charts = chartsForStocks(movers)
            if(charts){

            }
        }
    } else{
        const auth = await reAuth()
        if(auth) location.reload()
    }
}

const chartsForStocks = async (stocks) => {
    try{
        $('.loader').remove()
        await Factory.create('loader', {description: 'Fetching charts...'})
        for(let i = 0; i < stocks.length; i++){
            console.log('Fetching chart... ', stocks[i].symbol)
            const res = await axios.get('/api/ameritrade/chart',{
                headers:{
                    jwt: localStorage.getItem('token'),
                    symbol: stocks[i].symbol
                }
            })
            $('.loader').remove()
            if(!res.data.error){
                $('#tables').prepend(`
                    <div class="chart-container" style="position: relative; height:40%; width:80%">
                        <canvas id="my-chart"></canvas>
                    </div>    
                `)
                new Chart('my-chart', {
                    type: 'line',
                    data:{
                        labels: res.data.labels,
                        datasets: [{
                        label: res.data.symbol,
                        data: res.data.data,
                        lineTension: 0,
                        backgroundColor: [
                            'red',
                            'red',
                            'red',
                            'red',
                            'red',
                            'red',
                            'red',
                        ]
                        }]
                    },
                    options:{
                        legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            boxWidth: 80,
                            fontColor: 'white'
                        }
                        }
                    }
                });
            } else {
                $.get('templates/error.hbs', function (data) { 
                    const template = Handlebars.compile($(data).html())
                    $('#bg').append(template({
                        error: res.data.error
                    }))
                }, 'html')
            }
        }
        $('.loader').remove()
    } catch(error){
        console.log(error)
    }
}
const fetchMovers = async () => {
    try{
        $('.loader').remove()
        await Factory.create('loader', {description: 'Fetching movers...'})
        const data = await Manager.fetch('/api/ameritrade/movers')
        if(!data.error){
            $('.loader').remove()
            return data
        } else {
            await Factory.create('error', {error: data.error}, {target: '#bg'})
        }
    } catch(error){
        console.log(error)
    }
}
const fetchOrders = async (accounts) => {
    try{
        await Factory.create('loader', {description:'Fetching orders...'})
        const data = await Manager.fetch('/api/ameritrade/orders',{
            account_id: accounts[0].securitiesAccount.accountId
        })
        $('.loader').remove()
        if(!data.error){
            return data
        } else {
            $.get('templates/error.hbs', function (data) { 
                const template = Handlebars.compile($(data).html())
                $('#bg').append(template({
                    error: data.error
                }))
            }, 'html')
        }
    } catch(error){
        console.log(error)
    }
}
const fetchTransactions = async (accounts) => {
    try{
        await Factory.create('loader', {description: 'Fetching transactions...'})
        const data = await Manager.fetch('/api/ameritrade/transactions', {
            account_id: accounts[0].securitiesAccount.accountId
        })
        $('.loader').remove()
        if(!data.error){
            return data
        } else {
            await Factory.create('error',{error: data.error}, {target:'#bg'})
            return null
        }
    } catch(error){
        console.log(error)
    }
}
const fetchAccounts = async () => {
    try{
        await Factory.create('loader', {description: 'Token found! Fetching account...'})
        const data = await Manager.fetch('/api/ameritrade/accounts')
        $('.loader').remove()
        if(!data.error){
            return data
        } else {
            console.log('Error fetching accounts.')
            if(data.error === 'The access token being passed has expired or is invalid.'){
                return null
            }
            await Factory.create('error', {error: data.error}, {target: '#bg'})
            return null
        }
    } catch(error){
        console.log(error)
    }
}

const reAuth = async ()=>{
    try{
        await Factory.create('loader', {description: 'Re authorizing... '})
        const jwt = localStorage.getItem('token')
        localStorage.removeItem('token')
        const override = true
        const data = await Manager.fetch('/api/ameritrade/reauth',{
            jwt
        }, override)
        if(!data.error){
            return data
        } else {
            return await Factory.create('error', {error: data.error}, {target: '#bg'})
        }
    } catch(error){
        console.log(error)
    }
}

const getRedirect = async () => {
    $('.loader').remove()
    await Factory.create('loader', {description: 'No token found! Redirecting...'})
    const res = await axios.get('/api/ameritrade/redirect')
    if(res.data.url){
        console.log('No token found! Redirecting...')
        window.location.replace(res.data.url)
    }
    if(res.data.error){
        $('.loader').remove()
        var bodyHtml = /<body.*?>([\s\S]*)<\/body>/.exec(res.data.error)[1];
        return await Factory.create('error', {error: bodyHtml}, {target: '#bg'} )
    }
}

const getCookie = name => {
    console.log('No token in storage.')
    const parsed = document.cookie.split(";");
    var token = null
    for (const index in parsed) {
        const item = parsed[index]
        if (item.includes(name+"=")) {
            const arr = item.split('=')
            token = arr[1].length === 0 ? null : arr[1]
            localStorage.setItem(name, token)
        }
    }
    return token
}