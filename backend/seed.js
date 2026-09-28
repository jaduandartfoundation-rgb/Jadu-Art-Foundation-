const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const AdminUser = require('./models/AdminUser');
const Campaign = require('./models/Campaign');
const Story = require('./models/Story');
const GalleryItem = require('./models/GalleryItem');
const ImpactMetric = require('./models/ImpactMetric');
const DonationInitiative = require('./models/DonationInitiative');
const { Work, WorkCategory } = require('./models/Work');
const TeamMember = require('./models/TeamMember');
const Document = require('./models/Document');
const SiteContent = require('./models/SiteContent');
const SiteSettings = require('./models/SiteSettings');

const seedData = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/jadu_art';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for seeding...');

    // 1. Admin User
    await AdminUser.deleteMany({ email: 'admin@jaduart.org' });
    const passwordHash = await bcrypt.hash('admin123', 10);
    await AdminUser.create({
      name: 'Jadu & Art Super Admin',
      email: 'admin@jaduart.org',
      passwordHash,
      role: 'super_admin',
      active: true
    });
    console.log('Super Admin user created: admin@jaduart.org / admin123');

    // 2. Site Settings
    await SiteSettings.deleteMany({});
    await SiteSettings.create({
      foundationName: 'Jadu & Art Foundation',
      logo: '/logo.svg',
      favicon: '/favicon.svg',
      officialEmail: 'jaduandartfoundation@gmail.com',
      primaryGreen: '#006B3C',
      darkTeal: '#063F36',
      orange: '#F47B20',
      gold: '#C99020',
      background: '#FFFFFF',
      creamBackground: '#FBF8F1',
      textPrimary: '#17201D',
      textSecondary: '#5F6B66',
      border: '#E4E9E5',
      tagline: 'Spiritual Values | Social Impact | A Brighter India',
      hindiTagline: 'Seva • Sanskar • Samriddh Bharat',
      defaultLanguage: 'en',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      maintenanceMode: false,
      donationPopup: {
        enabled: true,
        title: 'DONATE NOW',
        hindiTitle: 'आपका सहयोग महत्वपूर्ण है',
        description: 'Your contribution can help us continue serving people, communities and animals in need.',
        image: 'https://images.pexels.com/photos/14260022/pexels-photo-14260022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        buttonText: 'DONATE NOW',
        delay: 10000,
        cooldown: 604800000,
        defaultAmount: 1000
      }
    });
    console.log('Site settings seeded.');

    // 3. Site Content (Homepage, About, Contact, Footer, SEO, Section Visibility, Founder Content)
    await SiteContent.deleteMany({});
    
    // Homepage content
    await SiteContent.create({
      key: 'homepage',
      data: {
        heroBadge: 'Seva • Sanskar • Samriddh Bharat',
        heroTitle: 'Creating Change.',
        heroTitleHighlight: 'One Life at a Time.',
        heroHindiText: 'सेवा, संस्कार और मानवता के साथ एक बेहतर भारत की ओर।',
        heroDescription: 'Jadu & Art Foundation works towards the welfare of people, communities and animals through education, healthcare, cow welfare and humanitarian support.',
        heroImage: 'https://images.pexels.com/photos/14260022/pexels-photo-14260022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        heroCtaText: 'DONATE NOW',
        heroCtaLink: '/donate',
        secondaryCtaText: 'OUR WORK',
        secondaryCtaLink: '/our-work',

        // Founder's Message & Official Content
        founderName: 'Founder',
        founderImage: '', // Managed through Cloudinary
        founderMessageTitle: "FOUNDER'S MESSAGE",
        founderMessageHindiTitle: 'संस्थापक का संदेश',
        founderGreeting: 'पृथ्वी के सभी प्राणियों को मेरा सादर प्रणाम.... आपका हृदय से स्वागत है हमारे फाउंडेशन Jadu & Art Foundation में...',
        founderP1: 'ईश्वरीय शक्ति, माता-पिता और गुरुजनों की कृपा से जीवन जो मिला है, उसमें आत्मा है और आत्मा के लिए ध्यान करना बहुत जरूरी है।',
        founderP2: 'शरीर को साबुन से धोया जा सकता है, परन्तु आत्मा की सफाई केवल ध्यान से संभव है। ध्यान से आध्यात्मिकता, शांति और ऊर्जा प्राप्त होती है।',
        founderP3: 'जब ध्यान आपके जीवन में उतरेगा, तो परोपकार की भावना मन में आएगी। जन कल्याण के बारे में सोचा जाएगा और समाज कल्याण के लिए एक कदम आगे बढ़ेगा।',
        founderP4: 'समाज का कल्याण होगा, राष्ट्र का कल्याण होगा और हमारा देश विकसित होकर समृद्ध भारत के रूप में उभरेगा।',
        founderHighlight: 'जीवन मिला है —इसे केवल जीना नहीं, सार्थक बनाना है।',

        // JADU Philosophy
        jaduTitle: 'OUR PHILOSOPHY',
        jaduHindiTitle: 'हमारा दर्शन',
        jaduSubtitle: 'JADU — जीवन, आत्मा, ध्यान, उद्धार',

        // Life Philosophy
        lifeTitle: 'MAKE LIFE MEANINGFUL',
        lifeHindiTitle: 'जीवन को सार्थक बनाएं',
        lifeText: 'जो जीवन मिला है और हर रोज़ मिल रहा है, उसका आनंद लो क्योंकि मौत सिर्फ एक बार मिलती है। तभी जीवन का उद्धार संभव है।',
        lifeHighlight: 'आओ, मौत की तैयारी बेहतर करें।',

        // Future Generations
        futureTitle: 'A BETTER FUTURE FOR THE NEXT GENERATION',
        futureHindiTitle: 'आने वाली पीढ़ी के लिए बेहतर भविष्य',
        futureText: 'मिली है जीवन तो आने वाली पीढ़ी को धन के साथ-साथ अच्छा वातावरण, शुद्ध अनाज, शुद्ध हवा, शुद्ध पानी, प्रकृति से भरा हुआ, नशा-मुक्त और समृद्ध देश दें।',

        // Humanity Section
        humanityTitle: 'HUMANITY ABOVE DIFFERENCES',
        humanityHindiTitle: 'मानवता सबसे ऊपर',
        humanityText: 'उच्च-नीच, जाति, भेदभाव और धर्मों से हमारा संसार नहीं चलेगा। संसार चलेगा मानवता और इंसानियत से।',
        humanityHighlight: 'जिओ और जीने दो।',
        humanityEnglishText: 'Live with humanity. Let others live with dignity.',

        // Our Prayer
        prayerTitle: 'OUR PRAYER',
        prayerHindiTitle: 'हमारी प्रार्थना',
        prayerText: 'ऊपर वाले से सिर्फ एक ही प्रार्थना है — सबका कल्याण करना प्रभु, कोई भी भूखा ना रहे।',
        prayerCta: 'DONATE NOW',
        prayerCtaHindi: 'सेवा में अपना योगदान दें',

        // Transition Connection
        transitionQuote: 'विचार तभी सार्थक है जब वह सेवा में बदलता है।',
        transitionSubtext: 'हमारे कार्य में सहयोग करें',

        // Other Sections
        ourWorkTitle: 'OUR WORK',
        ourWorkHindiTitle: 'हमारे कार्य',
        ourWorkSubtitle: 'Education • Healthcare • Cow Welfare • Disaster Relief',
        donationSectionTitle: 'DONATION INITIATIVES',
        donationSectionHindiTitle: 'दान अभियान',
        donationSectionSubtitle: 'Support verified campaigns with transparent impact.',
        storiesTitle: 'STORIES OF CHANGE',
        storiesHindiTitle: 'बदलाव की कहानियाँ',
        storiesSubtitle: 'Ground impact from active foundation initiatives.',
        galleryTitle: 'MOMENTS OF CHANGE',
        galleryHindiTitle: 'बदलाव की झलकियाँ',
        gallerySubtitle: 'Authentic documentary photography from our work.',
        volunteerTitle: 'BE PART OF THE CHANGE',
        volunteerHindiTitle: 'बदलाव का हिस्सा बनें',
        volunteerSubtitle: 'Your time, skills and dedication bring hope to lives in need.',
        transparencyTitle: 'YOUR TRUST MATTERS',
        transparencyHindiTitle: 'आपका विश्वास महत्वपूर्ण है',
        finalCtaTitle: 'TOGETHER, WE CAN MAKE A DIFFERENCE',
        finalCtaDescription: 'Join hands with Jadu & Art Foundation today to support education, healthcare, cow welfare and humanitarian relief.',
        finalCtaButtonText: 'DONATE NOW'
      }
    });

    // Section Ordering & Visibility
    await SiteContent.create({
      key: 'section_visibility',
      data: {
        hero: { visible: true, order: 1 },
        impact: { visible: true, order: 2 },
        about_intro: { visible: true, order: 3 },
        founder_message: { visible: true, order: 4 },
        jadu_philosophy: { visible: true, order: 5 },
        our_work: { visible: true, order: 6 },
        donation_initiatives: { visible: true, order: 7 },
        our_impact: { visible: true, order: 8 },
        future_generations: { visible: true, order: 9 },
        humanity: { visible: true, order: 10 },
        stories: { visible: true, order: 11 },
        gallery: { visible: true, order: 12 },
        volunteer: { visible: true, order: 13 },
        transparency: { visible: true, order: 14 },
        prayer: { visible: true, order: 15 },
        final_cta: { visible: true, order: 16 }
      }
    });

    // About Page Content
    await SiteContent.create({
      key: 'about',
      data: {
        title: 'ABOUT JADU & ART FOUNDATION',
        hindiTitle: 'जादू एंड आर्ट फाउंडेशन के बारे में',
        subtitle: 'Spiritual Values | Social Impact | A Brighter India',
        storyHeading: 'Our Story & Mission',
        storyContent: 'Jadu & Art Foundation works towards the welfare of people, communities and animals through education, healthcare, cow welfare and humanitarian support.',
        mission: 'To empower underprivileged children with education, provide accessible healthcare, care for cows with dignity, and support communities during emergency crises.',
        vision: 'A compassionate, vibrant society rooted in Seva, Sanskar and Samriddh Bharat.',
        heroImage: 'https://images.pexels.com/photos/36848854/pexels-photo-36848854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      }
    });

    // Contact Content
    await SiteContent.create({
      key: 'contact',
      data: {
        email: 'jaduandartfoundation@gmail.com',
        phone: '', // Only verified phone details displayed
        address: 'Jadu & Art Foundation, India',
        instagram: 'https://instagram.com/jaduandartfoundation',
        facebook: 'https://facebook.com/jaduandartfoundation',
        youtube: 'https://youtube.com/@jaduandartfoundation'
      }
    });

    // Footer Content
    await SiteContent.create({
      key: 'footer',
      data: {
        description: 'Jadu & Art Foundation works towards the welfare of people, communities and animals through education, healthcare, cow welfare and humanitarian support.',
        copyright: '© 2026 Jadu & Art Foundation. All Rights Reserved.',
        tagline: 'Spiritual Values | Social Impact | A Brighter India'
      }
    });

    // SEO Metadata
    await SiteContent.create({
      key: 'seo',
      data: {
        defaultTitle: 'Jadu & Art Foundation | Seva • Sanskar • Samriddh Bharat',
        defaultDescription: 'Jadu & Art Foundation works towards education, healthcare, cow welfare and humanitarian support while promoting values of service, humanity and a better future for India.',
        keywords: 'Jadu & Art Foundation, NGO India, Gau Seva, Education, Healthcare, Disaster Relief, Humanity',
        ogTitle: 'Jadu & Art Foundation | Creating Change. One Life at a Time.',
        ogDescription: 'Supporting education, healthcare, cow welfare and emergency relief in India.',
        ogImage: '/logo.svg'
      }
    });
    console.log('Site content seeded.');

    // 4. Impact Metrics
    await ImpactMetric.deleteMany({});
    await ImpactMetric.insertMany([
      { label: 'Children Supported', hindiLabel: 'बच्चों को सहायता', value: '500+', description: 'Access to learning materials, school supplies, and educational aid', icon: 'BookOpen', order: 1, published: true },
      { label: 'People Reached', hindiLabel: 'लोगों तक पहुँच', value: '1,200+', description: 'Medical camps, healthcare kits, and community welfare programs', icon: 'HeartPulse', order: 2, published: true },
      { label: 'Cows Supported', hindiLabel: 'गौ सेवा व आश्रय', value: '300+', description: 'Regular feeding, veterinary care, and shelter development', icon: 'Leaf', order: 3, published: true },
      { label: 'Relief Initiatives', hindiLabel: 'आपदा सहायता अभियान', value: '15+', description: 'Emergency disaster support, food distribution, and essential kits', icon: 'Shield', order: 4, published: true }
    ]);
    console.log('Impact metrics seeded.');

    // 5. Work Categories & Work Items
    await WorkCategory.deleteMany({});
    await WorkCategory.insertMany([
      { name: 'Education', hindiName: 'शिक्षा', slug: 'education', description: 'Educational aid and study kits', order: 1 },
      { name: 'Healthcare', hindiName: 'स्वास्थ्य सेवा', slug: 'healthcare', description: 'Health checkup camps and medical support', order: 2 },
      { name: 'Cow Welfare', hindiName: 'गौ सेवा', slug: 'cow-welfare', description: 'Green fodder distribution and shelter maintenance', order: 3 },
      { name: 'Disaster Relief', hindiName: 'आपदा राहत', slug: 'disaster-relief', description: 'Emergency dry ration and flood relief', order: 4 }
    ]);

    await Work.deleteMany({});
    await Work.insertMany([
      {
        title: 'Education & Child Empowerment',
        hindiTitle: 'शिक्षा और बाल सशक्तिकरण',
        slug: 'education',
        category: 'Education',
        shortDescription: 'Supporting children and communities through educational resources, learning opportunities and practical assistance.',
        fullDescription: 'Our Education Program works directly in rural and semi-urban communities to ensure children have continuous access to textbooks, notebooks, geometry sets, school uniforms, and supportive learning environments. We organize after-school remedial sessions to bridge learning gaps for first-generation schoolgoers.',
        image: 'https://images.pexels.com/photos/15119089/pexels-photo-15119089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        icon: 'BookOpen',
        order: 1,
        published: true,
        featured: true
      },
      {
        title: 'Community Healthcare & Medical Care',
        hindiTitle: 'सामुदायिक स्वास्थ्य व चिकित्सा सेवा',
        slug: 'healthcare',
        category: 'Healthcare',
        shortDescription: 'Supporting access to essential healthcare, medical assistance and community health initiatives.',
        fullDescription: 'Access to basic health screening and emergency medical care transforms quality of life for vulnerable families. We organize free community health checkup camps, distribute essential medicines, provide eye checkup glasses, and support emergency hospital care for low-income households.',
        image: 'https://images.pexels.com/photos/14558557/pexels-photo-14558557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        icon: 'HeartPulse',
        order: 2,
        published: true,
        featured: true
      },
      {
        title: 'Cow Welfare & Safe Shelter Sanctuary',
        hindiTitle: 'गौ सेवा और सुरक्षित आश्रय धाम',
        slug: 'cow-welfare',
        category: 'Cow Welfare',
        shortDescription: 'Supporting cow feeding, care and the development of safe shelters for animals.',
        fullDescription: 'Our Gau Seva initiative is dedicated to providing daily nutritious green fodder, fresh drinking water, periodic veterinary care, and protective shed infrastructure for abandoned, injured, or elderly cattle across partner shelters.',
        image: 'https://images.pexels.com/photos/30147593/pexels-photo-30147593.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        icon: 'Leaf',
        order: 3,
        published: true,
        featured: true
      },
      {
        title: 'Humanitarian & Flood Disaster Relief',
        hindiTitle: 'मानवीय व बाढ़ आपदा राहत सहायता',
        slug: 'disaster-relief',
        category: 'Disaster Relief',
        shortDescription: 'Standing with communities affected by floods, natural disasters and emergency crises.',
        fullDescription: 'During natural calamities, monsoons, and flooding, rapid response is crucial. Foundation volunteers mobilize directly on the ground to distribute emergency food kits, dry rations, clean drinking water, hygiene products, and temporary shelter materials to affected families.',
        image: 'https://images.pexels.com/photos/20989105/pexels-photo-20989105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        icon: 'Shield',
        order: 4,
        published: true,
        featured: true
      }
    ]);
    console.log('Work programs seeded.');

    // 6. Donation Initiatives
    await DonationInitiative.deleteMany({});
    await DonationInitiative.insertMany([
      {
        title: 'Education for Every Child',
        hindiTitle: 'हर बच्चे के लिए शिक्षा',
        slug: 'education-for-every-child',
        category: 'Education',
        shortDescription: 'Support educational resources, learning materials and opportunities for children who need additional support.',
        description: 'Support educational resources, learning materials and opportunities for children who need additional support. Our education initiative works directly in rural and semi-urban communities to ensure children have access to books, uniforms, stationery, and supportive learning environments.',
        image: 'https://images.pexels.com/photos/15119089/pexels-photo-15119089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        targetAmount: 300000,
        manualAdjustment: 135000,
        status: 'active',
        featured: true,
        published: true,
        impactDescription: 'Direct study kits, notebooks, and learning support provided to school children in need.',
        location: 'Uttar Pradesh & Bihar, India'
      },
      {
        title: 'Healthcare for Communities',
        hindiTitle: 'समुदायों के लिए स्वास्थ्य सेवा',
        slug: 'healthcare-for-communities',
        category: 'Healthcare',
        shortDescription: 'Help support healthcare initiatives and essential medical assistance for communities in need.',
        description: 'Help support healthcare initiatives and essential medical assistance for communities in need. Access to basic medical assistance can transform quality of life. We organize health check-up camps, distribute essential medicines, and provide assistance for emergency medical needs.',
        image: 'https://images.pexels.com/photos/14558557/pexels-photo-14558557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        targetAmount: 500000,
        manualAdjustment: 210000,
        status: 'active',
        featured: true,
        published: true,
        impactDescription: 'Free diagnostic camps, essential medicines, and emergency surgery assistance for low-income families.',
        location: 'Community Health Camps across North India'
      },
      {
        title: 'Care & Shelter for Cows',
        hindiTitle: 'गौ सेवा और आश्रय',
        slug: 'care-shelter-for-cows',
        category: 'Cow Welfare',
        shortDescription: 'Support cow feeding, veterinary care and the development of safe shelters for animals.',
        description: 'Support cow feeding, veterinary care and the development of safe shelters for animals. Our Gau Seva initiative ensures regular green fodder, clean drinking water, medical treatment, and safe shelter development for abandoned and injured cattle.',
        image: 'https://images.pexels.com/photos/30147593/pexels-photo-30147593.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        targetAmount: 400000,
        manualAdjustment: 175000,
        status: 'active',
        featured: true,
        published: true,
        impactDescription: 'Nutritious daily fodder, veterinary first-aid, and protective shed infrastructure for rescued cattle.',
        location: 'Local Gau Shalas & Animal Sanctuaries'
      },
      {
        title: 'Support During Crisis',
        hindiTitle: 'संकट के समय सहायता',
        slug: 'support-during-crisis',
        category: 'Disaster Relief',
        shortDescription: 'Help provide essential support to communities affected by floods, natural disasters and other emergencies.',
        description: 'Help provide essential support to communities affected by floods, natural disasters and other emergencies. Standing with vulnerable families during natural calamities, floods, and emergencies by delivering immediate relief packages, dry rations, hygiene supplies, and shelter kits.',
        image: 'https://images.pexels.com/photos/20989105/pexels-photo-20989105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        targetAmount: 750000,
        manualAdjustment: 320000,
        status: 'active',
        featured: true,
        published: true,
        impactDescription: 'Rapid deployment of dry ration packs, purified drinking water, and emergency hygiene kits.',
        location: 'Flood-prone disaster areas'
      }
    ]);
    console.log('Donation initiatives seeded.');

    // 7. Stories
    await Story.deleteMany({});
    await Story.insertMany([
      {
        title: 'Creating Better Learning Opportunities for Rural Students',
        hindiTitle: 'ग्रामीण छात्रों के लिए बेहतर शिक्षा के अवसर',
        slug: 'creating-better-learning-opportunities',
        category: 'Education',
        excerpt: 'How targeted educational assistance enabled 150 children in remote villages to continue their studies with essential learning kits.',
        content: 'Education opens pathways out of generational poverty. In our recent initiative, Jadu & Art Foundation distributed comprehensive learning kits containing notebooks, geometry sets, school bags, and supplementary reading material to rural students who lacked basic study tools.',
        image: 'https://images.pexels.com/photos/20556421/pexels-photo-20556421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        published: true,
        featured: true
      },
      {
        title: 'Compassionate Care & Fodder Distribution for Cattle Welfare',
        hindiTitle: 'गौ सेवा और हरा चारा वितरण अभियान',
        slug: 'compassionate-care-cattle-welfare',
        category: 'Cow Welfare',
        excerpt: 'Providing daily nutritious green fodder and medical attention to over 300 rescued cows across local shelters.',
        content: 'Protecting and caring for cattle requires consistent effort and community dedication. Our volunteers coordinate daily feeding programs and periodic veterinary checkups, ensuring that neglected cattle receive proper nutrition and healing.',
        image: 'https://images.pexels.com/photos/12220839/pexels-photo-12220839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        published: true,
        featured: true
      },
      {
        title: 'Standing Together: Rapid Relief Assistance During Monsoon Flooding',
        hindiTitle: 'बाढ़ राहत: संकट के समय परिवारों को राशन व चिकित्सा सहायता',
        slug: 'rapid-relief-assistance-monsoon-flooding',
        category: 'Disaster Relief',
        excerpt: 'Delivering over 500 dry ration kits and essential medical supplies to affected families in flood-impacted regions.',
        content: 'When monsoons cause localized flooding, access to clean food and drinking water becomes critical. Jadu & Art Foundation teams mobilized quickly to deliver emergency relief kits directly to affected households.',
        image: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        published: true,
        featured: true
      }
    ]);
    console.log('Stories seeded.');

    // 8. Gallery Items
    await GalleryItem.deleteMany({});
    await GalleryItem.insertMany([
      {
        image: 'https://images.pexels.com/photos/8926543/pexels-photo-8926543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        caption: 'Interactive learning session in village school room',
        hindiCaption: 'गांव के स्कूल में इंटरैक्टिव शिक्षा सत्र',
        category: 'education',
        published: true,
        order: 1
      },
      {
        image: 'https://images.pexels.com/photos/7088523/pexels-photo-7088523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        caption: 'Free community healthcare examination camp',
        hindiCaption: 'निःशुल्क सामुदायिक स्वास्थ्य जांच शिविर',
        category: 'healthcare',
        published: true,
        order: 2
      },
      {
        image: 'https://images.pexels.com/photos/5610815/pexels-photo-5610815.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        caption: 'Daily fodder distribution drive at animal sanctuary',
        hindiCaption: 'गौशाला में प्रतिदिन हरा चारा सेवा',
        category: 'cow-welfare',
        published: true,
        order: 3
      },
      {
        image: 'https://images.pexels.com/photos/9336113/pexels-photo-9336113.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        caption: 'Emergency dry ration kit distribution drive',
        hindiCaption: 'आपातकालीन सूखा राशन सामग्री वितरण',
        category: 'disaster-relief',
        published: true,
        order: 4
      },
      {
        image: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        caption: 'Community volunteers assembling relief packages',
        hindiCaption: 'राहत किट तैयार करते संस्था के स्वयंसेवक',
        category: 'community',
        published: true,
        order: 5
      },
      {
        image: 'https://images.pexels.com/photos/1183434/pexels-photo-1183434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        caption: 'Smiling rural school children with new study books',
        hindiCaption: 'नई पाठ्यपुस्तकों के साथ खुश बच्चे',
        category: 'education',
        published: true,
        order: 6
      }
    ]);
    console.log('Gallery items seeded.');

    // 9. Compliance & Transparency Documents
    await Document.deleteMany({});
    await Document.insertMany([
      {
        name: 'Trust Registration Certificate',
        hindiName: 'न्यास पंजीकरण प्रमाण पत्र',
        description: 'Official Registration Certificate of Jadu & Art Foundation under Indian Trust Laws.',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        docType: 'Registration',
        year: '2024-2026',
        published: true,
        order: 1
      },
      {
        name: '12A Income Tax Registration',
        hindiName: '12A आयकर पंजीकरण प्रमाणपत्र',
        description: 'Income Tax 12A exemption certification for non-profit trust operations.',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        docType: '12A',
        year: '2024-2029',
        published: true,
        order: 2
      },
      {
        name: '80G Tax Exemption Certificate',
        hindiName: '80G कर छूट प्रमाणपत्र',
        description: '80G certification enabling tax benefits for individual and corporate donors in India.',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        docType: '80G',
        year: '2024-2029',
        published: true,
        order: 3
      },
      {
        name: 'Annual Audit Report 2024-2025',
        hindiName: 'वार्षिक लेखा परीक्षा रिपोर्ट 2024-2025',
        description: 'Audited financial statements and statutory compliance report.',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        docType: 'Annual Report',
        year: '2024-2025',
        published: true,
        order: 4
      }
    ]);
    console.log('Transparency documents seeded.');

    // 10. Team Members
    await TeamMember.deleteMany({});
    await TeamMember.insertMany([
      {
        name: 'Vikramaditya Sharma',
        role: 'Founder & Managing Trustee',
        hindiRole: 'संस्थापक एवं प्रबन्ध न्यासी',
        photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800',
        bio: 'Over 12 years of grassroots social development work across North India.',
        socialLinks: { linkedin: 'https://linkedin.com' },
        order: 1,
        published: true
      },
      {
        name: 'Ananya Verma',
        role: 'Director - Community Programs',
        hindiRole: 'निदेशक - सामुदायिक कार्यक्रम',
        photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800',
        bio: 'Spearheading rural education workshops and women healthcare initiatives.',
        socialLinks: { linkedin: 'https://linkedin.com' },
        order: 2,
        published: true
      }
    ]);
    console.log('Team members seeded.');

    console.log('Full CMS database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
