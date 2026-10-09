const isParticipant = (conversation, userId) => {
  return conversation.participants.some(
    (particpant) => particpant.toString() === userId.toString(),
  );
};

const isAdmin = (conversation, userId) => {
  return (
    conversation.groupAdmin.some(
        (admin) => admin.toString() === userId.toString()
    )
  );
};

export { isParticipant, isAdmin };
