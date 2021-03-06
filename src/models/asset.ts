import ID from "utils/id";
import UUID from "utils/uuid";

interface IAsset {
  id: ID;
  userId: ID;
  clientId?: UUID;
  urlMedium: string;
}

const assetSizes = {
  medium: 480
};

export { IAsset, assetSizes };
