import { readdir, readFile } from "fs/promises";
import { basename, extname, join } from "path";
import type { NtyClient } from "./client";

const FOLDER = join(__dirname, "..", "..", "emojis");

let loading: Promise<void> | undefined;

function getApplication(client: NtyClient) {
    if (!client.application) throw new Error("bot is not ready yet");
    return client.application;
}

export function loadEmojis(client: NtyClient) {
    loading ??= upload(client).finally(() => (loading = undefined));
    return loading;
}

async function upload(client: NtyClient) {
    const application = getApplication(client);
    const existing = new Set((await application.emojis.fetch()).map((emoji) => emoji.name?.toLowerCase()));
    const files = (await readdir(FOLDER).catch(() => [])).filter((file) => /\.(png|jpe?g|gif|webp)$/i.test(file));

    for (const file of files) {
        const name = basename(file, extname(file));
        if (existing.has(name.toLowerCase())) continue;

        const type = extname(file).slice(1).toLowerCase().replace("jpg", "jpeg");
        const data = await readFile(join(FOLDER, file));

        try {
            await application.emojis.create({
                name,
                attachment: `data:image/${type};base64,${data.toString("base64")}`,
            });
            existing.add(name.toLowerCase());
            console.log(`\x1b[32m[EMOJI]\x1b[0m ${name} sent.`);
        } catch (error) {
            console.error(`\x1b[31m[EMOJI]\x1b[0m failed to send ${name}:`, (error as Error).message);
        }
    }
}

export async function getEmojis(client: NtyClient) {
    const emojis = await getApplication(client).emojis.fetch();

    client.appEmojis.clear();
    for (const emoji of emojis.values()) {
        if (emoji.name) client.appEmojis.set(emoji.name, emoji);
    }

    return client.appEmojis;
}