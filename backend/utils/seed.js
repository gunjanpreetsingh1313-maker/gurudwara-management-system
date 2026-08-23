require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const History = require('../models/History');
const Contact = require('../models/Contact');
const Hukamnama = require('../models/Hukamnama');
const Announcement = require('../models/Announcement');
const Committee = require('../models/Committee');
const Event = require('../models/Event');
const Budget = require('../models/Budget');
const Income = require('../models/Income');
const Expense = require('../models/Expense');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await History.deleteMany({});
  await Contact.deleteMany({});
  await Hukamnama.deleteMany({});
  await Announcement.deleteMany({});
  await Committee.deleteMany({});
  await Event.deleteMany({});
  await Budget.deleteMany({});
  await Income.deleteMany({});
  await Expense.deleteMany({});

  await User.create({
    name: 'Admin',
    email: 'admin@gurudwara.org',
    password: 'admin123',
    role: 'admin',
    phone: '+91 98765 43210',
  });

  await History.create({
    establishmentDate: '1985',
    founder: {
      name: 'Sangat (Community)',
      description: 'Founded by the devoted Sikh community with the vision of creating a spiritual center for worship, langar seva, and community gatherings.',
    },
    history: `The Gurudwara was established in 1985 by the local Sikh sangat who envisioned a sacred space where devotees could gather for daily prayers, kirtan, and langar seva. Over the decades, it has grown from a small prayer hall to a magnificent structure serving thousands of devotees.

The Gurudwara has been a beacon of hope and service, providing free langar to all visitors regardless of caste, creed, or religion. During times of crisis, the Gurudwara has organized blood donation camps, relief efforts, and educational programs for youth.`,
    mission: 'To spread the teachings of Guru Granth Sahib Ji and serve humanity through selfless service (seva), equality, and compassion.',
    vision: 'To be a leading spiritual center that nurtures Sikh values, promotes interfaith harmony, and empowers the community through education and seva.',
    timeline: [
      { year: '1985', title: 'Establishment', description: 'Gurudwara founded by local Sikh community' },
      { year: '1995', title: 'Main Building', description: 'Construction of the main prayer hall completed' },
      { year: '2005', title: 'Langar Hall Expansion', description: 'Expanded langar facilities to serve 1000+ daily' },
      { year: '2015', title: 'Youth Center', description: 'Opened Gurmat education center for children' },
      { year: '2020', title: 'Digital Initiatives', description: 'Launched online services and live kirtan streaming' },
    ],
    photos: [],
    videos: [],
  });

  await Contact.create({
    address: 'Gurudwara Sahib, Main Road, Sector 15, City - 123456, Punjab, India',
    phone: '+91 98765 43210',
    email: 'info@gurudwara.org',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.0!2d77.0!3d28.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzAwLjAiTiA3N8KwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890',
    bankName: 'State Bank of India',
    accountNumber: '12345678901234',
    ifscCode: 'SBIN0001234',
    upiId: 'gurudwara@upi',
    donationMethods: 'You can donate via Cash, UPI, Bank Transfer, or Online payment. All donations are used for langar seva, building maintenance, and religious programs.',
  });

  await Hukamnama.create({
    date: new Date(),
    gurmukhi: 'ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ ॥',
    translation: 'One Universal Creator God. Truth Is The Name. Creative Being Personified. No Fear. No Hatred. Image Of The Undying, Beyond Birth, Self-Existent. By Guru\'s Grace.',
    ang: 'Ang 1',
  });

  await Announcement.create([
    { title: 'Gurpurab Celebration', content: 'Join us for the upcoming Gurpurab celebration on the 15th. Kirtan darbar and langar seva will be organized.', priority: 'high' },
    { title: 'Weekly Kirtan Program', content: 'Every Sunday at 6:00 AM - Asa Di Var Kirtan followed by langar.', priority: 'medium' },
    { title: 'Blood Donation Camp', content: 'Blood donation camp on 20th of this month. Register at the Gurudwara office.', priority: 'high' },
  ]);

  await Committee.create([
    { name: 'Bhai Harpreet Singh', position: 'President', contact: '+91 98765 43211', email: 'president@gurudwara.org', duration: '2023-2025', order: 1 },
    { name: 'Bibi Manpreet Kaur', position: 'Secretary', contact: '+91 98765 43212', email: 'secretary@gurudwara.org', duration: '2023-2025', order: 2 },
    { name: 'Bhai Gurpreet Singh', position: 'Treasurer', contact: '+91 98765 43213', email: 'treasurer@gurudwara.org', duration: '2023-2025', order: 3 },
    { name: 'Bhai Jaspreet Singh', position: 'Granthi', contact: '+91 98765 43214', email: 'granthi@gurudwara.org', duration: '2022-2026', order: 4 },
  ]);

  const futureDate = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
  };

  await Event.create([
    { title: 'Guru Nanak Dev Ji Gurpurab', type: 'Gurpurab', date: futureDate(30), time: '4:00 AM - 10:00 PM', description: 'Akhand Path Sahib followed by Kirtan Darbar and Langar.' },
    { title: 'Weekly Kirtan Darbar', type: 'Kirtan', date: futureDate(7), time: '6:00 PM - 8:00 PM', description: 'Special Kirtan by renowned Raagis.' },
    { title: 'Langar Seva', type: 'Langar Seva', date: futureDate(3), time: '8:00 AM - 2:00 PM', description: 'Community langar seva. All are welcome to participate.' },
    { title: 'Youth Gurmat Camp', type: 'Youth Camp', date: futureDate(45), time: '9:00 AM - 5:00 PM', description: 'Three-day camp for youth aged 12-25.' },
  ]);

  const now = new Date();
  await Budget.create({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    totalBudget: 200000,
    expectedIncome: 250000,
    expectedExpenses: 180000,
    savingTarget: 70000,
  });

  const sampleIncomes = [
    { amount: 50000, category: 'Donations', donorName: 'Anonymous', paymentMode: 'Cash', description: 'Sunday donations' },
    { amount: 25000, category: 'Dasvandh', donorName: 'Bhai Simran Singh', paymentMode: 'UPI' },
    { amount: 15000, category: 'Langar Donation', paymentMode: 'Bank Transfer' },
    { amount: 10000, category: 'Online Donation', paymentMode: 'Online' },
  ];
  for (const inc of sampleIncomes) {
    await Income.create({ ...inc, date: new Date(now.getFullYear(), now.getMonth(), Math.floor(Math.random() * 28) + 1) });
  }

  const sampleExpenses = [
    { amount: 35000, category: 'Langar', vendor: 'Local Market', description: 'Monthly groceries' },
    { amount: 12000, category: 'Electricity', vendor: 'PSPCL', description: 'Electricity bill' },
    { amount: 8000, category: 'Water', vendor: 'Municipal Corp', description: 'Water charges' },
    { amount: 25000, category: 'Salary', vendor: 'Staff', description: 'Staff salaries' },
    { amount: 5000, category: 'Cleaning', vendor: 'Clean Services', description: 'Monthly cleaning' },
  ];
  for (const exp of sampleExpenses) {
    await Expense.create({ ...exp, date: new Date(now.getFullYear(), now.getMonth(), Math.floor(Math.random() * 28) + 1) });
  }

  console.log('Database seeded successfully!');
  console.log('Admin login: admin@gurudwara.org / admin123');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
