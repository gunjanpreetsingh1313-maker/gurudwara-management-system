const Contact = require('../models/Contact');

exports.getContact = async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      contact = await Contact.create({
        address: 'Gurudwara Sahib, Main Road, City - 123456',
        phone: '+91 98765 43210',
        email: 'info@gurudwara.org',
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.0!2d77.0!3d28.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzAwLjAiTiA3N8KwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890',
        bankName: 'State Bank of India',
        accountNumber: '12345678901234',
        ifscCode: 'SBIN0001234',
        upiId: 'gurudwara@upi',
        donationMethods: 'Cash, UPI, Bank Transfer, Online',
      });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateContact = async (req, res) => {
  try {
    let contact = await Contact.findOne();
    const data = { ...req.body };
    if (req.file) data.qrCodeImage = `/uploads/${req.file.filename}`;
    if (!contact) {
      contact = await Contact.create(data);
    } else {
      contact = await Contact.findByIdAndUpdate(contact._id, data, { new: true });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitFeedback = async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) contact = await Contact.create({});
    contact.feedback.push(req.body);
    await contact.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    const contact = await Contact.findOne();
    res.json(contact?.feedback || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
