import Audience from "models/audience";

const audienceResolver = {
  Friends: Audience.Friends,
  Global: Audience.Global,
  Me: Audience.Me
};

export default audienceResolver;
