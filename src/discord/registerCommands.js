require("dotenv").config();
const { REST, Routes, SlashCommandBuilder } = require("discord.js");

console.log("TOKEN:", process.env.DISCORD_TOKEN?.slice(0, 10));
console.log("CLIENT_ID:", process.env.DISCORD_CLIENT_ID);
console.log("GUILD_ID:", process.env.DISCORD_GUILD_ID);

const commands = [
  new SlashCommandBuilder()
    .setName("ppcreateuser")
    .setDescription("Create a new user in VyomXpress")
    .addStringOption((opt) =>
      opt.setName("username").setDescription("Unique username").setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("email").setDescription("User email address").setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("password").setDescription("User password (min 8 chars)").setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("ppcreateservice")
    .setDescription("Create a new service in VyomXpress")
    .addStringOption((opt) =>
      opt.setName("name").setDescription("Service name").setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("description").setDescription("Service description").setRequired(false)
    )
    .addStringOption((opt) =>
      opt.setName("status")
        .setDescription("Service status")
        .setRequired(false)
        .addChoices(
          { name: "Active", value: "active" },
          { name: "Inactive", value: "inactive" },
          { name: "Maintenance", value: "maintenance" }
        )
    ),

  new SlashCommandBuilder()
    .setName("ppgetuser")
    .setDescription("Look up a VyomXpress user by username")
    .addStringOption((opt) =>
      opt.setName("username").setDescription("Username to search").setRequired(true)
    ),
].map((cmd) => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Registering slash commands...");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_GUILD_ID
      ),
      { body: commands }
    );
    console.log("✅ Slash commands registered successfully.");
  } catch (err) {
    console.error("❌ Failed to register commands:", err);
  }
})();
