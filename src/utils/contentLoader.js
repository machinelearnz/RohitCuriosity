import yaml from 'js-yaml';
import { resolveMediaUrl, compileMarkdownWithMedia } from './mediaStore';

/**
 * Safe date parsing functions that never throw RangeError
 */
export function safeFormatDate(val, fallback = 'Aug 2026') {
  try {
    if (!val) return fallback;
    const d = new Date(val);
    if (isNaN(d.getTime())) return fallback;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return fallback;
  }
}

export function safeIsoDate(val, fallback = '2026-08-01') {
  try {
    if (!val) return fallback;
    const d = new Date(val);
    if (isNaN(d.getTime())) return fallback;
    return d.toISOString().split('T')[0];
  } catch (e) {
    return fallback;
  }
}

/**
 * Parses frontmatter and markdown body from raw markdown string
 */
export function parseMarkdown(rawContent) {
  if (!rawContent || typeof rawContent !== 'string') {
    return { frontmatter: {}, content: '' };
  }

  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
  const match = rawContent.match(frontmatterRegex);

  if (match) {
    let frontmatter = {};
    try {
      frontmatter = yaml.load(match[1]) || {};
    } catch (e) {
      console.warn('Failed to parse YAML with js-yaml, using fallback line parser:', e);
      try {
        const lines = match[1].split('\n');
        lines.forEach(line => {
          const colonIdx = line.indexOf(':');
          if (colonIdx > 0) {
            const key = line.slice(0, colonIdx).trim();
            let val = line.slice(colonIdx + 1).trim();
            if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
            frontmatter[key] = val;
          }
        });
      } catch (err) {}
    }
    const content = match[2] ? match[2].trim() : '';
    return { frontmatter, content };
  }

  return { frontmatter: {}, content: rawContent };
}

/**
 * Calculates estimated read time from markdown text
 */
export function calculateReadTime(text) {
  if (!text || typeof text !== 'string') return '3 min read';
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  return `${minutes} min read`;
}

/**
 * Extracts slug from file path e.g. /src/content/blogs/macro-shifts.md -> macro-shifts
 */
export function getSlugFromPath(path) {
  if (!path || typeof path !== 'string') return 'post';
  const parts = path.split('/');
  const filename = parts[parts.length - 1];
  return filename.replace(/\.md$/, '');
}

const fallbackBlogs = [
  {
    slug: '2026-market-views-macro-shifts',
    path: '/src/content/blogs/2026-market-views-macro-shifts.md',
    title: '2026 Macro Outlook: Sovereign AI, Compute Math & Capital Allocation',
    date: '2026-08-15',
    formattedDate: 'Aug 15, 2026',
    category: 'Market Views',
    author: 'Rohit Curiosity',
    readTime: '7 min read',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    tags: ['Macroeconomics', 'Sovereign AI', 'Venture Capital', 'Quantitative Math', 'Compute Grid'],
    excerpt: 'An in-depth mathematical analysis of how compute energy constraints, sovereign model infrastructure, and decentralized capital flows are reshaping tech equity multiples in 2026.',
    content: `# 2026 Macro Outlook: Sovereign AI, Compute Math & Capital Allocation

The global macroeconomic landscape has entered a pivotal transition phase. What began as a raw compute land-grab has transformed into a complex geopolitical race involving **sovereign compute clusters**, **next-generation grid capacity**, and **dynamic capital repricing**.

---

## 1. Mathematical Energy Model & Formula

Over the past three years, software scalability was largely a function of algorithmic optimization and model parameters. As Einstein demonstrated mass-energy equivalence with $E = mc^2$, sovereign compute centers operate on baseline energy conversion.

> [!NOTE]
> The true moat of modern artificial intelligence is no longer token generation speed, but reliable baseload power interconnects and geothermal/nuclear colocation.

### The Sovereign Compute Yield Equation

We define the Net Economic Yield of a Sovereign AI Node $Y_{node}$ using KaTeX math notation:

$$Y_{node} = \\sum_{t=1}^{T} \\frac{\\alpha \\cdot \\text{FLOPs}_t - \\beta \\cdot P_{\\grid}(t) - \\gamma \\cdot C_{\\cool}}{(1 + r)^t}$$

Where:
- $\\text{FLOPs}_t$ represents effective matrix multiplication throughput at time $t$
- $P_{\\grid}(t)$ is the spot electricity price per Megawatt-hour (MWh)
- $\\alpha, \\beta, \\gamma$ are localized efficiency scaling constants
- $r$ represents the sovereign discount rate

---

## 2. Infrastructure Architecture & Embedded Body Image

Sovereign compute nodes operate on multi-region edge mesh routing. Below is the primary data center infrastructure colocation setup:

![High-density sovereign GPU compute data center colocation in Northern Europe](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80)

### Mesh Topology Diagram

\`\`\`mermaid
graph TD
    A[Global Edge Ingestion] -->|Real-time Telemetry| B(Sovereign Mesh Gateway)
    B -->|Filtered Data| C{Compute Allocator}
    C -->|High Priority| D[H100/B200 GPU Cluster]
    C -->|Background RAG| E[Vector Store & Disk Cache]
    D -->|Inference Output| F[Client Cockpit & API Response]
    E -->|Context Synthesis| F
\`\`\`

---

## 3. Short Python Snippet: Hello World & Telemetry

Below is a short Python program snippet initializing the telemetry engine:

\`\`\`python
# Short Python Hello World & Compute Telemetry Snippet
def main():
    print("Hello World! Welcome to Rohit Curiosity Intelligence Engine.")

if __name__ == "__main__":
    main()
\`\`\`

### Advanced Quantitative Risk Simulation

For broader risk modeling across 10,000 Monte Carlo scenarios:

\`\`\`python
import numpy as np

def calculate_energy_var(num_simulations=10000, baseline_cost_mwh=45.0, volatility=0.28):
    """Calculates 99% Value at Risk (VaR) for GPU data center energy consumption."""
    np.random.seed(42)
    daily_returns = np.random.normal(0.001, volatility / np.sqrt(252), (num_simulations, 252))
    price_paths = baseline_cost_mwh * np.exp(np.cumsum(daily_returns, axis=1))
    
    max_costs = np.max(price_paths, axis=1)
    var_99 = np.percentile(max_costs, 99)
    
    return {
        "mean_mwh_cost": np.mean(max_costs),
        "var_99_mwh_cost": var_99
    }

metrics = calculate_energy_var()
print(f"99% VaR Peak MWh Cost: \${metrics['var_99_mwh_cost']:.2f}")
\`\`\`

---

## 4. Summary & Strategic Outlook

1. **Energy Interconnect Moats**: Software wrappers without direct power capacity rights face margin compression.
2. **Local Model Sovereignty**: National mandates require on-premise data localization and LLM hosting.
3. **Capital Repricing**: Vertically integrated compute providers secure higher valuation multiples.`
  },
  {
    slug: 'ai-agents-autonomous-future',
    path: '/src/content/blogs/ai-agents-autonomous-future.md',
    title: 'The Architecture of Autonomous Systems: Beyond Chatbots to Action Execution',
    date: '2026-08-20',
    formattedDate: 'Aug 20, 2026',
    category: 'Tech Frontiers',
    author: 'Rohit Curiosity',
    readTime: '5 min read',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
    tags: ['AI Agents', 'Autonomous Systems', 'Architecture', 'Engineering'],
    excerpt: 'Moving past conversational wrappers: How deterministic tool routing, event loops, and multi-agent coordination establish real enterprise utility.',
    content: `# The Architecture of Autonomous Systems: Beyond Chatbots

The conversation around AI has progressed beyond conversational generation. The actual challenge — and immense market opportunity — lies in **stateful action execution**.

When an agent is empowered to read file systems, propose code diffs, verify outcomes, and deploy applications without human friction, the paradigm of software development fundamentally transforms.`
  },
  {
    slug: 'venture-building-playbook',
    path: '/src/content/blogs/venture-building-playbook.md',
    title: 'The Zero-to-One Venture Playbook in an Age of Instant Prototyping',
    date: '2026-08-25',
    formattedDate: 'Aug 25, 2026',
    category: 'Venture Architecture',
    author: 'Rohit Curiosity',
    readTime: '7 min read',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
    tags: ['Venture Building', 'Product Strategy', 'Product-Market Fit', '0 to 1'],
    excerpt: 'How rapid prototyping, micro-feedback loops, and capital discipline allow solopreneurs and boutique venture studios to outpace incumbent giants.',
    content: `# The Zero-to-One Venture Playbook in an Age of Instant Prototyping

When speed of execution approaches zero cost, how does a modern builder achieve lasting product defensibility?

In this field guide, we examine the structural tactics applied at **Rohit Curiosity** to incubate, validate, and scale digital products and venture vehicles.`
  }
];

const fallbackPortfolio = [
  {
    slug: 'fintech-intelligence-dashboard',
    path: '/src/content/portfolio/fintech-intelligence-dashboard.md',
    title: 'AlphaPulse: Real-Time Institutional Liquidity & Macro Radar',
    date: '2026-07-15',
    formattedDate: 'Jul 2026',
    category: 'Fintech & Data',
    client: 'Global Family Office & Prop Desks',
    role: 'Lead Product Strategist & Architect',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    technologies: ['React', 'Tailwind CSS', 'WebSocket Feeds', 'Time-Series Analytics', 'D3.js'],
    demoUrl: 'https://example.com/alphapulse-demo',
    githubUrl: 'https://github.com/example/alphapulse',
    stats: { metric: 'AUM Monitored', value: '$420M+' },
    summary: 'An ultra-low latency analytics terminal aggregating multi-asset order book depth, sovereign yield spreads, and institutional dark pool signals.',
    content: `# AlphaPulse: Real-Time Institutional Liquidity & Macro Radar\n\nAlphaPulse was architected to solve a critical information asymmetry problem for modern family offices and quantitative discretionary traders: **consolidating cross-asset liquidity signals into a singular low-latency cockpit.**`
  },
  {
    slug: 'curiosity-knowledge-engine',
    path: '/src/content/portfolio/curiosity-knowledge-engine.md',
    title: 'OmniContext: Autonomous Knowledge Synthesizer for Research Teams',
    date: '2026-06-10',
    formattedDate: 'Jun 2026',
    category: 'AI & Knowledge',
    client: 'Venture Studios & Tech Think Tanks',
    role: 'Full-Stack System Designer',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    technologies: ['React', 'Vector Embeddings', 'RAG Pipeline', 'Tailwind CSS', 'FastAPI'],
    demoUrl: 'https://example.com/omnicontext-demo',
    githubUrl: 'https://github.com/example/omnicontext',
    stats: { metric: 'Research Hours Saved', value: '1,200+ hrs/mo' },
    summary: 'An autonomous ingestion and synthesis engine that indexes multi-modal academic preprints, SEC filings, and GitHub repositories into queryable mental models.',
    content: `# OmniContext: Autonomous Knowledge Synthesizer\n\nResearch analysts spend upwards of 35% of their working hours manually triaging PDFs, scraping quarterly earnings transcripts, and mapping competitive feature matrices.`
  },
  {
    slug: 'venture-fund-allocation-model',
    path: '/src/content/portfolio/venture-fund-allocation-model.md',
    title: 'VentureSim: Dynamic Cap Table & Fund Return Optimization Engine',
    date: '2026-05-01',
    formattedDate: 'May 2026',
    category: 'Venture Modeling',
    client: 'Early-Stage Micro-VC Funds',
    role: 'Quantitative Financial Modeler',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    technologies: ['TypeScript', 'React', 'Monte Carlo Simulations', 'Tailwind CSS', 'Recharts'],
    demoUrl: 'https://example.com/venturesim-demo',
    githubUrl: 'https://github.com/example/venturesim',
    stats: { metric: 'Simulations Run', value: '50,000+' },
    summary: 'A web-based financial simulation engine executing 10,000+ Monte Carlo runs to model fund reserves, pro-rata dilution scenarios, and optimal exit thresholds.',
    content: `# VentureSim: Dynamic Cap Table & Fund Return Optimization\n\nPredicting venture fund performance across multiple market cycles requires moving beyond rigid static spreadsheets.`
  }
];

/**
 * Loads all blog posts from markdown files dynamically
 */
export function getAllBlogs() {
  try {
    const blogFiles = import.meta.glob('../content/blogs/*.md', { query: '?raw', eager: true });
    const entries = Object.entries(blogFiles);

    let blogs = [];
    if (entries.length === 0) {
      blogs = [...fallbackBlogs];
    } else {
      blogs = entries.map(([path, rawModule]) => {
        const rawContent = typeof rawModule === 'string' ? rawModule : (rawModule && rawModule.default) || '';
        const { frontmatter, content } = parseMarkdown(rawContent);
        const slug = getSlugFromPath(path);

        return {
          slug,
          path,
          title: frontmatter.title || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          date: safeIsoDate(frontmatter.date, '2026-08-01'),
          formattedDate: safeFormatDate(frontmatter.date, 'Aug 2026'),
          excerpt: frontmatter.excerpt || (content ? content.slice(0, 150) + '...' : ''),
          coverImage: resolveMediaUrl(frontmatter.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'),
          category: frontmatter.category || 'Market Views',
          tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : (frontmatter.tags ? [frontmatter.tags] : ['Strategy', 'Analysis']),
          author: frontmatter.author || 'Rohit Curiosity',
          readTime: frontmatter.readTime || calculateReadTime(content),
          featured: Boolean(frontmatter.featured),
          content: content || ''
        };
      });
    }

    // Merge custom posts saved from Content Studio
    try {
      const savedCustom = localStorage.getItem('rohit_custom_blogs');
      if (savedCustom) {
        const customPosts = JSON.parse(savedCustom);
        if (Array.isArray(customPosts)) {
          customPosts.forEach(cp => {
            const compiledPost = {
              ...cp,
              coverImage: resolveMediaUrl(cp.coverImage),
              content: cp.content || ''
            };
            const idx = blogs.findIndex(b => b.slug === cp.slug);
            if (idx >= 0) {
              blogs[idx] = { ...blogs[idx], ...compiledPost };
            } else {
              blogs.unshift(compiledPost);
            }
          });
        }
      }
    } catch (e) {}

    return blogs.sort((a, b) => {
      try {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } catch (e) {
        return 0;
      }
    });
  } catch (e) {
    console.warn('Error loading blogs dynamically, using fallback data:', e);
    return fallbackBlogs;
  }
}

/**
 * Extracts a Year > Month hierarchical tree from an array of blog posts
 */
export function getYearMonthHierarchy(blogs = []) {
  const tree = {};

  blogs.forEach(blog => {
    try {
      const d = new Date(blog.date);
      if (isNaN(d.getTime())) return;
      const year = d.getFullYear().toString();
      const month = d.toLocaleDateString('en-US', { month: 'Long' });

      if (!tree[year]) {
        tree[year] = { count: 0, months: {} };
      }
      tree[year].count += 1;

      if (!tree[year].months[month]) {
        tree[year].months[month] = [];
      }
      tree[year].months[month].push(blog);
    } catch (e) {}
  });

  return tree;
}


/**
 * Loads all portfolio projects from markdown files dynamically
 */
export function getAllPortfolio() {
  try {
    const projectFiles = import.meta.glob('../content/portfolio/*.md', { query: '?raw', eager: true });
    const entries = Object.entries(projectFiles);

    if (entries.length === 0) {
      return fallbackPortfolio;
    }

    const projects = entries.map(([path, rawModule]) => {
      const rawContent = typeof rawModule === 'string' ? rawModule : (rawModule && rawModule.default) || '';
      const { frontmatter, content } = parseMarkdown(rawContent);
      const slug = getSlugFromPath(path);

      return {
        slug,
        path,
        title: frontmatter.title || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        date: safeIsoDate(frontmatter.date, '2026-08-01'),
        formattedDate: safeFormatDate(frontmatter.date, '2026'),
        category: frontmatter.category || 'Venture & Tech',
        summary: frontmatter.summary || frontmatter.excerpt || (content ? content.slice(0, 140) + '...' : ''),
        coverImage: frontmatter.coverImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        technologies: Array.isArray(frontmatter.technologies) ? frontmatter.technologies : (frontmatter.technologies ? [frontmatter.technologies] : ['React', 'AI', 'Analytics']),
        stats: frontmatter.stats || { metric: 'Impact', value: 'High' },
        demoUrl: frontmatter.demoUrl || '#',
        githubUrl: frontmatter.githubUrl || '',
        featured: Boolean(frontmatter.featured),
        client: frontmatter.client || 'Internal Initiative',
        role: frontmatter.role || 'Lead Architect & Strategist',
        content: content || ''
      };
    });

    return projects.sort((a, b) => {
      try {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } catch (e) {
        return 0;
      }
    });
  } catch (e) {
    console.warn('Error loading portfolio dynamically, using fallback data:', e);
    return fallbackPortfolio;
  }
}
