const isParticipant = async (conversation, userId) => {
  return conversation.participants.some(
    (particpant) => particpant.toString() === userId.toString(),
  );
};

const isAdmin = (conversation, userId) => {
  return (
    conversation.type === "group" &&
    conversation.groupAdmin.toString() === userId.toString()
  );
};

export { isParticipant, isAdmin };
