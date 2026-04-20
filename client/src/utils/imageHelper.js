// src/utils/imageHelper.js
import tech from "../assets/tech.jpg";
import social from "../assets/social.jpg";
import sport from "../assets/sport.jpg";
import culture from "../assets/culture.png";
import food from "../assets/food.jpg";
import hackathon from "../assets/hackathon.png";
import theatre from "../assets/theatre.jpg";
import vibe from "../assets/vibe.jpg";
import sherehe from "../assets/sherehe.jpg";
import pulse from "../assets/pulse.jpg";
import worship from "../assets/worship.jpg";
import mapenzi from "../assets/mapenzi.jpg";
import bikers from "../assets/bikers.jpg";
import kids from "../assets/kids.jpg";
import play from "../assets/play.jpg";
import goat from "../assets/goat.jpg";

const ASSET_MAP = {
  "tech.jpg": tech,
  "social.jpg": social,
  "sport.jpg": sport,
  "culture.png": culture,
  "food.jpg": food,
  "hackathon.png": hackathon,
  "theatre.jpg": theatre,
  "vibe.jpg": vibe,
  "sherehe.jpg": sherehe,
  "pulse.jpg": pulse,
  "worship.jpg": worship,
  "mapenzi.jpg": mapenzi,
  "bikers.jpg": bikers,
  "kids.jpg": kids,
  "play.jpg": play,
  "goat.jpg": goat,
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1000";

export const getEventImage = (url) => {
  if (!url) return DEFAULT_IMAGE;
  
  // If it's one of our stub images, return the local asset
  const filename = url.split('/').pop();
  if (ASSET_MAP[filename]) {
    return ASSET_MAP[filename];
  }
  
  return url;
};

export { DEFAULT_IMAGE };
