const isParticipant = (conversation, userId) => {
  return conversation.participants.some((participant) => {
    // If populated, participant is a user document → compare participant._id
    // If not populated, participant is an ObjectId → compare participant itself
    const participantId = participant._id ?? participant;
    return participantId.toString() === userId.toString();
  });
};

const isAdmin = (conversation, userId) => {
  return conversation.groupAdmin.some((admin) => {
    const adminId = admin._id ?? admin;
    return adminId.toString() === userId.toString();
  });
};

export { isParticipant, isAdmin };
