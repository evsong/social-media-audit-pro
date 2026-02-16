import type { Platform, Provider } from "./types";
import { InstagramProvider } from "./instagram";
import { TikTokProvider } from "./tiktok";
import { XProvider } from "./x";
import { MockProvider } from "./mock";

export function getProvider(platform: Platform): Provider {
  switch (platform) {
    case "instagram":
      return process.env.RAPIDAPI_KEY ? new InstagramProvider() : new MockProvider(platform);
    case "tiktok":
      return process.env.RAPIDAPI_KEY ? new TikTokProvider() : new MockProvider(platform);
    case "x":
      return process.env.TWEETAPI_KEY ? new XProvider() : new MockProvider(platform);
  }
}
