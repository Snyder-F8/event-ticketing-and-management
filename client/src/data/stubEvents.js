// src/data/stubEvents.js
// Local stub events using images from src/assets
// Used as fallback when API isn't available or for local preview

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

export const stubEvents = [
  {
    id: 1,
    title: "Nairobi Tech Summit 2026",
    description: "Join 2000+ tech professionals for Kenya's biggest technology conference. Featuring keynote speeches, workshops, and networking sessions with industry leaders from across Africa.",
    location: "KICC, Nairobi",
    event_date: "May 15, 2026 at 09:00 AM",
    status: "approved",
    categories: ["Technology"],
    organizer: { id: 1, name: "Tech Kenya" },
    images: [{ id: 1, image_url: tech }],
    ticket_types: [
      { id: 1, name: "Early Bird", price: 1500, quantity: 200, tickets_sold: 120, tickets_remaining: 80, is_sold_out: false },
      { id: 2, name: "Regular", price: 2500, quantity: 500, tickets_sold: 180, tickets_remaining: 320, is_sold_out: false },
      { id: 3, name: "MVP", price: 5000, quantity: 50, tickets_sold: 30, tickets_remaining: 20, is_sold_out: false },
    ],
  },
  {
    id: 2,
    title: "Sherehe Music Festival",
    description: "The ultimate outdoor music experience! Three stages, 40+ artists, food trucks, and an incredible sunset vibe. Genres: Afrobeats, Gengetone, Bongo Flava, Amapiano.",
    location: "Uhuru Gardens, Nairobi",
    event_date: "June 01, 2026 at 02:00 PM",
    status: "approved",
    categories: ["Music"],
    organizer: { id: 2, name: "Sherehe Events" },
    images: [{ id: 2, image_url: sherehe }],
    ticket_types: [
      { id: 4, name: "Regular", price: 2000, quantity: 3000, tickets_sold: 1800, tickets_remaining: 1200, is_sold_out: false },
      { id: 5, name: "MVP", price: 8000, quantity: 200, tickets_sold: 150, tickets_remaining: 50, is_sold_out: false },
    ],
  },
  {
    id: 3,
    title: "Mombasa Sports Gala",
    description: "Annual inter-county sports competition featuring football, rugby, volleyball, and athletics. Come support your county and enjoy a day of thrilling competition!",
    location: "Mombasa Stadium",
    event_date: "May 25, 2026 at 08:00 AM",
    status: "approved",
    categories: ["Sports"],
    organizer: { id: 3, name: "Sports Kenya" },
    images: [{ id: 3, image_url: sport }],
    ticket_types: [
      { id: 6, name: "Regular", price: 500, quantity: 5000, tickets_sold: 2000, tickets_remaining: 3000, is_sold_out: false },
      { id: 7, name: "MVP", price: 2000, quantity: 300, tickets_sold: 150, tickets_remaining: 150, is_sold_out: false },
    ],
  },
  {
    id: 4,
    title: "Cultural Heritage Expo",
    description: "Celebrate Kenya's diverse cultural heritage with traditional dances, art exhibitions, storytelling, and cuisine from all 47 counties.",
    location: "Bomas of Kenya, Nairobi",
    event_date: "July 12, 2026 at 10:00 AM",
    status: "approved",
    categories: ["Art & Culture"],
    organizer: { id: 4, name: "Heritage Foundation" },
    images: [{ id: 4, image_url: culture }],
    ticket_types: [
      { id: 8, name: "Regular", price: 800, quantity: 2000, tickets_sold: 600, tickets_remaining: 1400, is_sold_out: false },
      { id: 9, name: "Early Bird", price: 500, quantity: 500, tickets_sold: 500, tickets_remaining: 0, is_sold_out: true },
    ],
  },
  {
    id: 5,
    title: "Nairobi Food Festival",
    description: "A culinary journey through Kenyan and international cuisines. 50+ food vendors, live cooking demonstrations, wine tastings, and chef competitions.",
    location: "Karura Forest, Nairobi",
    event_date: "June 20, 2026 at 11:00 AM",
    status: "approved",
    categories: ["Food & Drink"],
    organizer: { id: 5, name: "Foodie KE" },
    images: [{ id: 5, image_url: food }],
    ticket_types: [
      { id: 10, name: "Regular", price: 1200, quantity: 1000, tickets_sold: 400, tickets_remaining: 600, is_sold_out: false },
      { id: 11, name: "MVP", price: 3500, quantity: 100, tickets_sold: 60, tickets_remaining: 40, is_sold_out: false },
    ],
  },
  {
    id: 6,
    title: "Hackathon: Build for Africa",
    description: "48-hour hackathon challenging developers, designers, and entrepreneurs to build innovative solutions for Africa's biggest challenges. Prizes worth KES 1M!",
    location: "iHub, Nairobi",
    event_date: "August 05, 2026 at 06:00 PM",
    status: "approved",
    categories: ["Technology"],
    organizer: { id: 6, name: "iHub Kenya" },
    images: [{ id: 6, image_url: hackathon }],
    ticket_types: [
      { id: 12, name: "Regular", price: 0, quantity: 300, tickets_sold: 200, tickets_remaining: 100, is_sold_out: false },
    ],
  },
  {
    id: 7,
    title: "Theatre Night: Sauti",
    description: "An award-winning Swahili play exploring themes of identity, love, and community in modern Nairobi. Original score by local musicians.",
    location: "Kenya National Theatre",
    event_date: "May 30, 2026 at 07:00 PM",
    status: "approved",
    categories: ["Theatre"],
    organizer: { id: 7, name: "Sauti Productions" },
    images: [{ id: 7, image_url: theatre }],
    ticket_types: [
      { id: 13, name: "Regular", price: 1500, quantity: 400, tickets_sold: 350, tickets_remaining: 50, is_sold_out: false },
      { id: 14, name: "MVP", price: 3000, quantity: 50, tickets_sold: 45, tickets_remaining: 5, is_sold_out: false },
    ],
  },
  {
    id: 8,
    title: "Vibez Social Night",
    description: "Monthly social mixer with live DJs, cocktails, and networking. Meet interesting people in a relaxed, premium atmosphere.",
    location: "Alchemist, Nairobi",
    event_date: "May 18, 2026 at 08:00 PM",
    status: "approved",
    categories: ["Music"],
    organizer: { id: 8, name: "Vibez Collective" },
    images: [{ id: 8, image_url: vibe }],
    ticket_types: [
      { id: 15, name: "Regular", price: 1000, quantity: 200, tickets_sold: 80, tickets_remaining: 120, is_sold_out: false },
      { id: 16, name: "MVP", price: 3000, quantity: 30, tickets_sold: 10, tickets_remaining: 20, is_sold_out: false },
    ],
  },
  {
    id: 9,
    title: "Tech Pulse Conference",
    description: "Deep-dive into AI, Blockchain, and Cloud technologies. Hands-on workshops, panel discussions, and startup pitch competitions.",
    location: "Strathmore University, Nairobi",
    event_date: "July 20, 2026 at 09:00 AM",
    status: "approved",
    categories: ["Technology"],
    organizer: { id: 9, name: "Pulse Media" },
    images: [{ id: 9, image_url: pulse }],
    ticket_types: [
      { id: 17, name: "Early Bird", price: 2000, quantity: 150, tickets_sold: 150, tickets_remaining: 0, is_sold_out: true },
      { id: 18, name: "Regular", price: 3500, quantity: 400, tickets_sold: 200, tickets_remaining: 200, is_sold_out: false },
    ],
  },
  {
    id: 10,
    title: "Praise & Worship Concert",
    description: "An evening of praise, worship, and fellowship featuring gospel artists from across East Africa. Open to all faiths.",
    location: "CITAM Valley Road, Nairobi",
    event_date: "June 08, 2026 at 05:00 PM",
    status: "approved",
    categories: ["Music"],
    organizer: { id: 10, name: "Gospel Kenya" },
    images: [{ id: 10, image_url: worship }],
    ticket_types: [
      { id: 19, name: "Regular", price: 500, quantity: 2000, tickets_sold: 1000, tickets_remaining: 1000, is_sold_out: false },
    ],
  },
  {
    id: 11,
    title: "Mapenzi Art Exhibition",
    description: "Contemporary art exhibition exploring the theme of love in African societies. Paintings, sculptures, and multimedia installations by 30+ artists.",
    location: "Nairobi Gallery",
    event_date: "June 15, 2026 at 10:00 AM",
    status: "approved",
    categories: ["Art & Culture"],
    organizer: { id: 11, name: "Art Collective KE" },
    images: [{ id: 11, image_url: mapenzi }],
    ticket_types: [
      { id: 20, name: "Regular", price: 700, quantity: 500, tickets_sold: 200, tickets_remaining: 300, is_sold_out: false },
    ],
  },
  {
    id: 12,
    title: "Bikers Rally Nairobi",
    description: "Annual motorcycle rally through Nairobi's scenic routes. Join hundreds of bikers for a thrilling ride, live music, and BBQ at the finish line.",
    location: "Ngong Hills, Nairobi",
    event_date: "August 15, 2026 at 07:00 AM",
    status: "approved",
    categories: ["Sports"],
    organizer: { id: 12, name: "Kenya Bikers" },
    images: [{ id: 12, image_url: bikers }],
    ticket_types: [
      { id: 21, name: "Regular", price: 1500, quantity: 300, tickets_sold: 100, tickets_remaining: 200, is_sold_out: false },
    ],
  },
  {
    id: 13,
    title: "Community Social Meetup",
    description: "A community gathering focused on building connections, sharing ideas, and fostering collaboration in the local developer community.",
    location: "The Hub Karen, Nairobi",
    event_date: "May 22, 2026 at 04:00 PM",
    status: "approved",
    categories: ["Education"],
    organizer: { id: 13, name: "Dev Community KE" },
    images: [{ id: 13, image_url: social }],
    ticket_types: [
      { id: 22, name: "Regular", price: 0, quantity: 100, tickets_sold: 45, tickets_remaining: 55, is_sold_out: false },
    ],
  },
  {
    id: 14,
    title: "Kids Fun Day",
    description: "A fun-filled day for children with bouncing castles, face painting, talent shows, games, and healthy snacks. Ages 3-12.",
    location: "Uhuru Park, Nairobi",
    event_date: "June 28, 2026 at 10:00 AM",
    status: "approved",
    categories: ["Food & Drink"],
    organizer: { id: 14, name: "Happy Kids KE" },
    images: [{ id: 14, image_url: kids }],
    ticket_types: [
      { id: 23, name: "Regular", price: 300, quantity: 500, tickets_sold: 250, tickets_remaining: 250, is_sold_out: false },
    ],
  },
  {
    id: 15,
    title: "Outdoor Play Festival",
    description: "Interactive outdoor performances, live theatre, poetry, and spoken word under the stars. Bring a blanket and enjoy the show!",
    location: "Nairobi Arboretum",
    event_date: "July 05, 2026 at 04:00 PM",
    status: "approved",
    categories: ["Theatre"],
    organizer: { id: 15, name: "Play KE" },
    images: [{ id: 15, image_url: play }],
    ticket_types: [
      { id: 24, name: "Regular", price: 1000, quantity: 300, tickets_sold: 120, tickets_remaining: 180, is_sold_out: false },
      { id: 25, name: "MVP", price: 2500, quantity: 50, tickets_sold: 20, tickets_remaining: 30, is_sold_out: false },
    ],
  },
  {
    id: 16,
    title: "Goat Derby Festival",
    description: "The iconic goat racing event returns! Exciting races, local cuisine, crafts market, and live entertainment for the whole family.",
    location: "Lamu Island",
    event_date: "August 28, 2026 at 09:00 AM",
    status: "approved",
    categories: ["Sports"],
    organizer: { id: 16, name: "Lamu Cultural" },
    images: [{ id: 16, image_url: goat }],
    ticket_types: [
      { id: 26, name: "Regular", price: 800, quantity: 1000, tickets_sold: 300, tickets_remaining: 700, is_sold_out: false },
    ],
  },
];

export const stubCategories = [
  "Music", "Technology", "Sports", "Art & Culture", "Food & Drink", "Theatre", "Education"
];

export function getStubEvent(id) {
  return stubEvents.find((e) => e.id === parseInt(id));
}

export function filterStubEvents({ search, location, category, page = 1, perPage = 9 }) {
  let filtered = [...stubEvents];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
    );
  }
  if (location) {
    const loc = location.toLowerCase();
    filtered = filtered.filter((e) => e.location.toLowerCase().includes(loc));
  }
  if (category && category !== "All") {
    filtered = filtered.filter((e) =>
      e.categories.some((c) => c.toLowerCase().includes(category.toLowerCase()))
    );
  }

  const total = filtered.length;
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  return {
    events: paginated,
    pagination: {
      page,
      per_page: perPage,
      total_pages: Math.ceil(total / perPage),
      total_items: total,
      has_next: start + perPage < total,
      has_prev: page > 1,
    },
  };
}
