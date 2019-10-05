const {Client, Attachment} = require('discord.js');
const bot = new Client();


var webshot = require('webshot');
// var appshot = require('node-server-screenshot'); 

var options = {
    shotSize: {
      width: 'all'
    , height: 'all'
    },
    shotOffset: { left: 2
        , right: 0
        , top: 0
        , bottom: 0
    },
    quality: 100,
    renderDelay: 0 
};
/*
var appOpt = {
    clip: {
        x: 0,
        y: 0,
        width: 1000,
        height: 1000
    },
    show: false,
    width: 10000,
    height: 10000
    // js: true
}
*/
function takeShot(top, bot, site, file, renderer)  {
    options.shotOffset.top = top;
    options.shotOffset.bottom = bot;
    webshot(site, file, options, function(err){});

}

const token = 'NTYxNjIwNzU4MDQ0OTk5Njgx.XY6tnQ.GAykfrchu-uWfwEtVGpSEXIPuIM';
const PREFIX = '%';


// u.gg url
// const uggStats = 'https://u.gg/lol/champions/kayle/build';

// lolalytics url
// const lolHistoric = 'https://lolalytics.com/ranked/worldwide/platinum/plus/champion/Kayle/Top/historic/'; 

// op.gg urls
const opggTrend = 'https://na.op.gg/champion/kayle/statistics/top/trend';
const opggHome = 'https://www.op.gg/champion/kayle/statistics/top';
const opggStats = 'https://na.op.gg/champion/statistics';

// league of graphs url
const logStats = 'https://www.leagueofgraphs.com/champions/stats/kayle';

// channel IDs
const logChannelID = '627734262107340833'; // '627734262107340833';
const opggChannelID = '627734130410389505'; // '627734130410389505';

var today = new Date();

bot.on('ready', () =>{
    console.log('Online!');
    bot.user.setActivity('with explosions');
});

bot.on('error', console.error);

bot.on('message', msg=>{
    let args = msg.content.substring(PREFIX.length).split(" ");
    if (msg.member.hasPermission(0x00000008)){
        switch(args[0]){
            case 'opgg':
                msg.channel.sendMessage('EXPLOSION!');
                today = new Date();
                /* 
                * op.gg
                */    
                var opList = [
                    'Win Rate',
                    'Pick Rate',
                    'Ban Rate',
                    'Win Rate / Game Length',
                    'Trends',
                    'Leaderboard'
                ];
                // winrate
                takeShot(685, 2127 - 1020 + 685, opggTrend, 'op1.png', 1);
                // pickrate
                takeShot(1032, 2127 - 1366 + 1032, opggTrend, 'op2.png', 1);
                // banrate
                takeShot(1379, 2127 - 1714 + 1379, opggTrend, 'op3.png', 1);
                // winrate / game length
                takeShot(1728, 2127 - 2005 + 1728, opggTrend, 'op4.png', 1);
                // trends
                options.shotOffset.left = 741;
                options.shotOffset.right = 5;
                takeShot(695, 4115 - 1431 + 695, opggHome, 'op5.png', 1);
                // leaderboards
                options.shotOffset.left = 604;
                options.shotOffset.right = 23;
                takeShot(407, 3969 - 1245 + 407, opggStats, 'op6.png', 1)
                // reset options
                options.shotOffset.left = 2;
                options.shotOffset.right = 0;

                // post images
                // has a very high timeout to make sure image processing is complete
                // can have weird errors if this value isnt high enough 
                setTimeout(function(){
                    for(var i = 1; i <= opList.length; i++) {
                        var img = new Attachment(__dirname + '\\op' + i + '.png');
                        bot.channels.get(opggChannelID).send(opList[i-1], img);
                    }
                }, 50000);
                
                // prints date
                bot.channels.get(opggChannelID).send('```' + today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear() + '```');
                
                // clean up bootstrapping evidence
                msg.delete();

                break;
            
            case 'ugg':
                // msg.channel.sendMessage('EXPLOSION!');
                
                /* 
                * u.gg
                */    
                /*
                var uList = [
                    'Plat',
                    'Plat+',
                    'Diamond',
                    'Diamond+',
                    'Master',
                    'Grandmaster',
                    'Challenger',
                    'All Ranks'
                ];
                
                appOpt.show = true;
                // Plat
                takeShot(0, 0, uggStats, 'u1.png', 0);
                */
                break;
            
            case 'lol':
                    // msg.channel.sendMessage('EXPLOSION!');
                
                    /**
                     * lolalytics
                     */
                    /*
                    appOpt.clip.width = 887;
                    appOpt.clip.height = 575;
                    appOpt.clip.x = 352;
                    appOpt.clip.y = 581;
                    takeShot(0, 0, lolHistoric, 'lol1.png', 0);

                    appOpt.clip.width = 887;
                    appOpt.clip.height = 575;
                    appOpt.clip.x = 352;
                    appOpt.clip.y = 1100;
                    takeShot(0, 0, lolHistoric, 'lol3.png', 0);
                    */
                    break;

            case 'log':
                msg.channel.sendMessage('EXPLOSION!');
                today = new Date();
                // popularity history
                options.shotOffset.left = 252;
                options.shotOffset.right = 1024 - 600 + 252;
                takeShot(529, 4797 - 830 + 529, logStats, 'log1.png', 1);

                // winrate history
                options.shotOffset.left = 237;
                options.shotOffset.right = 1024 - 600 + 237;
                takeShot(853, 4797 - 1154 + 853, logStats, 'log2.png', 1);

                // banrate history
                takeShot(1177, 4797 - 1478 + 1177, logStats, 'log3.png', 1);

                options.shotOffset.right = 1024 - 995 + 237;

                // winrate
                takeShot(1693, 4797 - 1994 + 1693, logStats, 'log4.png', 1);

                // duration
                takeShot(2017, 4797 - 2318 + 2017, logStats, 'log5.png', 1);
                
                // kills - deaths
                takeShot(2341, 4797 - 2642 + 2341, logStats, 'log6.png', 1);

                // stats
                options.shotOffset.left = 252;
                options.shotOffset.right = 1024 - 995 + 252;
                takeShot(337, 4797 - 506 + 337, logStats, 'log7.png', 1);

                // Roles
                options.shotOffset.left = 633;
                options.shotOffset.right = 1024 - 995 + 633;
                takeShot(529, 4797 - 815 + 529, logStats, 'log8.png', 1);

                // reset options
                options.shotOffset.left = 2;
                options.shotOffset.right = 0;

                // post images
                // has a very high timeout to make sure image processing is complete
                // can have weird errors if this value isnt high enough 
                setTimeout(function(){
                    for(var i = 1; i <= 8; i++) {
                        var img = new Attachment(__dirname + '\\log' + i + '.png');
                        bot.channels.get(logChannelID).send(img);
                    }
                }, 50000);
                
                // prints date
                bot.channels.get(logChannelID).send('```' + today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear() + '```');
                
                // clean up bootstrapping evidence
                msg.delete();
                
                break;
            /*
            case 'stop':
                if(){
                    // immediately exits without waiting for async operations to complete
                    process.exit(0);
                }
                break;

            */
        }
    }
    switch(args[0]){
        case 'time':
            let date_ob = new Date();

            // current date
            // adjust 0 before single digit date
            let date = ("0" + date_ob.getDate()).slice(-2);
            
            // current month
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                
            // current year
            let year = date_ob.getFullYear();
                
            // current hours
            let hours = date_ob.getHours();
                
            // current minutes
            let minutes = date_ob.getMinutes();
                
            // current seconds
            let seconds = ("0" + date_ob.getSeconds()).slice(-2);
            msg.channel.send("Server Time: " + date + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds);
            break;

    }
    
    now = new Date();
    if(now.getDate() > today.getDate() || now.getMonth() > today.getMonth()|| now.getFullYear() > today.getFullYear()){
        msg.channel.send('%opgg');
        msg.channel.send('%log');
    }
    
});

bot.login(token);