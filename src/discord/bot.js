require("dotenv").config();
const { Client, GatewayIntentBits, Events } = require("discord.js");
const bcrypt = require("bcryptjs");
const { User, Service, sequelize } = require("../models");
const logger = require("../config/logger");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, async (c) => {
  logger.info(`Discord bot ready: ${c.user.tag}`);

  // Sync DB when bot starts
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    logger.info("Database synced via bot.");
  } catch (err) {
    logger.error("DB sync failed:", err);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  // ─── /ppcreateuser ────────────────────────────────────────
  if (commandName === "ppcreateuser") {
    await interaction.deferReply({ ephemeral: true });

    const username = interaction.options.getString("username");
    const email = interaction.options.getString("email");
    const password = interaction.options.getString("password");

    try {
      const exists = await User.findOne({ where: { username } });
      if (exists) {
        return interaction.editReply(
          `❌ Username **${username}** already exists.`,
        );
      }

      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return interaction.editReply(
          `❌ Email **${email}** is already registered.`,
        );
      }

      const salt = await bcrypt.genSalt(12);
      const hashed = await bcrypt.hash(password, salt);

      const user = await User.create({ username, email, password: hashed });

      return interaction.editReply(
        `✅ User created!\n` +
          `**ID:** ${user.id}\n` +
          `**Username:** ${user.username}\n` +
          `**Email:** ${user.email}\n` +
          `**Role:** ${user.role}`,
      );
    } catch (err) {
      logger.error("/ppcreateuser error:", err);
      return interaction.editReply(`❌ Error: ${err.message}`);
    }
  }

  // ─── /ppcreateservice ─────────────────────────────────────
  if (commandName === "ppcreateservice") {
    await interaction.deferReply({ ephemeral: true });

    const name = interaction.options.getString("name");
    const description = interaction.options.getString("description") || null;
    const status = interaction.options.getString("status") || "active";

    try {
      const service = await Service.create({ name, description, status });

      return interaction.editReply(
        `✅ Service created!\n` +
          `**ID:** ${service.id}\n` +
          `**Name:** ${service.name}\n` +
          `**Status:** ${service.status}\n` +
          `**Description:** ${service.description || "N/A"}`,
      );
    } catch (err) {
      logger.error("/ppcreateservice error:", err);
      return interaction.editReply(`❌ Error: ${err.message}`);
    }
  }

  // ─── /ppgetuser ───────────────────────────────────────────
  if (commandName === "ppgetuser") {
    await interaction.deferReply({ ephemeral: true });

    const username = interaction.options.getString("username");

    try {
      const user = await User.findOne({
        where: { username },
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return interaction.editReply(
          `❌ No user found with username **${username}**.`,
        );
      }

      return interaction.editReply(
        `👤 User Found!\n` +
          `**ID:** ${user.id}\n` +
          `**Username:** ${user.username}\n` +
          `**Email:** ${user.email}\n` +
          `**Role:** ${user.role}\n` +
          `**Active:** ${user.isActive ? "Yes" : "No"}\n` +
          `**Joined:** ${new Date(user.createdAt).toDateString()}`,
      );
    } catch (err) {
      logger.error("/ppgetuser error:", err);
      return interaction.editReply(`❌ Error: ${err.message}`);
    }
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === "hi") {
    message.reply("Hello 👋");
  }

  if (message.content.toLowerCase() === "help") {
    message.reply("Use /ppcreateuser or /ppgetuser commands.");
  }
});

client.login(process.env.DISCORD_TOKEN);

module.exports = client;
