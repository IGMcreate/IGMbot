const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { useMainPlayer, useQueue, AudioFilters } = require('discord-player');

const custom_types = [
    'aresample',
    'asetrate',
    // 'vaporwave',
    // 'pulsator',
    // 'earwax',
    // 'flanger',
    // 'gate',
    // 'haas',
    // 'reverse',
    // 'surround',
    // 'tremolo',
    // 'vibrato'
]
module.exports = {
    name: 'filter',
    description: 'add a filter to your track',
    voiceChannel: true,
    options: [
        {
            name: 'filter',
            description: 'filter you want to add or name for a custom filter',
            type: ApplicationCommandOptionType.String,
            required: false,
            choices: [...Object.keys(require("discord-player").AudioFilters.filters).map(m => Object({ name: m, value: m })).splice(0, 25),],
        },
        {
            name: 'custom_name',
            description: 'name for custom filter to create',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'custom',
            description: 'custom filter to create',
            type: ApplicationCommandOptionType.String,
            required: false,
            choices: [...custom_types.map(m => Object({ name: m, value: m })).splice(0, 25)],
        },
        {
            name: 'value',
            description: 'value for the custom filter (only required for custom filters) default is (for mot common) 44100',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'clear',
            description: 'clears all filters',
            type: ApplicationCommandOptionType.String,
            required: false,
            choices: [
                { name: 'True', value: 'true' },
                { name: 'False', value: 'false' },
            ],
        },
    ],


    async execute({ inter }) {
        const queue = useQueue(inter.guildId);
        const player = useMainPlayer()
        //console.log(...Object.keys(require("discord-player").AudioFilters.filters).map(m => Object({ name: m, value: m })).splice(0, 25))
        
        const filters = [];
        
        queue.filters.ffmpeg.getFiltersEnabled().map(x => filters.push(x));
        queue.filters.ffmpeg.getFiltersDisabled().map(x => filters.push(x));
        const infilter = inter.options.getString('filter');
        const incustom = inter.options.getString('custom_name');
        const filter = filters.find((x) => 
            (infilter && x.toLowerCase() === infilter.toLowerCase()) || 
            (incustom && x.toLowerCase() === incustom.toLowerCase())
          );

        if ((inter.options.getString('filter') && (inter.options.getString('custom_name') || inter.options.getString('custom') || inter.options.getString('value'))) || ((inter.options.getString('custom_name') || inter.options.getString('custom') || inter.options.getString('value')) && !(inter.options.getString('custom_name') && inter.options.getString('custom') && inter.options.getString('value')))) return inter.editReply({ content: 'If you are using a custom filter, you must provide a name as well as the value option, or if choosing a predefined filter, no custom options can be selected.', ephemeral: true });
        
        if (!queue || !queue.isPlaying()) return inter.editReply({ content: `No music currently playing ${inter.member}... try again ? `, ephemeral: true });
        //console.log(inter.options.getString('filter'));
        if (inter.options.getString('filter') != null && filter && inter.options.getString('clear') != 'true') {

            const actualFilter = queue.filters.ffmpeg.getFiltersEnabled()[0];

            if (!filter) return inter.editReply({ content: `This filter doesn't exist ${inter.member}... try again ? \n${actualFilter ? `Filter currently active ${actualFilter}.\n` : ''}List of available filters ${filters.map(x => `${x}`).join(', ')}.`, ephemeral: true });

            await queue.filters.ffmpeg.toggle(filter)

            const FilterEmbed = new EmbedBuilder()
                .setAuthor({ name: `The filter ${filter} is now ${queue.filters.ffmpeg.isEnabled(filter) ? 'enabled' : 'disabled'} \n*Reminder the longer the music is, the longer this will take.*` })
                .setColor('#2f3136')

            return inter.editReply({ embeds: [FilterEmbed] });
        } else if (inter.options.getString('filter') == null && !filter && inter.options.getString('clear') != 'true') {

            AudioFilters.define(`${inter.options.getString('custom_name')}`, `${inter.options.getString('custom')}=${inter.options.getString('value')}`);

            await queue.filters.ffmpeg.toggle(inter.options.getString('custom_name'))
            const FilterEmbed = new EmbedBuilder()
                .setAuthor({ name: `The filter ${inter.options.getString('custom_name')} is now ${queue.filters.ffmpeg.isEnabled(inter.options.getString('custom_name')) ? 'enabled' : 'disabled'} \n*Reminder the longer the music is, the longer this will take.*` })
                .setColor('#2f3136')

            return inter.editReply({ embeds: [FilterEmbed] });
        } else if (inter.options.getString('clear') == 'true') {
            const enabledFilters = queue.filters.ffmpeg.getFiltersEnabled();

            // If there are any enabled filters, loop through them and disable each one
            enabledFilters.forEach(filter => {
                queue.filters.ffmpeg.toggle(filter);
            });
            
            // Send a reply indicating that all filters have been disabled
            return inter.editReply({ content: 'All enabled filters have been disabled.', ephemeral: true });
        } else {
            const filters = [];
            queue.filters.ffmpeg.getFiltersEnabled().map(x => filters.push(x));
            console.log(filters)

            const FilterEmbed = new EmbedBuilder()
                .setAuthor({ name: `${filters.length ? `The current filters are ${filters}` : 'There are no current filters'}` })
                .setColor('#2f3136')

            return inter.editReply({ embeds: [FilterEmbed] });
        }
    },
};