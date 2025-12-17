const { default: axios } = require('axios');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'news',
    description: "returns skyblock news",
    async execute({ inter }) {

        const hypixel_key = client.config.app.hypixel_api_token;

        try {
            const { data: hypixelData } = await axios.get(`https://api.hypixel.net/v2/skyblock/news?key=${hypixel_key}`)

            const profileChoices = hypixelData.items.map(p => ({
                link: p.link,
                date: p.text,
                version: p.title
            }));

            const NewsEmbed = new EmbedBuilder()

            NewsEmbed.setTitle('Skyblock News')

            for (var i = 0; i < profileChoices.length; i++) {
                NewsEmbed.addFields({ name: profileChoices[i].date, value: (`link: ${profileChoices[i].link},\nversion: ${profileChoices[i].version}`) /*inline: true*/ },)
            }

            inter.editReply({ embeds: [NewsEmbed] })

        } catch (e) {
            console.error(e)
            inter.editReply('An error occurred while fetching skyblock news. Please try again later.')
        }
    },
};