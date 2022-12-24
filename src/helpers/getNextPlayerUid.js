export const getNextPlayerUid = (playersList, playerUid) => {
  const index = playersList.findIndex((item) => item.uid === playerUid);

  return index === playersList.length - 1
    ? playersList[0].uid
    : playersList[index + 1].uid;
};
