import ID from "utils/id";
import UUID from "utils/uuid";

interface IAvatar {
  id: ID;
  clientId?: UUID;
  urlSmall: string;
  urlMedium: string;
}

export { IAvatar };
