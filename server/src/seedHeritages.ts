import mongoose from "mongoose";
import connectDB from "./config/db.js";
import { Heritage } from "./models/Heritage.js";

const heritages = [
  {
    name: "Rock-Hewn Churches, Lalibela",
    description: "Eleven medieval monolithic cave churches of this 13th-century 'New Jerusalem' are situated in a mountainous region in the heart of Ethiopia near a traditional village with circular-shaped dwellings.",
    history: "Built by King Lalibela in the 12th and 13th centuries, these churches were carved out of solid rock to create a new Jerusalem for those who could not make the pilgrimage to the Holy Land.",
    location: "Amhara Region, Lasta",
    coordinates: { lat: 12.0319, lng: 39.0411 },
    image: "/images/lalibela.png",
    isUnesco: true,
    category: "Historical"
  },
  {
    name: "Fasil Ghebbi, Gondar Region",
    description: "The fortress-city of Fasil Ghebbi was the residence of the Ethiopian emperor Fasilides and his successors in the 16th and 17th centuries. Surrounded by a 900-m-long wall, the city contains palaces, churches, monasteries and unique public and private buildings.",
    history: "Founded by Emperor Fasilides in 1636, it served as the capital of the Ethiopian Empire for over two centuries, blending Hindu, Arab, and Jesuit architectural influences.",
    location: "Amhara Region, Gondar",
    coordinates: { lat: 12.6080, lng: 37.4696 },
    image: "/images/gondar.png",
    isUnesco: true,
    category: "Historical"
  },
  {
    name: "Aksum",
    description: "The ruins of the ancient city of Aksum are found close to Ethiopia's northern border. They mark the location of the heart of ancient Ethiopia, when the Kingdom of Aksum was the most powerful state between the Eastern Roman Empire and Persia.",
    history: "The massive ruins, dating from between the 1st and the 13th century A.D., include monolithic obelisks, giant stelae, royal tombs and the ruins of ancient castles.",
    location: "Tigray Region",
    coordinates: { lat: 14.1308, lng: 38.7156 },
    image: "/images/aksum.png",
    isUnesco: true,
    category: "Archaeological"
  },
  {
    name: "Simien National Park",
    description: "Massive erosion over the years on the Ethiopian plateau has created one of the most spectacular landscapes in the world, with jagged mountain peaks, deep valleys and sharp precipices dropping some 1,500 m.",
    history: "Established in 1969, the park is home to extremely rare animals such as the Gelada baboon, the Simien fox and the Walia ibex, a goat found nowhere else in the world.",
    location: "Amhara Region",
    coordinates: { lat: 13.1793, lng: 38.0772 },
    image: "/images/simien.png",
    isUnesco: true,
    category: "Natural"
  },
  {
    name: "Harar Jugol, the Fortified Historic Town",
    description: "The fortified historic town of Harar is located in the eastern part of the country on a plateau with deep gorges surrounded by deserts and savannah. The walls surrounding this sacred Muslim city were built between the 13th and 16th centuries.",
    history: "Harar Jugol, said to be the fourth holiest city of Islam, numbers 82 mosques, three of which date from the 10th century, and 102 shrines.",
    location: "Harari Region",
    coordinates: { lat: 9.3106, lng: 42.1278 },
    image: "/images/harar.png",
    isUnesco: true,
    category: "Cultural"
  }
];

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing heritages
    await Heritage.deleteMany({});
    console.log("Cleared existing heritages.");

    // Insert new ones
    await Heritage.insertMany(heritages);
    console.log("Successfully seeded UNESCO Heritages!");

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
