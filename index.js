const { Client, Attachment } = require('discord.js');
const bot = new Client();

var webshot = require('webshot');
// var appshot = require('node-server-screenshot');

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
// const logStats = 'https://www.leagueofgraphs.com/champions/stats/kayle';

// channel IDs
// const logChannelID = '627734262107340833'; // '627734262107340833';
const opggChannelID = '627734130410389505'; // '627734130410389505';

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

            

            /*
            case 'log':
                msg.channel.sendMessage('EXPLOSION!');
                today = new Date();

                

                // popularity history
                options.shotOffset.left = 236;
                options.shotOffset.right = 1024 - 601 + 236;
                takeShot(528, 4806 - 831 + 528, logStats, 'log1.png', 1);

                // winrate history
                options.shotOffset.left = 236;
                options.shotOffset.right = 1024 - 601 + 236;
                takeShot(852, 4806 - 1155 + 852, logStats, 'log2.png', 1);

                // banrate history
                takeShot(1176, 4806 - 1479 + 1176, logStats, 'log3.png', 1);

                options.shotOffset.right = 1024 - 996 + 236;

                // winrate
                takeShot(1692, 4806 - 1995 + 1692, logStats, 'log4.png', 1);

                // duration
                takeShot(2016, 4806 - 2319 + 2016, logStats, 'log5.png', 1);

                // kills - deaths
                takeShot(2340, 4806 - 2643 + 2340, logStats, 'log6.png', 1);

                // stats
                options.shotOffset.left = 236;
                options.shotOffset.right = 1024 - 996 + 236;
                takeShot(337, 4806 - 507 + 337, logStats, 'log7.png', 1);

                // Roles
                options.shotOffset.left = 632;
                options.shotOffset.right = 1024 - 996 + 632;
                takeShot(528, 4806 - 816 + 528, logStats, 'log8.png', 1);
                
                // Damage
                options.shotOffset.left = 632;
                options.shotOffset.right = 1024 - 996 + 632;
                takeShot(955, 4806 - 1074 + 955, logStats, 'log9.png', 1);

                // KDA
                options.shotOffset.left = 632;
                options.shotOffset.right = 1024 - 996 + 632;
                takeShot(1095, 4806 - 1193 + 1095, logStats, 'log10.png', 1);

                // reset options
                options.shotOffset.left = 2;
                options.shotOffset.right = 0;

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
                }, 50000);

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
            */
            /*
            case 'megu':
                today = new Date();
                msg.channel.send('%opgg');
                msg.channel.send('%log');
                break;
            */
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
            
            case 'stop':
                // immediately exits without waiting for async operations to complete
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
