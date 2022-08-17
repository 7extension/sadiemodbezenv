const { getTicketConfig } = require("@schemas/Message");
const { closeTicket, openTicket } = require("@utils/ticketUtils");

/**
 * @param {import("discord.js").ButtonInteraction} interaction
 */
async function handleTicketOpen(interaction) {
  const config = await getTicketConfig(interaction.guildId, interaction.channelId, interaction.message.id);
  if (!config) return;

  const status = await openTicket(interaction.guild, interaction.user, config.ticket);

  if (status === "MISSING_PERMISSIONS") {
    return interaction.followUp(
      "Cannot create ticket channel, missing `Manage Channel` permission. Contact server manager for help!"
    );
  }

  if (status === "ALREADY_EXISTS") {
    return interaction.followUp(`Masz już otwarty ticket.`);
  }

  if (status === "TOO_MANY_TICKETS") {
    return interaction.followUp("Jest za dużo otwartych ticketów, spróbuj ponownie później.");
  }

  if (status === "FAILED") {
    return interaction.followUp("Wystąpił błąd przy tworzeniu ticketa!");
  }

  await interaction.followUp(`Ticket stworzony! 🔥`);
}

/**
 * @param {import("discord.js").ButtonInteraction} interaction
 */
async function handleTicketClose(interaction) {
  const status = await closeTicket(interaction.channel, interaction.user);
  if (status === "MISSING_PERMISSIONS") {
    return interaction.followUp("Cannot close the ticket, missing permissions. Contact server manager for help!");
  } else if (status == "ERROR") {
    return interaction.followUp("Failed to close the ticket, an error occurred!");
  }
}

module.exports = {
  handleTicketOpen,
  handleTicketClose,
};
