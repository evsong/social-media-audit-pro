# Data Providers

## ADDED Requirements

### Requirement: REQ-DP-001 Instagram Profile Fetcher

The system SHALL fetch public Instagram profile data via RapidAPI Glavier (instagram191) given a username.

**Input:** Instagram username (string, without @)
**Output:** ProfileData { username, displayName, avatar, bio, followers, following, posts, isVerified, externalUrl }

#### Scenario: Fetch valid Instagram profile
- Given username "nike"
- When fetchProfile("instagram", "nike") is called
- Then return ProfileData with followers > 0 and all fields populated

#### Scenario: Fetch non-existent Instagram profile
- Given username "thisuserdoesnotexist99999"
- When fetchProfile("instagram", "thisuserdoesnotexist99999") is called
- Then throw ProfileNotFoundError

### Requirement: REQ-DP-002 Instagram Posts Fetcher

The system SHALL fetch the 12 most recent posts with engagement metrics for a given Instagram username.

**Output:** PostData[] { id, type (image|video|reel|carousel), likes, comments, timestamp, caption, hashtags }

#### Scenario: Fetch recent posts
- Given username "nike"
- When fetchPosts("instagram", "nike", 12) is called
- Then return array of up to 12 PostData objects sorted by timestamp desc

### Requirement: REQ-DP-003 TikTok Profile Fetcher

The system SHALL fetch public TikTok profile data via RapidAPI Lundehund (tiktok-api23).

**Output:** ProfileData { username, displayName, avatar, bio, followers, following, likes, videos, isVerified }

#### Scenario: Fetch valid TikTok profile
- Given username "nike"
- When fetchProfile("tiktok", "nike") is called
- Then return ProfileData with followers > 0

### Requirement: REQ-DP-004 TikTok Videos Fetcher

The system SHALL fetch the 12 most recent videos with engagement metrics.

**Output:** PostData[] { id, type ("video"), views, likes, comments, shares, saves, timestamp, caption, hashtags }

#### Scenario: Fetch recent TikTok videos
- Given username "nike"
- When fetchPosts("tiktok", "nike", 12) is called
- Then return array of up to 12 PostData with views > 0

### Requirement: REQ-DP-005 X Twitter Profile Fetcher

The system SHALL fetch public X profile data via official v2 API.

**Output:** ProfileData { username, displayName, avatar, bio, followers, following, tweets, isVerified, pinnedTweet }

#### Scenario: Fetch valid X profile
- Given username "nike"
- When fetchProfile("x", "nike") is called
- Then return ProfileData with followers > 0

### Requirement: REQ-DP-006 X Twitter Tweets Fetcher

The system SHALL fetch the 12 most recent tweets with public_metrics.

**Output:** PostData[] { id, type (text|image|video|thread), likes, replies, retweets, quotes, bookmarks, impressions, timestamp, hashtags }

#### Scenario: Fetch recent tweets
- Given username "nike"
- When fetchPosts("x", "nike", 12) is called
- Then return array of up to 12 PostData

### Requirement: REQ-DP-007 Unified Provider Interface

All providers SHALL implement a common interface:
- fetchProfile(platform, username): Promise<ProfileData>
- fetchPosts(platform, username, limit): Promise<PostData[]>

#### Scenario: Provider factory returns correct provider
- Given platform "instagram"
- When getProvider("instagram") is called
- Then return InstagramProvider instance
