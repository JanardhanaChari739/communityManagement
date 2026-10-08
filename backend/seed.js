const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const sampleEvents = [
  // ==================== PAST EVENTS (7) ====================
  {
    title: 'React & Vite Developer Summit 2025',
    description: 'A deep-dive workshop exploring fast bundling, server components, and modern frontend architectures.',
    category: 'Technology',
    date: new Date('2025-08-15T10:00:00.000Z'),
    time: '10:00 AM',
    location: 'Tech Hub Auditorium, Hall B',
    capacity: 80,
    participants: []
  },
  {
    title: 'Autumn Acoustic Music Evening',
    description: 'An intimate outdoor indie acoustic performance featuring upcoming local songwriters and bands.',
    category: 'Arts & Culture',
    date: new Date('2025-10-18T18:30:00.000Z'),
    time: '06:30 PM',
    location: 'Amphitheatre, Botanical Gardens',
    capacity: 60,
    participants: []
  },
  {
    title: 'Winter Warmth Clothes Donation Drive',
    description: 'Community-wide initiative collecting and distributing winter blankets and clothing to shelter homes.',
    category: 'Volunteering',
    date: new Date('2025-12-05T09:00:00.000Z'),
    time: '09:00 AM',
    location: 'Community Hall, Sector 12',
    capacity: 50,
    participants: []
  },
  {
    title: 'New Year Hackathon 2026',
    description: 'A 24-hour sprint prototyping practical solutions for urban sustainability and digital healthcare.',
    category: 'Technology',
    date: new Date('2026-01-20T08:00:00.000Z'),
    time: '08:00 AM',
    location: 'Innovate Campus, Lab 3',
    capacity: 100,
    participants: []
  },
  {
    title: 'Spring Community Tree Plantation Drive',
    description: 'Neighborhood greenery initiative that planted over 200 native saplings across city residential blocks.',
    category: 'Volunteering',
    date: new Date('2026-03-20T07:30:00.000Z'),
    time: '07:30 AM',
    location: 'City Green Belt, Sector 4',
    capacity: 50,
    participants: []
  },
  {
    title: 'Summer Youth Badminton Championship',
    description: 'Inter-district badminton tournament featuring singles and doubles knockouts for junior players.',
    category: 'Sports',
    date: new Date('2026-06-14T09:00:00.000Z'),
    time: '09:00 AM',
    location: 'Metro Indoor Stadium, Court 1',
    capacity: 32,
    participants: []
  },
  {
    title: 'Ceramics & Pottery Starter Workshop',
    description: 'Hands-on beginners studio session learning clay preparation, wheel throwing, and basic glazing.',
    category: 'Arts & Culture',
    date: new Date('2026-08-22T14:00:00.000Z'),
    time: '02:00 PM',
    location: 'Mud & Fire Studio, Art District',
    capacity: 15,
    participants: []
  },

  // ==================== UPCOMING EVENTS (8) ====================
  {
    title: 'Full-Stack MERN Masterclass',
    description: 'Learn how to build, test, and deploy production-ready full-stack applications with React, Express, and MongoDB.',
    category: 'Technology',
    date: new Date('2026-11-12T14:30:00.000Z'),
    time: '02:30 PM',
    location: 'Online via Zoom',
    capacity: 100,
    participants: []
  },
  {
    title: '5-a-Side Amateur Football League',
    description: 'Weekend turf cup for amateur and corporate teams. Trophies, medals, and refreshments provided.',
    category: 'Sports',
    date: new Date('2026-11-22T16:00:00.000Z'),
    time: '04:00 PM',
    location: 'Urban Sports Arena, Turf 2',
    capacity: 24,
    participants: []
  },
  {
    title: 'Riverside Plastic Clean-up Campaign',
    description: 'Join volunteers to clean single-use plastics along the central river bank and sort recyclables.',
    category: 'Volunteering',
    date: new Date('2026-11-29T07:00:00.000Z'),
    time: '07:00 AM',
    location: 'Riverfront Promenade, Pier 3',
    capacity: 75,
    participants: []
  },
  {
    title: 'Design Systems & UI/UX Workshop',
    description: 'Hands-on training creating design tokens in Figma and synchronizing them directly into React components.',
    category: 'Technology',
    date: new Date('2026-12-08T11:00:00.000Z'),
    time: '11:00 AM',
    location: 'WeWork Innovation Lounge, Floor 4',
    capacity: 40,
    participants: []
  },
  {
    title: 'Community Food Bank Packing Day',
    description: 'Help assemble and sort nutrition grocery packets for underserved families ahead of the holidays.',
    category: 'Volunteering',
    date: new Date('2026-12-19T10:00:00.000Z'),
    time: '10:00 AM',
    location: 'Hope Distribution Center',
    capacity: 35,
    participants: []
  },
  {
    title: 'New Year Tech & Startup Mixer 2027',
    description: 'Informal networking and pitch showcase for local founders, engineers, and early-stage product builders.',
    category: 'Business',
    date: new Date('2027-01-16T18:00:00.000Z'),
    time: '06:00 PM',
    location: 'Third Wave Coffee, Tech Park',
    capacity: 50,
    participants: []
  },
  {
    title: 'City Marathon & 10K Run 2027',
    description: 'Annual timed morning run supporting healthy community living. Chip-timed with hydration points.',
    category: 'Sports',
    date: new Date('2027-02-07T05:30:00.000Z'),
    time: '05:30 AM',
    location: 'City Sports Complex, Track 1',
    capacity: 250,
    participants: []
  },
  {
    title: 'AI in Web Development Panel',
    description: 'Industry engineering leads discussing LLM integrations, automated code reviews, and developer workflows.',
    category: 'Technology',
    date: new Date('2027-03-12T15:00:00.000Z'),
    time: '03:00 PM',
    location: 'National Library Auditorium',
    capacity: 120,
    participants: []
  }
];

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas for seeding...');

    const db = mongoose.connection.db;

    // Reset collection to clean state
    await db.collection('events').deleteMany({});
    console.log('🧹 Cleared existing event documents.');

    // Seed 15 events
    const result = await db.collection('events').insertMany(sampleEvents);
    console.log(`🎉 Successfully inserted ${result.insertedCount} events into the 'events' collection!`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from Atlas. Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedData();