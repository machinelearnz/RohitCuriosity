import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const blogsDir = path.join(rootDir, 'src', 'content', 'blogs');
const portfolioDir = path.join(rootDir, 'src', 'content', 'portfolio');

// Ensure directories exist
if (!fs.existsSync(blogsDir)) fs.mkdirSync(blogsDir, { recursive: true });
if (!fs.existsSync(portfolioDir)) fs.mkdirSync(portfolioDir, { recursive: true });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (query, defaultValue = '') => {
  return new Promise((resolve) => {
    const prompt = defaultValue ? `${query} [${defaultValue}]: ` : `${query}: `;
    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function createBlog() {
  console.log('\n📝 --- Create New Market View / Blog Article ---\n');

  const title = await ask('Article Title', 'Emerging Trends in Sovereign Compute');
  const slug = slugify(title);
  const category = await ask('Category', 'Market Views');
  const author = await ask('Author', 'Rohit Curiosity');
  const readTime = await ask('Estimated Read Time', '5 min read');
  const tagsInput = await ask('Tags (comma separated)', 'Macroeconomics, Sovereign AI, Infrastructure');
  const excerpt = await ask('Short Excerpt / Summary', 'An analysis of market structural shifts.');
  const coverImage = await ask('Cover Image URL', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80');

  const tags = tagsInput.split(',').map(t => `"${t.trim()}"`).join(', ');
  const dateStr = new Date().toISOString().split('T')[0];

  const content = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${dateStr}"
category: "${category}"
author: "${author}"
readTime: "${readTime}"
featured: false
coverImage: "${coverImage}"
tags: [${tags}]
excerpt: "${excerpt.replace(/"/g, '\\"')}"
---

# ${title}

Write your main thesis and article content here.

---

## 1. Core Market Thesis
- **Observation 1:** Detail your primary insight.
- **Observation 2:** Supporting quantitative evidence.

> "A memorable quote or key takeaway for your readers."

---

## 2. Strategic Takeaways
Summarize key actions and strategic perspectives for founders and capital allocators.
`;

  const filePath = path.join(blogsDir, `${slug}.md`);
  if (fs.existsSync(filePath)) {
    const overwrite = await ask(`⚠️  File ${slug}.md already exists. Overwrite? (y/N)`, 'N');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('❌ Cancelled.');
      return;
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`\n✅ Successfully created article: ${path.relative(rootDir, filePath)}`);
  console.log(`🚀 The website will automatically display your new post!\n`);
}

async function createPortfolio() {
  console.log('\n💼 --- Create New Portfolio / Venture Showcase ---\n');

  const title = await ask('Project Title', 'SignalCraft: Real-Time Market Intelligence');
  const slug = slugify(title);
  const category = await ask('Category', 'Fintech & Data');
  const client = await ask('Client / Organization', 'Global Family Office');
  const role = await ask('Role', 'Lead System Architect');
  const statMetric = await ask('Highlight Metric Name', 'AUM Monitored');
  const statValue = await ask('Highlight Metric Value', '$350M+');
  const techInput = await ask('Technologies (comma separated)', 'React, Tailwind CSS, Analytics, WebSockets');
  const summary = await ask('Short Summary', 'An ultra-low latency analytics terminal.');
  const demoUrl = await ask('Demo URL (or #)', '#');
  const coverImage = await ask('Cover Image URL', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80');

  const technologies = techInput.split(',').map(t => `"${t.trim()}"`).join(', ');
  const dateStr = new Date().toISOString().split('T')[0];

  const content = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${dateStr}"
category: "${category}"
client: "${client}"
role: "${role}"
featured: false
coverImage: "${coverImage}"
technologies: [${technologies}]
demoUrl: "${demoUrl}"
githubUrl: ""
stats:
  metric: "${statMetric}"
  value: "${statValue}"
summary: "${summary.replace(/"/g, '\\"')}"
---

# ${title}

Executive overview of the venture system and architecture.

---

## 🎯 The Objective
Detail the business context and challenges solved.

---

## 💡 The Solution Architecture
- **Architecture Highlights:** Key system designs implemented.
- **Technology Stack:** Why specific tools were selected.

---

## 🚀 Quantified Outcomes
- High measurable impact deliverable.
`;

  const filePath = path.join(portfolioDir, `${slug}.md`);
  if (fs.existsSync(filePath)) {
    const overwrite = await ask(`⚠️  File ${slug}.md already exists. Overwrite? (y/N)`, 'N');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('❌ Cancelled.');
      return;
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`\n✅ Successfully created portfolio case study: ${path.relative(rootDir, filePath)}`);
  console.log(`🚀 The website will automatically showcase your new project!\n`);
}

async function listContent() {
  console.log('\n📚 --- Current Content in CMS ---\n');
  
  const blogs = fs.readdirSync(blogsDir).filter(f => f.endsWith('.md'));
  console.log(`📰 Blog Posts (${blogs.length}):`);
  blogs.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));

  const portfolio = fs.readdirSync(portfolioDir).filter(f => f.endsWith('.md'));
  console.log(`\n💼 Portfolio Showcases (${portfolio.length}):`);
  portfolio.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
  console.log('');
}

async function main() {
  const args = process.argv.slice(2);
  const typeArg = args.find(a => a.startsWith('--type='));

  if (typeArg) {
    const type = typeArg.split('=')[1];
    if (type === 'blog') {
      await createBlog();
      rl.close();
      return;
    } else if (type === 'portfolio') {
      await createPortfolio();
      rl.close();
      return;
    }
  }

  console.log('\n=========================================');
  console.log('  🌟 CuriosityInc Markdown CMS Wizard  ');
  console.log('=========================================');
  console.log('1. 📝 Create New Blog Article');
  console.log('2. 💼 Create New Portfolio Item');
  console.log('3. 📚 List All Articles & Projects');
  console.log('4. 🚪 Exit\n');

  const choice = await ask('Select an option (1-4)', '1');

  switch (choice) {
    case '1':
      await createBlog();
      break;
    case '2':
      await createPortfolio();
      break;
    case '3':
      await listContent();
      break;
    case '4':
    default:
      console.log('👋 Goodbye!');
      break;
  }

  rl.close();
}

main().catch(err => {
  console.error('Error running CMS wizard:', err);
  rl.close();
});
