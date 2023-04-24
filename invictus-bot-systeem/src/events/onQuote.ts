import type { ArgsOf, Client } from "discordx";
import { Discord, On } from "discordx";

@Discord()
export class OnQuote {
  @On({ event: 'messageCreate' })
  messageCreate([message]: ArgsOf<"messageDelete">, client: Client): void {
    console.log("Message Deleted", client.user?.username, message.content);
  }

  @On({ event: 'messageReactionAdd' })
  messageReactionAdd([message]: ArgsOf<"messageReactionAdd">, client: Client): void {
    console.log("Message Reaction Added", client.user?.username, message.emoji.name);
  }

  @On({ event: 'messageReactionRemove' })
  messageReactionRemove([message]: ArgsOf<"messageReactionRemove">, client: Client): void {
    console.log("Message Reaction removed", client.user?.username, message.emoji.name);
  }

  @On({ event: 'messageUpdate' })
  messageUpdate([message]: ArgsOf<"messageUpdate">, client: Client): void {
    console.log("Message Updated", client.user?.username, message.cleanContent);
  }
}
