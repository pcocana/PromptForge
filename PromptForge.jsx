import { useState, useEffect, useCallback } from "react";

const TEMPLATES = [
  { id: 1, name: "Asistente Académico", icon: "📚", desc: "Análisis e investigación", input: "Quiero un asistente experto en investigación académica que analice artículos científicos, identifique metodologías, evalúe la calidad de las fuentes y genere resúmenes estructurados siguiendo normas APA 7. Debe distinguir entre fuentes primarias y secundarias y detectar posibles sesgos." },
  { id: 2, name: "Analista de Datos", icon: "📊", desc: "Estadística y visualización", input: "Necesito un asistente especialista en análisis de datos que interprete datasets en CSV y Excel, detecte patrones estadísticos, proponga visualizaciones adecuadas, genere código en Python o R y explique los resultados de forma accesible a audiencias no técnicas." },
  { id: 3, name: "Tutor Educativo", icon: "🎓", desc: "Pedagogía adaptativa", input: "Quiero un tutor virtual para estudiantes universitarios que explique conceptos complejos mediante analogías, genere ejercicios prácticos graduados por dificultad, proporcione retroalimentación constructiva y adapte el estilo de enseñanza según el progreso del estudiante." },
  { id: 4, name: "Creador de Contenido", icon: "✍️", desc: "Redacción y marketing", input: "Necesito un asistente creativo de contenido digital que genere ideas originales para redes sociales, artículos de blog y newsletters, adapte el tono según la audiencia objetivo, optimice textos para SEO y mantenga coherencia con la identidad de marca establecida." },
  { id: 5, name: "Programador Senior", icon: "💻", desc: "Desarrollo y revisión de código", input: "Quiero un asistente experto en desarrollo de software que revise código en Python, JavaScript, TypeScript y SQL, identifique bugs y vulnerabilidades de seguridad, sugiera optimizaciones de rendimiento y explique las mejores prácticas de arquitectura de software." },
  { id: 6, name: "Bibliotecólogo", icon: "🔍", desc: "Gestión bibliográfica", input: "Necesito un asistente especializado en bibliotecología y gestión de referencias bibliográficas que analice citas en APA, IEEE y Vancouver, detecte DOIs, identifique duplicados, corrija errores de formato y exporte resultados organizados a diferentes gestores bibliográficos." },
];

function MarkdownPreview({ content }) {
  const lines = content.split("\n");
  const result = [];
  let listBuffer = [];
  let listKey = 0;

  const flushList = () => {
    if (listBuffer.length > 0) {
      result.push(
        <ul key={`ul-${listKey++}`} style={{ paddingLeft: 22, margin: "6px 0 12px", listStyle: "none" }}>
          {listBuffer.map((item, i) => (
            <li key={i} style={{ display: "flex", gap: 8, marginBottom: 5, fontSize: 14, color: "#444441", lineHeight: 1.6 }}>
              <span style={{ color: "#1D9E75", fontWeight: 700, marginTop: 1, flexShrink: 0 }}>▸</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  lines.forEach((line, i) => {
    if (line.startsWith("# ")) {
      flushList();
      result.push(
        <div key={i} style={{ marginTop: i === 0 ? 0 : 24, marginBottom: 10 }}>
          <h1 style={{ fontSize: 17, fontWeight: 700, color: "#085041", margin: 0, fontFamily: "Georgia, serif", letterSpacing: -0.3 }}>{line.slice(2)}</h1>
          <div style={{ height: 2, background: "linear-gradient(90deg, #1D9E75 0%, transparent 100%)", marginTop: 6, borderRadius: 2 }} />
        </div>
      );
    } else if (line.startsWith("## ")) {
      flushList();
      result.push(<h2 key={i} style={{ fontSize: 15, fontWeight: 600, color: "#0F6E56", margin: "16px 0 6px", fontFamily: "Georgia, serif" }}>{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      flushList();
      result.push(<h3 key={i} style={{ fontSize: 14, fontWeight: 600, color: "#1D9E75", margin: "12px 0 4px" }}>{line.slice(4)}</h3>);
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      listBuffer.push(line.slice(2));
    } else if (line.trim() === "") {
      flushList();
      result.push(<div key={i} style={{ height: 6 }} />);
    } else if (line.startsWith("> ")) {
      flushList();
      result.push(
        <blockquote key={i} style={{ borderLeft: "3px solid #1D9E75", paddingLeft: 14, margin: "8px 0", color: "#5F5E5A", fontStyle: "italic", fontSize: 13 }}>
          {line.slice(2)}
        </blockquote>
      );
    } else {
      flushList();
      result.push(<p key={i} style={{ fontSize: 14, color: "#444441", margin: "4px 0", lineHeight: 1.65 }}>{line}</p>);
    }
  });
  flushList();
  return <div style={{ padding: "4px 0" }}>{result}</div>;
}

export default function App() {
  const [userInput, setUserInput] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [tab, setTab] = useState("editor");
  const [history, setHistory] = useState([]);
  const [copyLabel, setCopyLabel] = useState("Copiar");
  const [error, setError] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => { loadHistory(); }, []);

  async function loadHistory() {
    try {
      const r = await window.storage.get("pf-history");
      if (r) setHistory(JSON.parse(r.value));
    } catch {}
  }

  async function saveHistory(input, md) {
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString("es-CL"),
      time: new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }),
      preview: input.slice(0, 80) + (input.length > 80 ? "…" : ""),
      input,
      md,
    };
    const next = [entry, ...history].slice(0, 30);
    setHistory(next);
    try { await window.storage.set("pf-history", JSON.stringify(next)); } catch {}
  }

  const showNotif = (msg) => { setNotification(msg); setTimeout(() => setNotification(""), 2500); };

  // ✅ CORRECCIÓN PRINCIPAL: se agregó el header obligatorio "anthropic-version"
  // ✅ CORRECCIÓN: mejor manejo de errores que muestra el mensaje real de la API
  const callClaude = async (systemPrompt, userMsg) => {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",  // ← header obligatorio que faltaba
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: userMsg }],
      }),
    });

    const data = await res.json();

    // ✅ Muestra el error real de la API si falla
    if (!res.ok) {
      const apiMsg = data?.error?.message || `HTTP ${res.status}`;
      throw new Error(apiMsg);
    }

    // ✅ Validación de que la respuesta tiene texto
    if (!data.content || !data.content[0] || data.content[0].type !== "text") {
      throw new Error("Respuesta inesperada de la API");
    }

    return data.content[0].text;
  };

  async function generate() {
    if (!userInput.trim() || isGenerating) return;
    setIsGenerating(true);
    setError("");
    try {
      const result = await callClaude(
        `Eres un experto en ingeniería de prompts para IA. Tu única tarea es transformar descripciones en lenguaje natural en prompts Markdown profesionales y estructurados, optimizados para ChatGPT, Claude y Gemini.

INSTRUCCIONES ESTRICTAS:
- Responde ÚNICAMENTE con el contenido Markdown. Sin explicaciones, sin bloques de código, sin comillas.
- Usa el mismo idioma que el usuario (español si escribe en español).
- SIEMPRE incluye las secciones: # Rol del Asistente, # Objetivos, # Reglas, # Restricciones, # Formato de Salida
- Agrega secciones adicionales relevantes si aplica: # Contexto, # Tono y Estilo, # Ejemplos de Uso, # Limitaciones Conocidas
- Usa guiones (- ) para los puntos de cada sección, mínimo 3 puntos por sección
- Sé específico, profesional y preciso. Evita generalidades`,
        userInput
      );
      setMarkdown(result);
      setTab("editor");
      await saveHistory(userInput, result);
      showNotif("✅ Prompt generado correctamente");
    } catch (e) {
      // ✅ Muestra el error real en lugar de un mensaje genérico
      setError(`Error al generar: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  }

  async function optimize() {
    if (!markdown.trim() || isOptimizing) return;
    setIsOptimizing(true);
    setError("");
    try {
      const result = await callClaude(
        `Eres un experto senior en ingeniería de prompts. Tu tarea es mejorar y optimizar un prompt Markdown existente.

INSTRUCCIONES:
- Responde ÚNICAMENTE con el Markdown mejorado. Sin explicaciones ni comentarios.
- Conserva la estructura y secciones existentes, mejorando su contenido
- Agrega detalles específicos y contexto donde haya generalidades
- Mejora la redacción para mayor claridad, precisión y efectividad
- Añade reglas o restricciones importantes que falten
- Fortalece el rol del asistente con capacidades más específicas
- Enriquece el formato de salida con detalles concretos`,
        `Optimiza este prompt:\n\n${markdown}`
      );
      setMarkdown(result);
      showNotif("✨ Prompt optimizado exitosamente");
    } catch (e) {
      setError(`Error al optimizar: ${e.message}`);
    } finally {
      setIsOptimizing(false);
    }
  }

  function download(ext, type) {
    if (!markdown) return;
    const blob = new Blob([markdown], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prompt-${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    showNotif(`📥 Descargando .${ext}…`);
  }

  async function copy() {
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
      setCopyLabel("¡Copiado!");
      setTimeout(() => setCopyLabel("Copiar"), 2000);
    } catch {
      setCopyLabel("Error");
      setTimeout(() => setCopyLabel("Copiar"), 2000);
    }
  }

  function printPDF() {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Prompt</title>
    <style>body{font-family:Georgia,serif;max-width:760px;margin:40px auto;padding:0 30px;line-height:1.8;color:#2C2C2A}
    h1{font-size:20px;color:#085041;border-bottom:2px solid #1D9E75;padding-bottom:6px;margin-top:28px}
    h2{font-size:16px;color:#0F6E56;margin-top:20px}
    ul{list-style:none;padding-left:16px}li::before{content:"▸ ";color:#1D9E75}
    li{margin-bottom:5px;font-size:14px}p{font-size:14px}
    @media print{body{margin:0;padding:20px}}</style></head>
    <body><pre style="white-space:pre-wrap;font-family:Georgia,serif;font-size:14px">${markdown.replace(/</g, "&lt;")}</pre></body></html>`;
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    w.print();
  }

  const sections = (markdown.match(/^# /gm) || []).length;
  const words = markdown ? markdown.split(/\s+/).filter(Boolean).length : 0;

  const btnPrimary = (disabled) => ({
    padding: "11px 18px", borderRadius: 9, border: "none", cursor: disabled ? "not-allowed" : "pointer",
    fontSize: 14, fontWeight: 600, background: disabled ? "#B4B2A9" : "#0F6E56", color: "#fff",
    transition: "all 0.2s", display: "flex", alignItems: "center", gap: 7, opacity: disabled ? 0.7 : 1,
  });

  const btnSecondary = (disabled, active) => ({
    padding: "9px 14px", borderRadius: 8, border: `1.5px solid ${active ? "#1D9E75" : "#D3D1C7"}`,
    cursor: disabled ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 500,
    background: active ? "#E1F5EE" : "#fff", color: active ? "#0F6E56" : "#444441",
    transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6, opacity: disabled ? 0.5 : 1,
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F4F2EE", fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif", display: "flex", flexDirection: "column" }}>

      {/* Notification toast */}
      {notification && (
        <div style={{
          position: "fixed", top: 16, right: 16, zIndex: 9999,
          background: "#085041", color: "#9FE1CB", padding: "10px 18px",
          borderRadius: 10, fontSize: 13, fontWeight: 500, boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          animation: "fadeIn 0.2s ease"
        }}>{notification}</div>
      )}

      {/* Header */}
      <header style={{ background: "#0A1E1C", padding: "0 24px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "#1D9E75", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🔮</div>
          <div>
            <div style={{ color: "#E1F5EE", fontSize: 17, fontWeight: 700, fontFamily: "Georgia, serif", letterSpacing: -0.5, lineHeight: 1.2 }}>PromptForge</div>
            <div style={{ color: "#5DCAA5", fontSize: 11 }}>Generador de Prompts en Markdown</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {history.length > 0 && (
            <button onClick={() => setHistoryOpen(!historyOpen)} style={{ ...btnSecondary(false, historyOpen), background: historyOpen ? "#1D2B2A" : "#1D2B2A", color: "#9FE1CB", border: "1px solid #2C4A47", fontSize: 12, padding: "6px 12px" }}>
              🕐 Historial ({history.length})
            </button>
          )}
          <span style={{ background: "#1D2B2A", color: "#5DCAA5", fontSize: 11, padding: "4px 12px", borderRadius: 20, border: "1px solid #2C4A47" }}>
            Powered by Claude
          </span>
        </div>
      </header>

      {/* History panel */}
      {historyOpen && history.length > 0 && (
        <div style={{ background: "#fff", borderBottom: "1.5px solid #D3D1C7", padding: "14px 24px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#888780", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Prompts anteriores</div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
            {history.slice(0, 12).map(e => (
              <button key={e.id}
                onClick={() => { setUserInput(e.input); setMarkdown(e.md); setTab("editor"); setHistoryOpen(false); }}
                style={{ flexShrink: 0, padding: "8px 12px", borderRadius: 8, border: "1.5px solid #D3D1C7", background: "#F8F7F4", cursor: "pointer", textAlign: "left", maxWidth: 200 }}
                onMouseEnter={e2 => { e2.currentTarget.style.borderColor = "#1D9E75"; e2.currentTarget.style.background = "#E1F5EE"; }}
                onMouseLeave={e2 => { e2.currentTarget.style.borderColor = "#D3D1C7"; e2.currentTarget.style.background = "#F8F7F4"; }}
              >
                <div style={{ fontSize: 11, color: "#888780", marginBottom: 3 }}>{e.date} {e.time}</div>
                <div style={{ fontSize: 12, color: "#2C2C2A", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{e.preview}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main grid */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "420px 1fr", minHeight: 0 }}>

        {/* LEFT PANEL */}
        <div style={{ background: "#fff", borderRight: "1.5px solid #D3D1C7", display: "flex", flexDirection: "column", overflowY: "auto" }}>
          
          {/* Input section */}
          <div style={{ padding: "20px 20px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#888780", textTransform: "uppercase", letterSpacing: 0.8 }}>Descripción libre</label>
              <span style={{ fontSize: 11, color: "#B4B2A9" }}>{userInput.length} caracteres</span>
            </div>
            <textarea
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) generate(); }}
              placeholder="Describe en lenguaje natural el comportamiento deseado de tu asistente IA&#10;&#10;Ejemplo: Quiero un asistente experto en bibliometría que analice referencias APA 7, detecte DOI y exporte resultados a Excel..."
              style={{
                width: "100%", minHeight: 160, padding: "12px 14px",
                borderRadius: 9, border: "1.5px solid #D3D1C7",
                fontFamily: "system-ui, sans-serif", fontSize: 13.5, lineHeight: 1.65,
                resize: "vertical", outline: "none", background: "#FAFAF8",
                color: "#2C2C2A", boxSizing: "border-box", transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "#1D9E75"}
              onBlur={e => e.target.style.borderColor = "#D3D1C7"}
            />
            <div style={{ fontSize: 11, color: "#B4B2A9", marginTop: 5 }}>Ctrl+Enter para generar</div>
          </div>

          {/* Action buttons */}
          <div style={{ padding: "0 20px 16px", display: "flex", gap: 8 }}>
            <button onClick={generate} disabled={isGenerating || !userInput.trim()} style={{ ...btnPrimary(isGenerating || !userInput.trim()), flex: 1, justifyContent: "center" }}>
              {isGenerating ? <><Spinner /> Generando…</> : "⚡ Generar Prompt"}
            </button>
            <button onClick={optimize} disabled={isOptimizing || !markdown} title="Mejorar con IA el prompt generado" style={{ ...btnSecondary(isOptimizing || !markdown, false), padding: "9px 13px" }}>
              {isOptimizing ? <Spinner color="#0F6E56" /> : "✨"} Optimizar
            </button>
          </div>

          {error && (
            <div style={{ margin: "0 20px 14px", padding: "10px 14px", background: "#FCEBEB", border: "1px solid #F09595", borderRadius: 8, fontSize: 12, color: "#A32D2D", wordBreak: "break-word" }}>
              ⚠️ {error}
            </div>
          )}

          {/* Divider */}
          <div style={{ height: 1, background: "#F1EFE8", margin: "0 20px" }} />

          {/* Templates */}
          <div style={{ padding: "16px 20px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#888780", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>Plantillas rápidas</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => setUserInput(t.input)} style={{
                  padding: "11px 12px", borderRadius: 9, border: "1.5px solid #E8E6E0",
                  background: "#FAFAF8", cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#1D9E75"; e.currentTarget.style.background = "#E1F5EE"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8E6E0"; e.currentTarget.style.background = "#FAFAF8"; e.currentTarget.style.transform = "none"; }}
                >
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{t.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#2C2C2A", marginBottom: 2 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: "#888780" }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Structure reference */}
          <div style={{ padding: "0 20px 20px" }}>
            <div style={{ background: "#F1EFE8", borderRadius: 9, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#5F5E5A", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Estructura generada</div>
              {["# Rol del Asistente", "# Objetivos", "# Reglas", "# Restricciones", "# Formato de Salida"].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1D9E75", flexShrink: 0 }} />
                  <code style={{ fontSize: 11, color: "#444441", fontFamily: "'Courier New', monospace" }}>{s}</code>
                </div>
              ))}
              <div style={{ fontSize: 11, color: "#888780", marginTop: 6 }}>+ secciones adicionales según el contexto</div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ display: "flex", flexDirection: "column", background: "#F8F7F4" }}>

          {/* Toolbar */}
          <div style={{ background: "#fff", borderBottom: "1.5px solid #D3D1C7", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 4, background: "#F1EFE8", padding: 3, borderRadius: 8 }}>
              {[["editor", "✏️ Editor"], ["preview", "👁 Vista Previa"]].map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)} style={{
                  padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: 500, transition: "all 0.15s",
                  background: tab === id ? "#fff" : "transparent",
                  color: tab === id ? "#0F6E56" : "#888780",
                  boxShadow: tab === id ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                }}>{label}</button>
              ))}
            </div>

            {markdown && (
              <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#888780" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#1D9E75", display: "inline-block" }} />
                  {sections} secciones
                </span>
                <span>{words} palabras</span>
                <span>{markdown.length} chars</span>
              </div>
            )}
          </div>

          {/* Editor / Preview */}
          <div style={{ flex: 1, padding: 20, minHeight: 0 }}>
            {tab === "editor" ? (
              <div style={{ position: "relative", height: "100%" }}>
                <textarea
                  value={markdown}
                  onChange={e => setMarkdown(e.target.value)}
                  placeholder={isGenerating
                    ? "⏳ Generando tu prompt estructurado en Markdown…"
                    : "El prompt Markdown aparecerá aquí.\n\nEscribe una descripción en el panel izquierdo y haz clic en ⚡ Generar Prompt\n\nTambién puedes escribir directamente aquí para editar manualmente."}
                  style={{
                    width: "100%", height: "calc(100vh - 280px)", minHeight: 400,
                    padding: "16px 18px", borderRadius: 10,
                    border: "1.5px solid #2C4A47",
                    fontFamily: "'Courier New', Courier, monospace",
                    fontSize: 13.5, lineHeight: 1.75, resize: "none",
                    outline: "none",
                    background: "#0E1E1C", color: "#9FE1CB",
                    boxSizing: "border-box",
                    caretColor: "#1D9E75",
                  }}
                  onFocus={e => e.target.style.borderColor = "#1D9E75"}
                  onBlur={e => e.target.style.borderColor = "#2C4A47"}
                  spellCheck={false}
                />
                {isGenerating && (
                  <div style={{ position: "absolute", top: 14, right: 14, background: "#1D9E75", color: "#fff", fontSize: 11, padding: "4px 10px", borderRadius: 6, fontWeight: 600 }}>
                    Generando…
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                background: "#fff", borderRadius: 10, border: "1.5px solid #D3D1C7",
                padding: "24px 28px", height: "calc(100vh - 280px)", minHeight: 400,
                overflowY: "auto", boxSizing: "border-box",
              }}>
                {markdown
                  ? <MarkdownPreview content={markdown} />
                  : <EmptyState />
                }
              </div>
            )}
          </div>

          {/* Export bar */}
          <div style={{ background: "#fff", borderTop: "1.5px solid #D3D1C7", padding: "12px 20px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#888780", textTransform: "uppercase", letterSpacing: 0.8, marginRight: 4 }}>Exportar:</span>
            <button onClick={() => download("md", "text/markdown")} disabled={!markdown} style={btnSecondary(!markdown, false)}>
              ⬇ .md
            </button>
            <button onClick={() => download("txt", "text/plain")} disabled={!markdown} style={btnSecondary(!markdown, false)}>
              ⬇ .txt
            </button>
            <button onClick={printPDF} disabled={!markdown} style={btnSecondary(!markdown, false)}>
              🖨 PDF
            </button>
            <div style={{ width: 1, height: 24, background: "#E8E6E0", margin: "0 4px" }} />
            <button onClick={copy} disabled={!markdown} style={{ ...btnSecondary(!markdown, copyLabel === "¡Copiado!"), color: copyLabel === "¡Copiado!" ? "#0F6E56" : "#444441" }}>
              {copyLabel === "¡Copiado!" ? "✅" : "📋"} {copyLabel}
            </button>
            {markdown && (
              <button onClick={() => { setMarkdown(""); setTab("editor"); }} style={{ ...btnSecondary(false, false), marginLeft: "auto", color: "#A32D2D", borderColor: "#F09595" }}>
                🗑 Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #D3D1C7; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #B4B2A9; }
        textarea::placeholder { color: #888780; }
      `}</style>
    </div>
  );
}

function Spinner({ color = "#fff" }) {
  return (
    <span style={{ width: 14, height: 14, border: `2px solid ${color}33`, borderTopColor: color, borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />
  );
}

function EmptyState() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column", gap: 10, color: "#B4B2A9" }}>
      <div style={{ fontSize: 40 }}>📄</div>
      <p style={{ fontSize: 14, margin: 0, fontWeight: 500, color: "#888780" }}>Sin contenido para previsualizar</p>
      <p style={{ fontSize: 12, margin: 0, color: "#B4B2A9" }}>Genera un prompt primero</p>
    </div>
  );
}
