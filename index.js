const { Client, Attachment } = require('discord.js');
const bot = new Client();

var webshot = require('webshot');
// var appshot = require('node-server-screenshot');
var Jimp = require('jimp');

var options = {
    shotSize: {
        width: 'all',
        height: 'all'
    },
    shotOffset: { left: 2, right: 0, top: 0, bottom: 0 },
    quality: 100,
    renderDelay: 0,
    windowSize: {
        width: 1024,
        height: 768
        },
    cookies: {
        "euconsent":"BOtuQT6OtuQT6AKAABENC5-AAAAtlr_7__7-_9_-_f__9uj3Or_v_f__30ccL59v_h_7v-_7fi_20nV4u_1vft9yfk1-5ctDztp505iakivHmqNeb9n9mz1e5pRP78k89r7337Ew_v8_v-b7JCON_Iw"
    }
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
    height: 10000,
    js: true
}
*/ 
function takeShot(top, bot, site, file, renderer) {
    options.shotOffset.top = top;
    options.shotOffset.bottom = bot;
    if(renderer == 1){
        webshot(site, file, options, function(err) {});
    }
    else{
        // appshot.fromURL(site, file, appOpt, function() {});
    }
}


// access key is from screenshotlayer api. Change it to your own if you want or you can use mine
const lolApiUrl = 'http://api.screenshotlayer.com/api/capture?access_key=9b9af7ac099cc1b7109598edc65d40ce&fullpage=1&force=1&viewport=3840x2160&url=https://lolalytics.com/lol/kayle/';
const logApiUrl = 'http://api.screenshotlayer.com/api/capture?access_key=9b9af7ac099cc1b7109598edc65d40ce&fullpage=1&force=1&viewport=1920x1080&url=https://www.leagueofgraphs.com/champions/stats/kayle';



const token = 'NTYxNjIwNzU4MDQ0OTk5Njgx.XY6tnQ.GAykfrchu-uWfwEtVGpSEXIPuIM';
const PREFIX = '%';


// op.gg urls
const opggTrend = 'https://na.op.gg/champion/kayle/statistics/top/trend';
const opggStats = 'https://na.op.gg/champion/statistics';

// channel IDs (comments are for kaylemains ids)
const logChannelID = '627734262107340833'; // '625893096567341069'; 
const opggChannelID = '627734130410389505'; // '625764233333833775';
const lolChannelID = '670861782193274880'; // '625764276572782594';

var today = new Date();

bot.on('ready', () => {
    console.log('Online!');
    // bot.user.setActivity('with explosions');
});

bot.on('error', console.error);

bot.on('message', msg => {
    let args = msg.content.substring(PREFIX.length).split(' ');
    if (msg.member.hasPermission(0x00000008)) {
        switch (args[0]) {
            case 'opgg':
                // msg.channel.sendMessage('EXPLOSION!');
                today = new Date();
                /*
                 * op.gg
                 */

                var opList = [
                    'Win Rate',
                    'Pick Rate',
                    'Ban Rate',
                    'Win Rate / Game Length',
                    // 'Trends',
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
                //options.shotOffset.left = 741;
                //options.shotOffset.right = 5;
                //takeShot(695, 4115 - 1431 + 695, opggHome, 'op5.png', 1);
                // leaderboards
                options.shotOffset.left = 604;
                options.shotOffset.right = 23;
                takeShot(407, 3969 - 1245 + 407, opggStats, 'op5.png', 1);
                // reset options
                options.shotOffset.left = 2;
                options.shotOffset.right = 0;

                // post images
                // has a very high timeout to make sure image processing is complete
                // can have weird errors if this value isnt high enough
                setTimeout(function() {
                    for (var i = 1; i <= opList.length; i++) {
                        var img = new Attachment(
                            __dirname + '/op' + i + '.png'
                        );
                        bot.channels
                            .get(opggChannelID)
                            .send(opList[i - 1], img);
                    }
                }, 50000);

                // prints date
                bot.channels
                    .get(opggChannelID)
                    .send(
                        '```' +
                            today.getDate() +
                            '/' +
                            (today.getMonth() + 1) +
                            '/' +
                            today.getFullYear() +
                            '```'
                    );

                // clean up bootstrapping evidence
                msg.delete();

                break;

            

            
            case 'log':
                // msg.channel.sendMessage('EXPLOSION!');
                today = new Date();
                Jimp.read(logApiUrl, (err, image) => {
                    if (err) throw err;
                    
                    // popularity history
                    imageCopy = image.clone();
                    imageCopy.crop(629, 482, 1071 - 629, 785 - 482);
                    imageCopy.normalize();
                    imageCopy.write('log1.png');

                    // winrate history
                    imageCopy = image.clone();
                    imageCopy.crop(629, 806, 1071 - 629, 1109 - 806);
                    imageCopy.normalize();
                    imageCopy.write('log2.png');

                    // banrate history
                    imageCopy = image.clone();
                    imageCopy.crop(629, 1130, 1071 - 629, 1433 - 1130);
                    imageCopy.normalize();
                    imageCopy.write('log3.png');

                    // winrate
                    imageCopy = image.clone();
                    imageCopy.crop(629, 1523, 1544 - 629, 1826 - 1523);
                    imageCopy.normalize();
                    imageCopy.write('log4.png');

                    // duration
                    imageCopy = image.clone();
                    imageCopy.crop(629, 1847, 1544 - 629, 2150 - 1847);
                    imageCopy.normalize();
                    imageCopy.write('log5.png');

                    // kills - deaths
                    imageCopy = image.clone();
                    imageCopy.crop(629, 2171, 1544 - 629, 2474 - 2171);
                    imageCopy.normalize();
                    imageCopy.write('log6.png');

                    // stats
                    imageCopy = image.clone();
                    imageCopy.crop(629, 290, 1544 - 629, 461 - 290);
                    imageCopy.normalize();
                    imageCopy.write('log7.png');

                    // Roles
                    imageCopy = image.clone();
                    imageCopy.crop(1102, 482, 1544 - 1102, 751 - 482);
                    imageCopy.normalize();
                    imageCopy.write('log8.png');
                    
                    // Damage
                    imageCopy = image.clone();
                    imageCopy.crop(1102, 890, 1544 - 1102, 1007 - 890);
                    imageCopy.normalize();
                    imageCopy.write('log9.png');

                    // KDA
                    imageCopy = image.clone();
                    imageCopy.crop(1102, 1028, 1544 - 1102, 1125 - 1028);
                    imageCopy.normalize();
                    imageCopy.write('log10.png');
                    
                });                

                // post images
                // has a very high timeout to make sure image processing is complete
                // can have weird errors if this value isnt high enough
                setTimeout(function() {
                    for (var i = 1; i <= 10; i++) {
                        var img = new Attachment(
                            __dirname + '/log' + i + '.png'
                        );
                        bot.channels.get(logChannelID).send(img);
                    }
                }, 100000);

                // takeShot(0, 0, logStats, 'log.png', 1);

                // prints date
                bot.channels
                    .get(logChannelID)
                    .send(
                        '```' +
                            today.getDate() +
                            '/' +
                            (today.getMonth() + 1) +
                            '/' +
                            today.getFullYear() +
                            '```'
                    );

                // clean up bootstrapping evidence
                msg.delete();

                break;

            case 'lol':
                // msg.channel.sendMessage('EXPLOSION!');
                today = new Date();
                Jimp.read(lolApiUrl, (err, image2) => {
                    if (err) throw err;
                    image2.contrast(+0.1);
                    
                    
                    imageCopy = image2.clone();
                    imageCopy.crop(1976, 49, 2439 - 1976, 194 - 49);
                    imageCopy.write('lol1.png');
                    
                    imageCopy = image2.clone();
                    imageCopy.crop(1401, 735, 2438 - 1401, 1058 - 735);
                    imageCopy.write('lol2.png');
                    
                    imageCopy = image2.clone();
                    imageCopy.crop(2137, 1065, 2438 - 2137, 1538 - 1065);
                    imageCopy.write('lol3.png');
                })

                // post images
                // has a very high timeout to make sure image processing is complete
                // can have weird errors if this value isnt high enough
                
                setTimeout(function() {
                    for (var i = 1; i <= 3; i++) {
                        var img = new Attachment(
                            __dirname + '/lol' + i + '.png'
                        );
                        bot.channels.get(lolChannelID).send(img);
                    }
                }, 100000);
                

                // prints date
                bot.channels
                    .get(lolChannelID)
                    .send(
                        '```' +
                            today.getDate() +
                            '/' +
                            (today.getMonth() + 1) +
                            '/' +
                            today.getFullYear() +
                            '```'
                    );

                // clean up bootstrapping evidence
                msg.delete();

                break;
            
            // works but throws errors. Can probably ignore errors but idk
            // probably best to not use
            case 'megu':
                today = new Date();
                msg.channel.send('%opgg');
                msg.channel.send('%log');
                msg.channel.send('%lol');
                msg.delete();
                break;
            
            /*
            case 'testfile':
                today = new Date();
                msg.channel.send('Writing to test file...');
                //options.renderDelay = 0;
                //options.windowSize.width = 1024;
                //options.windowSize.height = 768;
                
                //takeShot(0, 0, opggTrend, 'optrend.png', 1);
                //takeShot(0, 0, opggHome, 'ophome.png', 1);
                //takeShot(0, 0, opggStats, 'opstats.png', 1);
                
                options.renderDelay = 2000;
                // options.windowSize.width = 1920;
                // options.windowSize.height = 1080;
                // takeShot(0, 0, logStats, 'logstats.png', 1);
                // takeShot(0, 0, 'u.gg', 'logstats.png', 2);
                break;
            */

            // immediately exits without waiting for async operations to complete
            case 'stop':
                process.exit(0);
                break;

            
        }
    
        switch (args[0]) {
            case 'time':
                let date_ob = new Date();

                // current date
                // adjust 0 before single digit date
                let date = ('0' + date_ob.getDate()).slice(-2);

                // current month
                let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);

                // current year
                let year = date_ob.getFullYear();

                // current hours
                let hours = date_ob.getHours();

                // current minutes
                let minutes = date_ob.getMinutes();

                // current seconds
                let seconds = ('0' + date_ob.getSeconds()).slice(-2);
                msg.channel.send(
                    'Server Time: ' +
                        date +
                        '/' +
                        month +
                        '/' +
                        year +
                        ' ' +
                        hours +
                        ':' +
                        minutes +
                        ':' +
                        seconds
                );
                break;
        }
    }

    // now = new Date();
    /*
    if (
        now.getDate() > today.getDate() ||
        now.getMonth() > today.getMonth() ||
        now.getFullYear() > today.getFullYear()
    ) {
        msg.channel.send('%opgg');
        msg.channel.send('%log');
    }
       if (!msg.author.bot) {
        msg.react('630545907133186049');
    }
    */
});

bot.login(token);
