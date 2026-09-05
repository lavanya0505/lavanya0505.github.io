import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, OrbitControls, Sparkles } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Check, Code2, Database, Mail, Menu, Moon, Network, Orbit, Sparkles as SparkleIcon, Sun, X, Zap } from 'lucide-react'
import { useRef, useState } from 'react'
import * as THREE from 'three'
import './App.css'

type Project = {
  number: string
  title: string
  type: string
  summary: string
  detail: string
  metrics: string[]
  stack: string[]
  color: string
  link: string
}

const projects: Project[] = [
  {
    number: '01', title: 'DocuPilot', type: 'DOCUMENT INTELLIGENCE / RAG',
    summary: 'A citation-first document intelligence system that turns messy files into searchable, accountable answers.',
    detail: 'The ingestion pipeline handles 19 file extensions, routes scans through OCR, stores 384-dimensional embeddings in PostgreSQL + pgvector, and keeps long-running work off the request path with Celery and Redis.',
    metrics: ['19 file types', '384-d embeddings', '100 char OCR threshold'],
    stack: ['FastAPI', 'PostgreSQL', 'pgvector', 'Celery', 'Redis', 'Next.js', 'Tesseract'],
    color: '#22d3ee', link: 'https://github.com/lavanya0505/DocuPilot',
  },
  {
    number: '02', title: 'OrchestrAI', type: 'AGENT SYSTEMS / TOOL USE',
    summary: 'A from-scratch agent orchestration core where research, coding and planning agents can act, fail, and recover.',
    detail: 'A readable ReAct loop decides when to call a tool, executes sandboxed work, feeds results back to the model, and stops within a step budget. The harness is tested with mocked LLM clients, not just live API calls.',
    metrics: ['3 agent modes', '14 tests passing', 'bounded execution'],
    stack: ['Python', 'Groq', 'ReAct', 'Tool Registry', 'pytest', 'Sandboxing'],
    color: '#a78bfa', link: 'https://github.com/lavanya0505/OrchestrAI',
  },
  {
    number: '03', title: 'CERAI Eval & Critique', type: 'LLM GOVERNANCE / SAFETY',
    summary: 'A multi-agent governance layer that stress-tests conversational AI before it reaches users.',
    detail: 'Five specialist evaluators score safety, hallucination, healthcare risk, trust calibration and linguistic robustness. Weighted consensus returns a deployment verdict, trust passport and structured incident report.',
    metrics: ['5 evaluator agents', '0–100 consensus', 'GPU-free runtime'],
    stack: ['FastAPI', 'Streamlit', 'Groq', 'Llama 3.3', 'Consensus', 'Docker'],
    color: '#c3f53c', link: 'https://github.com/lavanya0505/cerai-eval-critique',
  },
  {
    number: '04', title: 'Research Intelligence', type: 'HYBRID RETRIEVAL / RESEARCH',
    summary: 'A research assistant that combines semantic search with a knowledge graph to surface gaps, not just papers.',
    detail: 'Live ArXiv ingestion feeds FAISS and a NetworkX graph. Reciprocal Rank Fusion merges both retrieval paths before Mistral 7B synthesizes a cited research answer through Ollama.',
    metrics: ['15 papers / query', '15–30s first query', '3–6s cached query'],
    stack: ['FAISS', 'NetworkX', 'spaCy', 'Mistral 7B', 'Ollama', 'Gradio'],
    color: '#f472b6', link: 'https://github.com/lavanya0505/research-intelligence-assistant',
  },
  {
    number: '05', title: 'FraudForge', type: 'MLOPS / REAL-TIME ML',
    summary: 'A self-healing fraud platform that treats model monitoring and retraining as first-class product behavior.',
    detail: 'The documented benchmark covers 590K transactions with 0.9464 AUC ROC. FastAPI serves predictions while Airflow, MLflow, Prometheus and Grafana connect training, monitoring, model registry and operations.',
    metrics: ['0.9464 AUC ROC', '590K transactions', '48ms P99'],
    stack: ['XGBoost', 'FastAPI', 'Airflow', 'MLflow', 'Prometheus', 'Grafana'],
    color: '#fb7185', link: 'https://github.com/lavanya0505/FraudForge',
  },
]

const stackGroups = [
  { label: 'LANGUAGES', icon: Code2, items: ['Python', 'JavaScript', 'TypeScript', 'Node.js', 'SQL', 'HTML', 'CSS', 'Bash'] },
  { label: 'AI / GENAI', icon: SparkleIcon, items: ['LLMs', 'Prompt Engineering', 'RAG', 'Vector Search', 'LangChain', 'LangGraph', 'Agents', 'Evaluation', 'HuggingFace'] },
  { label: 'BACKEND / DATA', icon: Database, items: ['FastAPI', 'PostgreSQL', 'MongoDB', 'pgvector', 'Redis', 'FAISS', 'NetworkX', 'REST APIs'] },
  { label: 'ML / VISION', icon: Orbit, items: ['TensorFlow', 'OpenCV', 'Anomaly Detection', 'SentenceTransformers', 'Tesseract OCR', 'MLOps', 'Model Evaluation'] },
  { label: 'CLOUD / DEVOPS', icon: Network, items: ['AWS', 'Bedrock', 'Docker', 'Kubernetes concepts', 'CI/CD', 'GitHub Actions', 'Linux'] },
  { label: 'PRODUCT / COLLAB', icon: Check, items: ['React.js', 'Gradio', 'Streamlit', 'Technical Documentation', 'Agile / SCRUM', 'Cross-functional Leadership'] },
]

const experiences = [
  {
    company: 'PwC', location: 'Gurugram, India', role: 'GenAI and Python Engineer', date: 'AUG 2026 — PRESENT', color: '#22d3ee',
    bullets: ['Developing production-grade GenAI solutions in Python with secure coding practices, privacy-aware user experiences and measurable business impact.', 'Architecting end-to-end LLM pipelines from data preparation through evaluation and deployment for enterprise clients.', 'Collaborating with product, design and engineering teams on solution architecture, technical requirements and agile delivery.', 'Evaluating emerging GenAI frameworks and LLM capabilities while maintaining reliability and security standards.'],
  },
  {
    company: 'Connecwrk', location: 'Gurugram, India', role: 'AI/ML Engineer Intern', date: 'JUL 2025 — APR 2026', color: '#a78bfa',
    bullets: ['Built evaluation harnesses for a production natural-language discovery experience, measuring response quality, consistency, relevance and structured defects.', 'Designed and shipped FastAPI services for conversational search, improving system match accuracy by 40% through iterative performance refinement.', 'Built Docker and GitHub Actions CI/CD pipelines for repeatable AI-service delivery, monitoring and minimal-downtime rollouts.', 'Designed SQL and MongoDB data layers and validation pipelines for high-throughput production features under real user load.'],
  },
  {
    company: 'QCall AI & 60dB AI', location: 'Remote / India', role: 'AI/ML Engineer', date: 'MAY 2026 — JUN 2026', color: '#f472b6',
    bullets: ['Designed multi-stage verification pipelines for production voice AI systems and customer-facing conversational quality.', 'Authored version-controlled prompt and response libraries so dialogue behavior could be managed like production code.', 'Built logging and tracing tools for agent behavior visibility, root-cause analysis and stakeholder-facing quality diagnosis.'],
  },
]

const education = [
  { school: 'The NorthCap University', place: 'Gurugram, India', degree: 'Bachelor of Technology — Computer Science (AI/ML)', date: 'JUL 2022 — JUN 2026', detail: 'GPA: 8.65', color: '#c3f53c' },
]


function NeuralScene() {
  const group = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = state.clock.elapsedTime * 0.08 + state.pointer.x * 0.12
    group.current.rotation.x = state.pointer.y * 0.08
  })
  return (
    <group ref={group}>
      <Float speed={1.3} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh>
          <icosahedronGeometry args={[1.15, 2]} />
          <meshStandardMaterial color="#101d2c" emissive="#0b5460" emissiveIntensity={1.7} wireframe transparent opacity={0.85} />
        </mesh>
        <mesh scale={0.6}>
          <icosahedronGeometry args={[1.15, 2]} />
          <meshBasicMaterial color="#c3f53c" wireframe transparent opacity={0.16} />
        </mesh>
      </Float>
      <Sparkles count={90} scale={7} size={2} speed={0.25} color="#22d3ee" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.55} />
    </group>
  )
}

function App() {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [selected, setSelected] = useState<Project | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [light, setLight] = useState(false)
  const visibleProjects = activeFilter === 'ALL' ? projects : projects.filter((project) => project.type.includes(activeFilter))

  return (
    <div className={light ? 'site light' : 'site'}>
      <nav className="nav">
        <a className="brand" href="#top"><span className="brand-mark">LM</span><span>LAVANYA<br /><b>MADAN</b></span></a>
        <div className={menuOpen ? 'nav-links open' : 'nav-links'}>
          <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
          <a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a>
          <a href="#stack" onClick={() => setMenuOpen(false)}>Stack</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </div>
        <div className="nav-actions">
          <button className="icon-button" aria-label="Toggle theme" onClick={() => setLight(!light)}>{light ? <Moon size={16} /> : <Sun size={16} />}</button>
          <a className="nav-cta" href="mailto:lavieee2206@gmail.com">Let&apos;s talk <ArrowUpRight size={15} /></a>
          <button className="menu-button" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </nav>

      <main id="top">
        <section className="hero section-shell">
          <div className="hero-copy">
            <motion.p className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>AI ENGINEER / SYSTEMS BUILDER</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>Intelligence,<br /><em>engineered.</em></motion.h1>
            <motion.p className="hero-intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>I build AI products that retrieve evidence, use tools, evaluate their own outputs, and hold up beyond the notebook.</motion.p>
            <motion.div className="hero-links" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
              <a className="button primary" href="#work">Explore the work <ArrowUpRight size={16} /></a>
              <a className="text-link" href="https://www.linkedin.com/in/lavanya-madaan-407237268" target="_blank" rel="noreferrer">Connect on LinkedIn <ArrowUpRight size={15} /></a>
            </motion.div>
            <div className="hero-proof"><span><span className="status-dot" /> Available for AI/ML roles</span><span>India · International · Remote</span></div>
          </div>
          <div className="hero-scene"><div className="scene-label"><span>LIVE SYSTEM</span><span>01 / 05</span></div><Canvas camera={{ position: [0, 0, 4.5], fov: 42 }}><ambientLight intensity={0.5} /><pointLight position={[3, 2, 4]} color="#22d3ee" intensity={18} /><pointLight position={[-3, -2, 2]} color="#c3f53c" intensity={10} /><NeuralScene /><Environment preset="night" /></Canvas><div className="scene-caption"><span>REASON</span><span>RETRIEVE</span><span>ACT</span><span>EVALUATE</span></div></div>
        </section>

        <section className="marquee"><div className="marquee-track">AGENTIC AI <span>✦</span> RAG SYSTEMS <span>✦</span> LLM EVALUATION <span>✦</span> PRODUCTION ML <span>✦</span> AGENTIC AI <span>✦</span> RAG SYSTEMS <span>✦</span> LLM EVALUATION <span>✦</span> PRODUCTION ML <span>✦</span></div></section>

        <section id="work" className="section-shell content-section">
          <div className="section-heading"><div><p className="eyebrow">SELECTED WORK / 2024—26</p><h2>Systems that<br /><em>actually run.</em></h2></div><p className="section-note">Each project is a working argument for a different part of the AI engineering stack.</p></div>
          <div className="filters">{['ALL', 'RAG', 'AGENT', 'MLOPS', 'RESEARCH'].map((filter) => <button className={activeFilter === filter ? 'filter active' : 'filter'} key={filter} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div>
          <div className="project-list">
            {visibleProjects.map((project) => <motion.article layout className="project-row" key={project.title} style={{ '--project-color': project.color } as React.CSSProperties}>
              <div className="project-index">{project.number}</div><div className="project-main"><p className="project-type">{project.type}</p><h3>{project.title}</h3><p className="project-summary">{project.summary}</p><div className="project-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div></div>
              <div className="project-metrics">{project.metrics.map((metric) => <span key={metric}>{metric}</span>)}<button className="details-button" onClick={() => setSelected(project)}>Read system notes <ArrowUpRight size={15} /></button></div>
            </motion.article>)}
          </div>
        </section>

        <section id="experience" className="section-shell content-section experience-section">
          <div className="section-heading"><div><p className="eyebrow">BACKGROUND / 2022—26</p><h2>Where I&apos;ve been,<br /><em>and what I shipped.</em></h2></div><p className="section-note">AI engineering across enterprise GenAI, conversational search, evaluation systems and production delivery.</p></div>
          <div className="resume-layout">
            <div className="experience-list">{experiences.map((experience) => <article className="experience-card" key={experience.company} style={{ '--experience-color': experience.color } as React.CSSProperties}><div className="experience-top"><div><p className="project-type">{experience.role}</p><h3>{experience.company}</h3><p className="experience-location">{experience.location}</p></div><span className="experience-date">{experience.date}</span></div><ul>{experience.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></article>)}</div>
            <aside className="education-card"><p className="eyebrow">EDUCATION</p>{education.map((item) => <div className="education-item" key={item.school}><span className="timeline-dot" style={{ background: item.color }} /><p className="education-date">{item.date}</p><h3>{item.school}</h3><p>{item.place}</p><p>{item.degree}</p><strong>{item.detail}</strong></div>)}<div className="coursework"><p className="eyebrow">COURSEWORK</p><p>Data Structures &amp; Algorithms · Operating Systems · Software Engineering · Database Management · Machine Learning · Natural Language Processing · Computer Networks · Distributed Systems</p></div></aside>
          </div>
        </section>

        <section id="stack" className="section-shell content-section stack-section"><div className="section-heading"><div><p className="eyebrow">THE TOOLKIT / DEFAULTS</p><h2>A stack for<br /><em>the real world.</em></h2></div><p className="section-note">From model behavior to deployment behavior, I care about the layer where systems become dependable.</p></div><div className="stack-grid">{stackGroups.map(({ label, icon: Icon, items }) => <div className="stack-card" key={label}><Icon size={21} /><p className="stack-label">{label}</p><div className="stack-items">{items.map((item) => <span key={item}>{item}</span>)}</div></div>)}</div></section>

        <section id="about" className="section-shell content-section about-section"><div className="about-card"><div><p className="eyebrow">THE ENGINEERING BAR</p><h2>Models are<br /><em>components.</em></h2></div><div className="about-copy"><p>I care about the system around the model: retrieval that can be inspected, tools that fail safely, evaluation that catches confident nonsense, and deployment that leaves a trace.</p><div className="principles"><span><Check size={15} /> Evidence over vibes</span><span><Check size={15} /> Measured latency</span><span><Check size={15} /> Bounded autonomy</span><span><Check size={15} /> Useful failure modes</span></div></div></div></section>

        <section id="contact" className="contact-section"><div className="section-shell contact-inner"><div><p className="eyebrow">OPEN CHANNEL</p><h2>Let&apos;s build<br /><em>something useful.</em></h2></div><div className="contact-copy"><p>Open to AI Engineer, ML Engineer, GenAI Engineer and Applied AI roles, full-time or internship, in India or internationally.</p><div className="contact-links"><a href="mailto:lavieee2206@gmail.com"><Mail size={17} /> Email <ArrowUpRight size={14} /></a><a href="https://www.linkedin.com/in/lavanya-madaan-407237268" target="_blank" rel="noreferrer"><Network size={17} /> LinkedIn <ArrowUpRight size={14} /></a><a href="https://github.com/lavanya0505" target="_blank" rel="noreferrer"><Code2 size={17} /> GitHub <ArrowUpRight size={14} /></a></div></div></div><footer className="section-shell footer"><span>© 2026 Lavanya Madan</span><span>AI systems that reason, retrieve, act and improve.</span><a href="#top">Back to top ↑</a></footer></section>
      </main>

      <AnimatePresence>{selected && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}><motion.div className="project-modal" initial={{ y: 25, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 25, opacity: 0 }} onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)} aria-label="Close project details"><X size={20} /></button><p className="project-type">{selected.type}</p><h2>{selected.title}</h2><p className="modal-detail">{selected.detail}</p><div className="modal-metrics">{selected.metrics.map((metric) => <div key={metric}><Zap size={15} />{metric}</div>)}</div><a className="button primary" href={selected.link} target="_blank" rel="noreferrer">Open repository <ArrowUpRight size={16} /></a></motion.div></motion.div>}</AnimatePresence>
    </div>
  )
}

export default App
