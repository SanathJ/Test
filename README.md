[![Build Status](https://travis-ci.com/SanathJ/Test.svg?token=zpvipNg2JxgsxVy9rFSB&branch=master)](https://travis-ci.com/SanathJ/Test)
# **Megu Bot**
This is a bot for the [Kayle Mains discord server](https://discord.gg/ExyGyS8). 

## **Commands**
- ### %opgg
    Makes bot collect data from [op.gg](https://na.op.gg) and send it to a specified channel 
- ### %log
    Makes bot collect data from [League of Graphs](https://www.leagueofgraphs.com/) and send it to a specified channel
- ### %time
    Sends server time to same channel as command message
- ### %megu
    Makes bot act as though it had received both commands - `%opgg` and `%log`.

## **Usage**
Everytime a message is sent on the server, the bot checks whether the date has changed.If it has, the bot acts as though it had received command - `%megu`.

    