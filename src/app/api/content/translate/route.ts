import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { readData } from '@/lib/db';

// Collect all translatable strings from all page data files
function collectAllPageContent(): Record<string, string> {
  const content: Record<string, string> = {};

  // Home page
  try {
    const home = readData<Record<string, unknown>>('home.json', {});
    const hero = home.hero as Record<string, string> | undefined;
    if (hero) {
      if (hero.greeting) content['home.greeting'] = hero.greeting;
      if (hero.name) content['home.name'] = hero.name;
      if (hero.title) content['home.title'] = hero.title;
      if (hero.subtitle) content['home.subtitle'] = hero.subtitle;
      if (hero.description) content['home.description'] = hero.description;
      if (hero.ctaPrimary) content['home.ctaPrimary'] = hero.ctaPrimary;
      if (hero.ctaSecondary) content['home.ctaSecondary'] = hero.ctaSecondary;
    }
    const stats = home.stats as Array<{ number: string; label: string }> | undefined;
    if (stats) {
      stats.forEach((s, i) => {
        if (s.label) content[`home.stat.${i}.label`] = s.label;
      });
    }
    const skills = home.skills as Array<{ name: string }> | undefined;
    if (skills) {
      skills.forEach((s, i) => {
        if (s.name) content[`home.skill.${i}.name`] = s.name;
      });
    }
  } catch { /* skip */ }

  // About page
  try {
    const about = readData<Record<string, unknown>>('about.json', {});
    if (about.title) content['about.title'] = about.title as string;
    if (about.subtitle) content['about.subtitle'] = about.subtitle as string;
    const bios = about.bios as string[] | undefined;
    if (bios) {
      bios.forEach((b, i) => { if (b) content[`about.bio.${i}`] = b; });
    }
    const details = about.details as Array<{ label: string; value: string }> | undefined;
    if (details) {
      details.forEach((d, i) => {
        if (d.label) content[`about.detail.${i}.label`] = d.label;
        if (d.value) content[`about.detail.${i}.value`] = d.value;
      });
    }
    const expertise = about.expertise as Array<{ title: string; description: string }> | undefined;
    if (expertise) {
      expertise.forEach((e, i) => {
        if (e.title) content[`about.expertise.${i}.title`] = e.title;
        if (e.description) content[`about.expertise.${i}.desc`] = e.description;
      });
    }
    const timeline = about.timeline as Array<{ title: string; description: string }> | undefined;
    if (timeline) {
      timeline.forEach((t, i) => {
        if (t.title) content[`about.timeline.${i}.title`] = t.title;
        if (t.description) content[`about.timeline.${i}.desc`] = t.description;
      });
    }
  } catch { /* skip */ }

  // Services page
  try {
    const svc = readData<Record<string, unknown>>('services.json', {});
    if (svc.title) content['services.title'] = svc.title as string;
    if (svc.subtitle) content['services.subtitle'] = svc.subtitle as string;
    if (svc.description) content['services.description'] = svc.description as string;
    const services = svc.services as Array<{ title: string; description: string; features?: string[]; price?: string }> | undefined;
    if (services) {
      services.forEach((s, i) => {
        if (s.title) content[`services.item.${i}.title`] = s.title;
        if (s.description) content[`services.item.${i}.desc`] = s.description;
        if (s.price) content[`services.item.${i}.price`] = s.price;
        s.features?.forEach((f, j) => {
          if (f) content[`services.item.${i}.feature.${j}`] = f;
        });
      });
    }
    const process = svc.process as Array<{ title: string; description: string }> | undefined;
    if (process) {
      process.forEach((p, i) => {
        if (p.title) content[`services.process.${i}.title`] = p.title;
        if (p.description) content[`services.process.${i}.desc`] = p.description;
      });
    }
  } catch { /* skip */ }

  // Portfolio page
  try {
    const portfolio = readData<Array<{ title: string; description: string }>>('portfolio.json', []);
    portfolio.forEach((p, i) => {
      if (p.title) content[`portfolio.${i}.title`] = p.title;
      if (p.description) content[`portfolio.${i}.desc`] = p.description;
    });
  } catch { /* skip */ }

  // Contact page
  try {
    const contact = readData<Record<string, unknown>>('contact.json', {});
    if (contact.title) content['contact.title'] = contact.title as string;
    if (contact.subtitle) content['contact.subtitle'] = contact.subtitle as string;
    if (contact.description) content['contact.description'] = contact.description as string;
    const info = contact.contactInfo as Array<{ label: string }> | undefined;
    if (info) {
      info.forEach((c, i) => {
        if (c.label) content[`contact.info.${i}.label`] = c.label;
      });
    }
  } catch { /* skip */ }

  // Footer
  try {
    const footer = readData<Record<string, unknown>>('footer.json', {});
    if (footer.copyright) content['footer.copyright'] = footer.copyright as string;
    if (footer.techStack) content['footer.techStack'] = footer.techStack as string;
    if (footer.bio) content['footer.bio'] = footer.bio as string;
    const ql = footer.quickLinks as Array<{ label: string }> | undefined;
    if (ql) ql.forEach((l, i) => { if (l.label) content[`footer.quickLink.${i}`] = l.label; });
    const fs = footer.footerServices as Array<{ label: string }> | undefined;
    if (fs) fs.forEach((s, i) => { if (s.label) content[`footer.service.${i}`] = s.label; });
  } catch { /* skip */ }

  // Site nav links
  try {
    const site = readData<Record<string, unknown>>('site.json', {});
    const navLinks = site.navLinks as Array<{ label: string }> | undefined;
    if (navLinks) {
      navLinks.forEach((l, i) => {
        if (l.label) content[`nav.${i}`] = l.label;
      });
    }
  } catch { /* skip */ }

  // Common UI strings
  content['ui.technicalSkills'] = 'Technical Skills';
  content['ui.featuredProjects'] = 'Featured Projects';
  content['ui.viewAllProjects'] = 'View All Projects';
  content['ui.readyToStart'] = 'Ready to Start Your Project?';
  content['ui.ctaDescription'] = "Let's build something amazing together. I'm available for freelance projects and consulting.";
  content['ui.getInTouch'] = 'Get In Touch';
  content['ui.hireMe'] = 'Hire Me';
  content['ui.viewProject'] = 'View Project';
  content['ui.myJourney'] = 'My Journey';
  content['ui.areasOfExpertise'] = 'Areas of Expertise';
  content['ui.quickLinks'] = 'Quick Links';
  content['ui.services'] = 'Services';
  content['ui.skillsSubtitle'] = 'Years of hands-on experience have shaped my expertise across these key areas.';
  content['ui.projectsSubtitle'] = 'Some of my recent work that showcases my expertise.';
  content['ui.sendMessage'] = 'Send Message';
  content['ui.yourName'] = 'Your Name';
  content['ui.yourEmail'] = 'Your Email';
  content['ui.subject'] = 'Subject';
  content['ui.yourMessage'] = 'Your Message';
  content['ui.hireForProject'] = 'Hire Me for Your Project';
  content['ui.myWork'] = 'My Work';
  content['ui.portfolio'] = 'Portfolio';
  content['ui.privacyPolicy'] = 'Privacy Policy';
  content['ui.termsOfService'] = 'Terms of Service';

  return content;
}

export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Mode 1: Translate specific texts
    if (body.texts && Array.isArray(body.texts)) {
      const { texts, sourceLang, targetLang } = body;
      if (!targetLang || !sourceLang) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
      }
      const translations = await translateTexts(texts, sourceLang, targetLang);
      return NextResponse.json({ translations });
    }

    // Mode 2: Auto-translate all page content
    if (body.targetLang && body.mode === 'pages') {
      const { sourceLang, targetLang } = body;
      const content = collectAllPageContent();
      const keys = Object.keys(content);
      const texts = Object.values(content);

      const translations = await translateTexts(texts, sourceLang, targetLang);
      const result: Record<string, string> = {};
      keys.forEach((key, i) => {
        result[key] = translations[i];
      });

      return NextResponse.json({ translations: result });
    }

    // Mode 3: Get all translatable content (for preview)
    if (body.mode === 'collect') {
      const content = collectAllPageContent();
      return NextResponse.json({ content });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}

async function translateTexts(texts: string[], sourceLang: string, targetLang: string): Promise<string[]> {
  const translations: string[] = [];

  for (const text of texts) {
    if (!text || typeof text !== 'string') {
      translations.push(text || '');
      continue;
    }

    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
      );
      const data = await res.json();

      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        let translated = data.responseData.translatedText;
        if (text[0] === text[0].toLowerCase() && translated[0] !== translated[0].toLowerCase()) {
          translated = translated[0].toLowerCase() + translated.slice(1);
        }
        translations.push(translated);
      } else {
        translations.push(text);
      }
    } catch {
      translations.push(text);
    }
  }

  return translations;
}
