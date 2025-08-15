"use client"

import React, { createContext, useContext, useState } from "react"

type Language = "en" | "si" | "ta"

interface TranslationContextType {
  currentLanguage: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

// Translation data
const translations = {
  en: {
    // Government Header
    "gov.department": "Department of Land Registration",
    "gov.digitalHub": "Digital Services Hub",
    "gov.hotline": "Hot line:",
    
    // Navigation
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.about": "About us",
    "nav.contact": "Contact Us",
    "nav.news": "News & Events",
    "nav.faq": "FAQ",
    "nav.dashboard": "Dashboard",
    "nav.loginToDashboard": "Login to Dashboard",
    
    // Hero Section
    "hero.title": "Digital Land Registration Services",
    "hero.subtitle": "Streamlined, Secure, and Efficient Land Registration at Your Fingertips",
    "hero.getStarted": "Get Started",
    "hero.learnMore": "Learn More",
    
    // Services Section
    "services.title": "Our Services",
    "services.subtitle": "Comprehensive digital solutions for all your land registration needs",
    
    // Dashboard
    "dashboard.welcome": "Welcome",
    "dashboard.today": "Today",
    "dashboard.availableServices": "Available Services",
    "dashboard.requestApplication": "Request Application",
    
    // Contact
    "contact.title": "Contact Us",
    "contact.getInTouch": "Get in Touch",
    
    // Footer
    "footer.copyright": "© 2024 Department of Land Registration. All rights reserved.",
    
    // Login
    "login.title": "Login",
    "login.email": "Email",
    "login.password": "Password",
    "login.loginButton": "Login",
    "login.register": "Register",
    
    // Process Section
    "process.title": "How It Works",
    "process.subtitle": "A straightforward process to register and update land records.",
    "process.step1.title": "Prepare documents",
    "process.step1.desc": "Gather deeds, surveys, IDs, and supporting affidavits.",
    "process.step2.title": "Apply online",
    "process.step2.desc": "Fill the application and upload digital copies of documents.",
    "process.step3.title": "Verification",
    "process.step3.desc": "AI validate records and request clarifications if needed.",
    "process.step4.title": "Issuance",
    "process.step4.desc": "Receive your registration certificate or updated title.",
    
    // Hero Section
    "hero.welcomeTitle": "Welcome To the",
    "hero.departmentName": "Department of Land Registration",
    "hero.description": "Register land, verify titles, transfer ownership, and access maps and records online. Our mission is to protect property rights with accuracy and integrity.",
    "hero.newUser": "New User",
    "hero.currentUser": "Current User",
    "hero.welcomeBack": "Welcome back! You are logged in with ID:",
    "hero.signOut": "Sign Out",
    
    // Services Section
    "services.sectionTitle": "Services",
    "services.sectionSubtitle": "Explore our most-requested services and get started online.",
    "services.viewAll": "View all Services",
    "services.landTransfer": "Land Transfer",
    "services.landTransfer.desc": "Submit new title registration, attach surveys, and pay required fees.",
    "services.copyLandRegisters": "Application for Copy of Land Registers",
    "services.copyLandRegisters.desc": "Submit new title registration, attach surveys, and pay required fees.",
    "services.registerProperty": "Register Property",
    "services.registerProperty.desc": "Submit new title registration, attach surveys, and pay required fees.",
    
    // Dashboard Services
    "dashboard.services.landTransfer": "Land Transfer",
    "dashboard.services.landTransfer.desc": "Register the transfer of land ownership from the seller to the buyer with full legal documentation and verification.",
    "dashboard.services.certifiedCopy": "Application for a certified copy of a land",
    "dashboard.services.certifiedCopy.desc": "Request an officially certified copy of land records for legal, administrative, or personal reference purposes.",
    "dashboard.services.searchLandRegisters": "Application for search of land registers",
    "dashboard.services.searchLandRegisters.desc": "Conduct a search in the official land registry to verify ownership details, boundaries, and encumbrances.",
    "dashboard.services.searchLandRegisters2.desc": "Locate and review registered land records to confirm property history and registration details.",
    "dashboard.services.duplicateDeeds": "Application for search duplicate of deeds",
    "dashboard.services.duplicateDeeds.desc": "Request a duplicate copy of a registered deed when the original document has been lost or damaged.",
    
    // Contact Section
    "contact.sectionTitle": "Contact us",
    "contact.sectionSubtitle": "We're here to help during regular business hours.",
    "contact.phoneNumber": "Phone Number",
    "contact.email": "Email",
    "contact.appointments": "Appointments",
    "contact.appointmentsDesc": "Book an in-person visit online.",
    "contact.address": "123 Registry Avenue, Capital City",
    
    // Announcements Section
    "announcements.title": "Announcements",
    "announcements.subtitle": "Latest updates and notices from the Department.",
    "announcements.viewAll": "View all Announcement",
    "announcements.maintenanceTitle": "Online payment maintenance window",
    "announcements.maintenanceDesc": "Payment services will be unavailable on Aug 12 from 01:00–03:00.",
    "announcements.readMore": "Read more",
    
    // FAQ Section
    "faq.helpCenter": "Help Center",
    "faq.title": "Frequently asked questions",
    "faq.subtitle": "Answers to common questions about land registration and records.",
    "faq.q1": "What is the purpose of this website?",
    "faq.a1": "This website provides digital services for land registration and property records management.",
    "faq.q2": "How do I register my property online?",
    "faq.a2": "You can register your property by following our 4-step process: prepare documents, apply online, verification, and issuance.",
    "faq.q3": "What documents do I need for land transfer?",
    "faq.a3": "You will need the original deed, identity documents, survey plans, and any relevant court orders or agreements.",
    "faq.q4": "How long does the verification process take?",
    "faq.a4": "The verification process typically takes 3-5 business days depending on the complexity of your application.",
    
    // Footer
    "footer.aboutHub": "About the Digital Services Hub",
    "footer.ourMission": "Our Mission",
    "footer.digitalTransformation": "Digital Transformation Strategy",
    "footer.icta": "Information and Communication Technology Agency (ICTA)",
    "footer.newsUpdates": "News & Updates",
    "footer.careers": "Careers",
    "footer.phone": "Phone: +94 11 2356456",
    "footer.fax": "Fax: +94 11 2356456",
    "footer.email": "Email: info@cse.lk",
    "footer.popularServices": "Popular Services",
    "footer.landTransferService": "Land Transfer Service",
    "footer.birthCertificate": "Apply for Birth Certificate",
    "footer.drivingLicense": "Renew Driving License",
    "footer.businessRegistration": "Business Registration",
    "footer.passportApplication": "Passport Application & Renewal",
    "footer.viewAllServices": "View All Services",
    "footer.helpSupport": "Help & Support",
    "footer.faqFull": "Frequently Asked Questions (FAQ)",
    "footer.userGuides": "User Guides & Tutorials",
    "footer.trackStatus": "Track Application Status",
    "footer.reportIssue": "Report a Technical Issue",
    "footer.accessibility": "Accessibility Statement",
    "footer.privacyPolicy": "Privacy Policy | Terms & Conditions | Cookie Policy",
    "footer.copyrightSriLanka": "© 2025 Government of Sri Lanka. All Rights Reserved."
  },
  si: {
    // Government Header
    "gov.department": "ඉඩම් ලියාපදිංචිකරණ දෙපාර්තමේන්තුව",
    "gov.digitalHub": "ඩිජිටල් සේවා මධ්‍යස්ථානය",
    "gov.hotline": "ක්ෂණික දුරකථන:",
    
    // Navigation
    "nav.home": "මුල් පිටුව",
    "nav.services": "සේවා",
    "nav.about": "අපි ගැන",
    "nav.contact": "අප හා සම්බන්ධ වන්න",
    "nav.news": "ප්‍රවෘත්ති සහ සිදුවීම්",
    "nav.faq": "නිතර අසන ප්‍රශ්න",
    "nav.dashboard": "උපකරණ පුවරුව",
    "nav.loginToDashboard": "උපකරණ පුවරුවට පිවිසෙන්න",
    
    // Hero Section
    "hero.title": "ඩිජිටල් ඉඩම් ලියාපදිංචිකරණ සේවා",
    "hero.subtitle": "ඔබගේ අත්끝में ඇති සුළු, ආරක්ෂිත සහ කාර්යක්ෂම ඉඩම් ලියාපදිංචිකරණය",
    "hero.getStarted": "ආරම්භ කරන්න",
    "hero.learnMore": "තව දැනගන්න",
    
    // Services Section
    "services.title": "අපගේ සේවා",
    "services.subtitle": "ඔබගේ සියලුම ඉඩම් ලියාපදිංචිකරණ අවශ්‍යතා සඳහා පරිපූර්ණ ඩිජිටල් විසඳුම්",
    
    // Dashboard
    "dashboard.welcome": "සාදරයෙන් පිළිගනිමු",
    "dashboard.today": "අද",
    "dashboard.availableServices": "ලබා ගත හැකි සේවා",
    "dashboard.requestApplication": "අයදුම්පත ඉල්ලීම",
    
    // Contact
    "contact.title": "අප හා සම්බන්ධ වන්න",
    "contact.getInTouch": "සම්බන්ධ වන්න",
    
    // Footer
    "footer.copyright": "© 2024 ඉඩම් ලියාපදිංචිකරණ දෙපාර්තමේන්තුව. සියලුම අයිතිවාසිකම් ඇවිරිණි.",
    
    // Login
    "login.title": "පිවිසෙන්න",
    "login.email": "විද්‍යුත් ලිපිනය",
    "login.password": "මුරපදය",
    "login.loginButton": "පිවිසෙන්න",
    "login.register": "ලියාපදිංචි වන්න",
    
    // Process Section
    "process.title": "එය ක්‍රියා කරන ආකාරය",
    "process.subtitle": "ඉඩම් පේරුම් ලියාපදිංචි කිරීම සහ යාවත්කාලීන කිරීම සඳහා සරල ක්‍රියාවලියක්.",
    "process.step1.title": "ලේඛන සකස් කරන්න",
    "process.step1.desc": "ඔප්පු, සමීක්ෂණ, හැඳුනුම්පත් සහ සහාය ප්‍රකාශන එකතු කරන්න.",
    "process.step2.title": "අන්තර්ජාලයෙන් අයදුම් කරන්න",
    "process.step2.desc": "අයදුම්පත පුරවා ලේඛනවල ඩිජිටල් පිටපත් උඩුගත කරන්න.",
    "process.step3.title": "සත්‍යාපනය",
    "process.step3.desc": "AI පේරුම් වලංගු කර අවශ්‍ය නම් පැහැදිලි කිරීම් ඉල්ලයි.",
    "process.step4.title": "නිකුත් කිරීම",
    "process.step4.desc": "ඔබගේ ලියාපදිංචිකරණ සහතිකය හෝ යාවත්කාලීන කළ හිමිකම් පත්‍රය ලබා ගන්න.",
    
    // Hero Section (cont'd)
    "hero.welcomeTitle": "සාදරයෙන් පිළිගනිමු",
    "hero.departmentName": "ඉඩම් ලියාපදිංචිකරණ දෙපාර්තමේන්තුව",
    "hero.description": "ඉඩම් ලියාපදිංචි කරන්න, හිමිකම් සත්‍යාපනය කරන්න, හිමිකම් පැවරීම සහ අන්තර්ජාලයෙන් සිතියම් සහ පේරුම් වලට ප්‍රවේශ වන්න. අපගේ මෙහෙවර නම් නිර්වින්දනය සහ අඛණ්ඩතාව සහිතව දේපල අයිතිවාසිකම් ආරක්ෂා කිරීමයි.",
    "hero.newUser": "නව පරිශීලක",
    "hero.currentUser": "වර්තමාන පරිශීලක",
    "hero.welcomeBack": "නැවත සාදරයෙන් පිළිගනිමු! ඔබ සම්බන්ධ වී ඇත්තේ:",
    "hero.signOut": "ඉවත් වන්න",
    
    // Services Section (cont'd)
    "services.sectionTitle": "සේවා",
    "services.sectionSubtitle": "අපගේ වැඩිපුරම ඉල්ලූ සේවා ගවේෂණය කර අන්තර්ජාලයෙන් ආරම්භ කරන්න.",
    "services.viewAll": "සියලුම සේවා බලන්න",
    "services.landTransfer": "ඉඩම් පැවරීම",
    "services.landTransfer.desc": "නව හිමිකම් ලියාපදිංචිකරණය ඉදිරිපත් කරන්න, සමීක්ෂණ අමුණන්න සහ අවශ්‍ය ගාස්තු ගෙවන්න.",
    "services.copyLandRegisters": "ඉඩම් ලේඛනවල පිටපත් සඳහා අයදුම්පත",
    "services.copyLandRegisters.desc": "නව හිමිකම් ලියාපදිංචිකරණය ඉදිරිපත් කරන්න, සමීක්ෂණ අමුණන්න සහ අවශ්‍ය ගාස්තු ගෙවන්න.",
    "services.registerProperty": "දේපල ලියාපදිංචි කරන්න",
    "services.registerProperty.desc": "නව හිමිකම් ලියාපදිංචිකරණය ඉදි���ිපත් කරන්න, සමීක්ෂණ අමුණන්න සහ අවශ්‍ය ගාස්තු ගෙවන්න.",
    
    // Dashboard Services (cont'd)
    "dashboard.services.landTransfer": "ඉඩම් පැවරීම",
    "dashboard.services.landTransfer.desc": "සම්පූර්ණ නීතිමය ලේඛන සහ සත්‍යාපනය සහිතව විකුණන්නාගේ සිට ගැනුම්කරුවාට ඉඩම් හිමිකම් පැවරීම ලියාපදිංචි කරන්න.",
    "dashboard.services.certifiedCopy": "ඉඩමක සහතික කළ පිටපතක් සඳහා අයදුම්පත",
    "dashboard.services.certifiedCopy.desc": "නීතිමය, පරිපාලනීය හෝ පුද්ග���ික යොමුව සඳහා ඉඩම් පේරුම්වල නිල සහතික කළ පිටපතක් ඉල්ලීම.",
    "dashboard.services.searchLandRegisters": "ඉඩම් ලේඛන සෙවීම සඳහා අයදුම්පත",
    "dashboard.services.searchLandRegisters.desc": "හිමිකම් විස්තර, සීමාවන් සහ භෝගයන් සත්‍යාපනය කිරීම සඳහා නිල ඉඩම් ලේඛනාගාරයේ සෙවීමක් කරන්න.",
    "dashboard.services.searchLandRegisters2.desc": "දේපල ඉතිහාසය සහ ලියාපදිංචිකරණ විස්තර තහවුරු කිරීම සඳහා ලියාපදිංචි ඉඩම් පේරුම් සොයාගෙන සමාලෝචනය කරන්න.",
    "dashboard.services.duplicateDeeds": "ඔප්පුවල අනුපිටපත් සෙවීම සඳහා අයදුම්පත",
    "dashboard.services.duplicateDeeds.desc": "මුල් ලේඛනය නැති වී හෝ හානි වී ඇති විට ලියාපදිංචි ඔප්පුවක අනුපිටපතක් ඉල්ලීම.",
    
    // Contact Section (cont'd)
    "contact.sectionTitle": "අප හා සම්බන්ධ වන්න",
    "contact.sectionSubtitle": "නිත්‍ය ව්‍යාපාරික කාලය තුළ අපි ඔබට උදව් කිරීමට සූදානම්.",
    "contact.phoneNumber": "දුරකථන අංකය",
    "contact.email": "විද්‍යුත් ලිපිනය",
    "contact.appointments": "හමුවීම්",
    "contact.appointmentsDesc": "පුද්ගලික සංචාරයක් අන්තර්ජාලයෙන් වෙන්කරවා ගන්න.",
    "contact.address": "123 ලේඛනාගාර මාර්ගය, අගනුවර",
    
    // Announcements Section (cont'd)
    "announcements.title": "නිවේදන",
    "announcements.subtitle": "දෙපාර්තමේන්තුවේ නවතම යාවත්කාලීනයන් සහ නිවේදන.",
    "announcements.viewAll": "සියලුම නිවේදන බලන්න",
    "announcements.maintenanceTitle": "අන්තර්ජාල ගෙවීම් නඩත්තු කවුළුව",
    "announcements.maintenanceDesc": "අගෝස්තු 12 දින 01:00–03:00 දක්වා ගෙවීම් සේවා ලබා නොගත හැක.",
    "announcements.readMore": "තවත් කියවන්න",
    
    // FAQ Section (cont'd)
    "faq.helpCenter": "උදව් මධ්‍යස්ථානය",
    "faq.title": "නිතර අසන ප්‍රශ්න",
    "faq.subtitle": "ඉඩම් ලියාපදිංචිකරණය සහ පේරුම් පිළිබඳ සාමාන්‍ය ප්‍රශ්න වලට පිළිතුරු.",
    "faq.q1": "මෙම වෙබ් අඩවියේ අරමුණ කුමක්ද?",
    "faq.a1": "මෙම වෙබ් අඩවිය ඉඩම් ලියාපදිංචිකරණය සහ දේපල පේරුම් කළමනාකරණය සඳහා ඩිජිටල් සේවා සපයයි.",
    "faq.q2": "මම මගේ දේපල අන්තර්ජාලයෙන් ලියාපදිංචි කරන්නේ කෙසේද?",
    "faq.a2": "ඔබට අපගේ 4-පියවර ක්‍රියාවලිය අනුගමනය කරමින් ඔබගේ දේපල ලියාපදිංචි කළ හැක: ලේඛන සකස් කරන්න, අන්තර්ජාලයෙන් අයදුම් කරන්න, සත්‍යාපනය සහ නිකුත් කිරීම.",
    "faq.q3": "ඉඩම් පැවරීම සඳහා මට කුමන ලේඛන අවශ්‍යද?",
    "faq.a3": "ඔබට මුල් ඔප්පුව, හැඳුනුම් ලේඛන, සමීක්ෂණ සැලසුම් සහ ඕනෑම අදාළ අධිකරණ නියෝග හෝ ගිණුම් අවශ්‍ය වේ.",
    "faq.q4": "සත්‍යාපන ක්‍රියාවලිය කොපමණ කාලයක් ගතවේද?",
    "faq.a4": "සත්‍යාපන ක්‍රියාවලිය සාමාන්‍යයෙන් ඔබගේ අයදුම්පතේ සංකීර්ණත්වය අනුව ව්‍යාපාරික දින 3-5ක් ගතවේ.",
    
    // Footer (cont'd)
    "footer.aboutHub": "ඩිජිටල් සේවා මධ්‍යස්ථානය ගැන",
    "footer.ourMission": "අපගේ මෙහෙවර",
    "footer.digitalTransformation": "ඩිජිටල් පරිවර්තන උපාය මාර්ගය",
    "footer.icta": "තොරතුරු සහ සන්නිවේදන තාක්ෂණ ඒජන්සිය (ICTA)",
    "footer.newsUpdates": "ප්‍රවෘත්ති සහ යාවත්කාලීනයන්",
    "footer.careers": "වෘත්තීය අවස්ථා",
    "footer.phone": "දුරකථනය: +94 11 2356456",
    "footer.fax": "ෆැක්ස්: +94 11 2356456",
    "footer.email": "විද්‍යුත් ලිපිනය: info@cse.lk",
    "footer.popularServices": "ජනප්‍රිය සේවා",
    "footer.landTransferService": "ඉඩම් පැවරීම් සේවාව",
    "footer.birthCertificate": "උප්පැන්න සහතිකය සඳහා අයදුම් කරන්න",
    "footer.drivingLicense": "රියදුරු බලපත්‍රය අලුත් කරන්න",
    "footer.businessRegistration": "ව්‍යාපාර ලියාපදිංචිකරණය",
    "footer.passportApplication": "ගමන් බලපත්‍ර අයදුම්පත සහ අලුත් කිරීම",
    "footer.viewAllServices": "සියලුම සේවා බලන්න",
    "footer.helpSupport": "උදව් සහ ආධාර",
    "footer.faqFull": "නිතර අස��� ප්‍රශ්න (FAQ)",
    "footer.userGuides": "පරිශීලක මාර්ගෝපදේශ සහ නිබන්ධන",
    "footer.trackStatus": "අයදුම්පත් තත්ත්වය ලුහුබඳින්න",
    "footer.reportIssue": "තාක්ෂණික ගැටළුවක් වාර්තා කරන්න",
    "footer.accessibility": "ප්‍රවේශ්‍යතා ප්‍රකාශනය",
    "footer.privacyPolicy": "පෞද්ගලිකත්ව ප්‍රතිපත්තිය | නියම සහ කොන්දේසි | කුකී ප්‍රතිපත්තිය",
    "footer.copyrightSriLanka": "© 2025 ශ්‍රී ලංකා රජය. සියලුම අයිතිවාසිකම් ඇවිරිණි."
  },
  ta: {
    // Government Header
    "gov.department": "நில பதிவுத் துறை",
    "gov.digitalHub": "டிஜிட்டல் சேவைகள் மையம்",
    "gov.hotline": "உடனடி தொலைபேசி:",
    
    // Navigation
    "nav.home": "முகப்பு",
    "nav.services": "சேவைகள்",
    "nav.about": "எங்களைப் பற்றி",
    "nav.contact": "எங்களைத் தொடர்பு கொள்ளுங்கள்",
    "nav.news": "செய்திகள் மற்றும் நிகழ்வுகள்",
    "nav.faq": "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    "nav.dashboard": "டாஷ்போர்டு",
    "nav.loginToDashboard": "டாஷ்போர்டுக்கு உள்நுழைக",
    
    // Hero Section
    "hero.title": "டிஜிட்டல் நில பதிவு சேவைகள்",
    "hero.subtitle": "உங்கள் விரல் நுனியில் திறமையான, பாதுகாப்பான மற்றும் திறமையான நில பதிவு",
    "hero.getStarted": "தொடங்குங்கள்",
    "hero.learnMore": "மேலும் அறிக",
    
    // Services Section
    "services.title": "எங்கள் சேவைகள்",
    "services.subtitle": "உங்கள் அனைத்து நில பதிவு தேவைகளுக்கும் விரிவான டிஜிட்டல் தீர்வுகள்",
    
    // Dashboard
    "dashboard.welcome": "வரவேற்கிறோம்",
    "dashboard.today": "இன்று",
    "dashboard.availableServices": "கிடைக்கும் சேவைகள்",
    "dashboard.requestApplication": "விண்ணப்பம் கோரு",
    
    // Contact
    "contact.title": "எங்களைத் தொடர்பு கொள்ளுங்கள்",
    "contact.getInTouch": "தொடர்பு கொள்ளுங்கள்",
    
    // Footer
    "footer.copyright": "© 2024 நில பதிவுத் துறை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    
    // Login
    "login.title": "உள்நுழைக",
    "login.email": "மின்னஞ்சல்",
    "login.password": "கடவுச்சொல்",
    "login.loginButton": "உள்நுழைக",
    "login.register": "பதிவு செய்க",
    
    // Process Section
    "process.title": "இது எப்படி வேலை செய்கிறது",
    "process.step1": "கணக்கை பதிவு செய்க",
    "process.step2": "விண்ணப்பத்தை சமர்ப்பிக்க",
    "process.step3": "ஆவண சரிபார்ப்பு",
    "process.step4": "அங்கீகாரம் மற்றும் நிறைவு"
  }
}

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en")

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang)
    // Store in localStorage for persistence
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[currentLanguage][key] || translations["en"][key] || key
  }

  // Initialize language from localStorage on mount
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && ["en", "si", "ta"].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  return (
    <TranslationContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}
