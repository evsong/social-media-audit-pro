import type { Platform, Provider } from "./types";
import { InstagramProvider } from "./instagram";
import { TikTokProvider } from "./tiktok";
import { XProvider } from "./x";

export function getProvider(platform: Platform): Provider {
  switch (platform) {
    case "instagram":
      return new InstagramProvider();
    case "tiktok":
      return new TikTokProvider();
    case "x":
      return new XProvider();
  }
}
