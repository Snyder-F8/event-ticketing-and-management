import banner1 from "../assets/hackathon.png";
import banner2 from "../assets/social.avif";
import banner3 from "../assets/sport.jpg";
import banner4 from "../assets/culture.png";
import food from "../assets/food.jpg";
import jenga from "../assets/jenga.jpg";
import worship from "../assets/worship.jpg";
import bikers from "../assets/bikers.jpg";
import mapenzi from "../assets/mapenzi.jpg";
import tech from "../assets/tech.jpg";
import social from "../assets/social.jpg";
import theatre from "../assets/theatre.jpg";
import kids from "../assets/kids.jpg";
import bus from "../assets/bus.jpeg";
import pulse from "../assets/pulse.jpg";
import goat from "../assets/goat.jpg";
import vibe from "../assets/vibe.jpg";
import play from "../assets/play.jpg";
import sherehe from "../assets/sherehe.jpg";

export const banners = [banner1, banner2, banner3, banner4];

export const event = [
  {
    id: 1,
    title: "Food Festive",
    category: "Social Event",
    rating: 7.2,
    votes: "2.7K",
    img: food,
    promoted: true,
  },
  {
    id: 2,
    title: "Jenga",
    category: "Academic Event",
    rating: 7.3,
    votes: "10.7K",
    img: jenga,
    promoted: true,
  },
  {
    id: 3,
    title: "Kimbilio Worship",
    category: "Cultural Event",
    rating: 8.6,
    votes: "84.1K",
    img: worship,
  },
  {
    id: 4,
    title: "Biker Fest",
    category: "Sports Event",
    rating: 9.5,
    votes: "6.8K",
    img: bikers,
  },
  {
    id: 5,
    title: "Mapenzi Kibandaski",
    category: "Social Event",
    rating: 8.7,
    votes: "15.2K",
    img: mapenzi,
  },
];

export const bestevents = [
  {
    title: "ACADEMIC SUMMITS",
    subtitle: "205+ Events",
    img: tech,
  },
  {
    title: "SOCIAL EVENTS",
    subtitle: "20+ Events",
    img: social,
  },
  {
    title: "CONFERENCE SHOWS",
    subtitle: "80+ Events",
    img: theatre,
  },
  {
    title: "KIDS",
    subtitle: "25+ Events",
    img: kids,
  },
  {
    title: "MOVIES AND THEATER",
    subtitle: "10+ Events",
    img: bus,
  },
];

export const languages = ["English", "Swahili"];

export const allEvents = [
  {
    id: 1,
    title: "Food Festive",
    genre: "Social Event",
    rating: 7.2,
    votes: "2.7K",
    img: food,
    promoted: true,
    languages: "English, Swahili",
    age: "16+",
  },
  {
    id: 2,
    title: "Jenga",
    genre: "Academic Event",
    rating: 7.3,
    votes: "10.7K",
    img: jenga,
    promoted: true,
    languages: "English, Swahili",
    age: "18+",
  },
  {
    id: 3,
    title: "Kimbilio Worship",
    genre: "Cultural Event",
    rating: 8.6,
    votes: "84.1K",
    img: worship,
    languages: "English, Swahili",
    age: "13+",
  },
  {
    id: 4,
    title: "Bikers fest",
    genre: "Sports Event",
    rating: 9.5,
    votes: "6.8K",
    img: bikers,
    languages: "English, Swahili",
    age: "21+",
  },
  {
    id: 5,
    title: "Mapenzi Vibandaski",
    genre: "Social Event",
    rating: 8.7,
    votes: "15.2K",
    img: mapenzi,
    languages: "Swahli",
    age: "21+",
  },
  {
    id: 6,
    title: "Pulse",
    genre: "Social Event",
    rating: 8.4,
    votes: "117",
    img: pulse,
    languages: "English, Swahili",
    age: "21+",
  },
  {
    id: 7,
    title: "Goat Eating",
    genre: "Social Event",
    rating: 6.1,
    votes: "56.3K",
    img: goat,
    languages: "English, Swahili",
    age: "All",
  },
  {
    id: 8,
    title: "Sip Link & vibe",
    genre: "Social Event",
    rating: 8.5,
    votes: "39.6K",
    img: vibe,
    languages: "English, Swahili",
    age: "21+",
  },
  {
    id: 9,
    title: "Play Nation",
    genre: "Kids",
    rating: 9.6,
    votes: "51",
    img: play,
    languages: "English, Swahili",
    age: "ALL",
  },
  {
    id: 10,
    title: "Sherehe Nation",
    genre: "Social Event",
    rating: 7.9,
    votes: "3.7K",
    img: sherehe,
    languages: "English",
    age: "21+",
  },
];

export const tabs = ["Profile", "My Tickets"];

export const ticketsData = [
  {
    id: "TCAKJAB",
    title: "Goat Eating",
    tickets: "Early Bird",
    datetime: "Sat, 18 Apr 2026 | 1PM - 7PM",
    location: "Nairobi",
    quantity: 5,
    bookingTime: "Apr 16 2026 07:46PM",
    paymentMethod: "Mpesa/Credit/Debit Card",
    poster: goat,
    total: 607.1,
    ticket: 495.0,
    fee: 112.1,
  },
  {
    id: "XYCKAJS",
    title: "Sherehe Nation",
    ticket: "VIP",
    datetime: "Fri, 1 May 2026 | 6PM - LATE",
    location: "Kisumu",
    quantity: 3,
    bookingTime: "Apr 25 2026 06:00PM",
    paymentMethod: "Mpesa/Credit/Debit Card",
    poster: sherehe,
    total: 607.1,
    ticket: 495.0,
    fee: 112.1,
  },
];