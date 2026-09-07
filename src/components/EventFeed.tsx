import React from 'react';
import { FeedItem } from '../types';

interface EventFeedProps {
  feed: FeedItem[];
}

// Feed textual/event notifications are intentionally hidden from the arena UI.
// The game can continue generating feed items internally without displaying them.
export const EventFeed: React.FC<EventFeedProps> = (_props) => null;
