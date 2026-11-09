import "dotenv/config";
import { Loader } from "./handlers/loader";
import { NtyClient } from "./handlers/client";
import { GatewayIntentBits, Partials } from "discord.js";

async function main() {
    console.clear();

    const client = new NtyClient({
        intents: Object.values(GatewayIntentBits) as GatewayIntentBits[],
        partials: Object.values(Partials) as Partials[],
    });

    client.setMaxListeners(0);

    client.on("error", (error) => {
        console.error("[Discord Client Error]", error);
    });

    process.on("unhandledRejection", (error) => {
        console.error("[Unhandled Rejection]", error);
    });

    await new Loader(client).load();

    client.login(process.env.BOT_TOKEN);
}

main();
