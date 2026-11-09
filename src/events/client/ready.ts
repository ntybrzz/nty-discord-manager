import { createEvent } from "../../base/event";
import { getEmojis, loadEmojis } from "../../handlers/emojis";

export default createEvent({
    name: "clientReady",

    async run(client) {
        try {
            await loadEmojis(client);
            await getEmojis(client);
        } catch (error) {
            console.error("Erro ao carregar emojis:", error);
        }

        console.log(`[\x1b[38;5;120mBOT\x1b[0m] \x1b[38;5;119m${client.user?.tag}\x1b[0m is ready!`);
    },
});
