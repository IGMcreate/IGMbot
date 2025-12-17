const { default: axios } = require('axios');
const { ApplicationCommandOptionType} = require('discord.js');

module.exports = {
    name: 'uuid',
    description: "returns players uuid",
    options: [
        {
            name: 'player',
            description: 'player whose uuid is to be returned',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    async execute({inter}) {
        const player = inter.options.getString('player');

            axios.get(`https://api.mojang.com/users/profiles/minecraft/${player}`)
            .then((res) => {
                console.log(res.data.id)
                inter.editReply(`UUID: ${res.data.id}`)
            })
            .catch((err) => {
                if (err.message == 'Request failed with status code 404'){
                    console.log(err)
                    console.log(err.message)
                    inter.editReply('No user found: ' + err.message)
                }
                else if(err.message == 'Request failed with status code 400'){
                    console.log(err)
                    console.log(err.message)
                    inter.editReply('Name entered is too long: ' + err.message)
                }
                else {
                    console.log(err)
                    console.log(err.message)
                    inter.editReply(`Unknown error` + err.message)
                }
            })
    }, 
};