module.exports = async ({  inter, queue }) => { 
    if (!queue || !queue.playing) return inter.editReply({ content: `No music currently playing... try again ? `, ephemeral: true });
    
    queue.skip();

    return inter.editReply({ content: `Current music ${queue.current.title} skipped `});
}
