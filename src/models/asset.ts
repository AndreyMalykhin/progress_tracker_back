import ID from "utils/id";
import UUID from "utils/uuid";

interface IAsset {
  id: ID;
  clientId?: UUID;
  urlMedium: string;
}

export { IAsset };
