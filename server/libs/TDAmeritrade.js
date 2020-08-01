const jwt = require('jsonwebtoken');
var request = require('request');
const TDAmeritrade = (exports.TDAmeritrade = {});

module.exports = TDAmeritrade

TDAmeritrade.createRedirect = async (req, res) => {
    try{
        const redirect_URL = encodeURIComponent('http://192.168.1.249:8080/api/auth')
        const url = 'https://auth.TDAmeritrade.com/auth?response_type=code&redirect_uri='+redirect_URL+'&client_id='+process.env.CLIENT_ID+'%40AMER.OAUTHAP'
        res.json({
            url
        })
    } catch(error){
        console.log(error)
        if(error.response.data){
            return res.json({
                error: error.response.data
            })
        }
    }
}

TDAmeritrade.reAuthorize = async (req, res) => {
    try{
        const credentials = jwt.verify(req.headers.jwt, process.env.PRIVATE_KEY);
        const url = 'https://api.TDAmeritrade.com/v1/oauth2/token'
        request({
            url: url,
            method: 'POST',
            form: {
                grant_type:'refresh_token',
                refresh_token:credentials.refresh_token,
                access_type:'offline',
                client_id:process.env.CLIENT_ID,
            }
        }, function(err, ret) {
            var json = JSON.parse(ret.body);
            if(json.access_token){
                const token = jwt.sign({
                    token: json.access_token,
                    refresh_token: json.refresh_token,
                    expires: new Date(Date.now() + 9999999)
                }, process.env.PRIVATE_KEY);
                res.cookie('token', token, { expires: new Date(Date.now() + 9999999) })
                res.redirect(302, '/ameritrade')
            }
        });
    } catch(error){
        console.log(error)
    }
}
TDAmeritrade.storeToken = async (req, res) => {
    try{
        const url = 'https://api.TDAmeritrade.com/v1/oauth2/token'
        request({
            url: url,
            method: 'POST',
            form: {
                grant_type:'authorization_code',
                refresh_token:'',
                access_type:'offline',
                client_id:process.env.CLIENT_ID,
                code:req.query.code,
                redirect_uri:'http://192.168.1.249:8080/api/auth'
            }
        }, function(err, ret) {
            var json = JSON.parse(ret.body);
            if(json.access_token){
                const token = jwt.sign({
                    token: json.access_token,
                    refresh_token: json.refresh_token,
                    expires: new Date(Date.now() + 9999999)
                }, process.env.PRIVATE_KEY);
                res.cookie('token', token, { expires: new Date(Date.now() + 9999999) })
                res.redirect(302, '/ameritrade')
            }
        });
    } catch(error){
        console.log(error)
    }
}
TDAmeritrade.getAccounts = (req, res) => {
    try{
        const credentials = jwt.verify(req.headers.jwt, process.env.PRIVATE_KEY);
        const url = 'https://api.TDAmeritrade.com/v1/accounts'
        request({
            url: url,
            method: 'GET', 
            auth: {
                'bearer': credentials.token
            },
            form: {
                fields:'positions,orders',
                client_id:process.env.CLIENT_ID,
            }
        }, function(err, ret) {
            var json = JSON.parse(ret.body);
            if(json){
                res.send(ret.body)
            }
        });
    } catch(error){
        console.log(error)
        if(error.response.data.error){
            res.json({
                error: error.response.data.error
            })
        }
    }
}
TDAmeritrade.getTransactions = (req, res) => {
    try{
        const credentials = jwt.verify(req.headers.jwt, process.env.PRIVATE_KEY);
        const url = 'https://api.tdameritrade.com/v1/accounts/'+req.headers.account_id+'/transactions'
        request({
            url: url,
            method: 'GET',
            auth: {
                'bearer': credentials.token
            },
            form: {
                type:'ALL',
            }
        }, function(err, ret) {
            var json = JSON.parse(ret.body);
            if(json){
                res.send(ret.body)
            }
        });
    } catch(error){
        console.log(error)
        if(error.response.data.error){
            res.json({
                error: error.response.data.error
            })
        }
    }
}
TDAmeritrade.getOrders = (req, res) => {
    try{
        const credentials = jwt.verify(req.headers.jwt, process.env.PRIVATE_KEY);
        const url = 'https://api.tdameritrade.com/v1/accounts/'+req.headers.account_id+'/orders'
        request({
            url: url,
            method: 'GET',
            auth: {
                'bearer': credentials.token
            }
        }, function(err, ret) {
            var json = JSON.parse(ret.body);
            if(json){
                res.send(ret.body)
            }
        });
    } catch(error){
        console.log(error)
        if(error.response.data.error){
            res.json({
                error: error.response.data.error
            })
        }
    }
}
TDAmeritrade.getChart = (req, res) => {
    try{
        const credentials = jwt.verify(req.headers.jwt, process.env.PRIVATE_KEY);
        const url = 'https://api.tdameritrade.com/v1/marketdata/'+req.headers.symbol+'/pricehistory'
        request({
            url: url,
            method: 'GET',
            auth: {
                'bearer': credentials.token
            },
            form:{
                period: 2,
                periodType: 'day',
                frequency: 1,
                frequencyType: 'min',
            }
        }, function(err, ret) {
            var json = JSON.parse(ret.body);
            
            if(json){
                res.send(TDAmeritrade.parseCharts(json))
            }
        });
    } catch(error){
        console.log(error)
        if(error.response.data.error){
            res.json({
                error: error.response.data.error
            })
        }
    }
}
TDAmeritrade.getMovers = (req, res) => {
    try{
        const credentials = jwt.verify(req.headers.jwt, process.env.PRIVATE_KEY);
        const url = 'https://api.tdameritrade.com/v1/marketdata/$DJI/movers'
        request({
            url: url,
            method: 'GET',
            auth: {
                'bearer': credentials.token
            }
        }, function(err, ret) {
            var json = JSON.parse(ret.body);
            if(json){
                res.send(ret.body)
            }
        });
    } catch(error){
        console.log(error)
        if(error.response.data.error){
            res.json({
                error: error.response.data.error
            })
        }
    }
}
TDAmeritrade.parseCharts = charts => {
    try{
        const ret = {
            symbol: charts.symbol,
            labels: [],
            data: [],
        }
        charts.candles.forEach(chart => {
            var d = new Date(chart.datetime);
            ret.labels.push(d.toDateString())
            ret.data.push(chart.close)
        })
        return ret
    } catch(error){
        console.log(error)
        if(error.response.data.error){
            res.json({
                error: error.response.data.error
            })
        }
    }
}

