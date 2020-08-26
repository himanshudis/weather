const express=require('express');
const request=require('request');
const ejs=require('ejs');
const app=express();
const port=process.env.PORT || 7500
const bodyparser=require('body-parser');
app.use(bodyparser.json())
const encoder=bodyparser.urlencoded({
    extended:true
});
app.set('view engine','ejs');
//var url='http://api.weatherstack.com/current?access_key=6181e2b0b20623107f84522086faff14&query=34.55,90'
app.get('/',function(req,res){
    res.render('home');
})
app.post('/weather',encoder,function(req,res){
    console.log("print"+req.body.place);
    var url1='https://api.mapbox.com/geocoding/v5/mapbox.places/'+req.body.place+'.json?access_token=pk.eyJ1IjoiaGltYW5zaHU3ODYiLCJhIjoiY2tlNWh5ZXV6MDVtNzJycGRobXViYjVidCJ9.4_yfu-Xjt62jNe9W86Dw7g'
    var geocode=(url1,callback)=>{
        request({url:url1,json:true},(error,geodata)=>{
            if(error)
            {
                res.send("error occured")
            }
            else{
                callback({
                    latitude: geodata.body.features[0].center[1],
                    longitude: geodata.body.features[0].center[0]
                });
            }
        })
    }
    var wethercode=(url1,callback)=>{
        request({url:url1,json:true},(error,weadata)=>{
            if(error)
            {
                res.send("error occured")
            }
            else{
                callback({
                    location:weadata.body.location.name,
                    temp:weadata.body.current.temperature ,
                    precip:weadata.body.current.precip,
                    }
                );
            }
        })
    }
    geocode(url1,(data)=>{
        var url='http://api.weatherstack.com/current?access_key=6181e2b0b20623107f84522086faff14&query='+data.latitude+','+data.longitude
        wethercode(url,(weatherdata)=>{
            res.render('weather',{weatherdata});
        })
    })
    })
app.listen(port);



