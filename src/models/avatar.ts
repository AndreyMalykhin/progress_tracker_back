import ID from "utils/id";
import UUID from "utils/uuid";

interface IAvatar {
  id: ID;
  userId?: ID;
  clientId?: UUID;
  urlSmall: string;
  urlMedium: string;
}

const defaultAvatarId = "1";

export { IAvatar, defaultAvatarId };
