import { useState, useEffect } from "react";

// ============================================================
// PLANTILLAS
// ============================================================
const TEMPLATES = [
  { id: 1, name: "Asistente Académico", icon: "📚", desc: "Análisis e investigación", input: "Quiero un asistente experto en investigación académica que analice artículos científicos, identifique metodologías, evalúe la calidad de las fuentes y genere resúmenes estructurados siguiendo normas APA 7. Debe distinguir entre fuentes primarias y secundarias y detectar posibles sesgos." },
  { id: 2, name: "Analista de Datos", icon: "📊", desc: "Estadística y visualización", input: "Necesito un asistente especialista en análisis de datos que interprete datasets en CSV y Excel, detecte patrones estadísticos, proponga visualizaciones adecuadas, genere código en Python o R y explique los resultados de forma accesible a audiencias no técnicas." },
  { id: 3, name: "Tutor Educativo", icon: "🎓", desc: "Pedagogía adaptativa", input: "Quiero un tutor virtual para estudiantes universitarios que explique conceptos complejos mediante analogías, genere ejercicios prácticos graduados por dificultad, proporcione retroalimentación constructiva y adapte el estilo de enseñanza según el progreso del estudiante." },
  { id: 4, name: "Creador de Contenido", icon: "✍️", desc: "Redacción y marketing", input: "Necesito un asistente creativo de contenido digital que genere ideas originales para redes sociales, artículos de blog y newsletters, adapte el tono según la audiencia objetivo, optimice textos para SEO y mantenga coherencia con la identidad de marca establecida." },
  { id: 5, name: "Programador Senior", icon: "💻", desc: "Desarrollo y revisión de código", input: "Quiero un asistente experto en desarrollo de software que revise código en Python, JavaScript, TypeScript y SQL, identifique bugs y vulnerabilidades de seguridad, sugiera optimizaciones de rendimiento y explique las mejores prácticas de arquitectura de software." },
  { id: 6, name: "Bibliotecólogo", icon: "🔍", desc: "Gestión bibliográfica", input: "Necesito un asistente especializado en bibliotecología y gestión de referencias bibliográficas que analice citas en APA, IEEE y Vancouver, detecte DOIs, identifique duplicados, corrija errores de formato y exporte resultados organizados a diferentes gestores bibliográficos." },
];

// ============================================================
// MOTOR LOCAL DE GENERACIÓN (100% OFFLINE — SIN API)
// ============================================================
function detectarRol(descripcion) {
  const t = descripcion.toLowerCase();
  if (t.includes("bibli") || t.includes("referencia") || t.includes("doi") || t.includes("apa") || t.includes("ieee") || t.includes("vancouver"))
    return "bibliotecología y gestión bibliográfica";
  if (t.includes("datos") || t.includes("csv") || t.includes("excel") || t.includes("estadísti") || t.includes("visualizaci") || t.includes("dataset"))
    return "análisis de datos y visualización estadística";
  if (t.includes("python") || t.includes("javascript") || t.includes("typescript") || t.includes("program") || t.includes("código") || t.includes("software") || t.includes("bug") || t.includes("sql"))
    return "desarrollo de software y programación";
  if (t.includes("artículo") || t.includes("investigaci") || t.includes("científi") || t.includes("académi") || t.includes("tesis") || t.includes("metodolog"))
    return "investigación académica y análisis científico";
  if (t.includes("marketing") || t.includes("contenido") || t.includes("seo") || t.includes("redes sociales") || t.includes("blog") || t.includes("redacci"))
    return "creación de contenido y marketing digital";
  if (t.includes("educat") || t.includes("enseñanza") || t.includes("estudiante") || t.includes("docen") || t.includes("tutor") || t.includes("aprendizaje") || t.includes("pedagog"))
    return "educación y pedagogía adaptativa";
  if (t.includes("legal") || t.includes("jurídic") || t.includes("derecho") || t.includes("contrato") || t.includes("normativ"))
    return "asesoría legal y análisis normativo";
  if (t.includes("salud") || t.includes("médic") || t.includes("clínic") || t.includes("paciente") || t.includes("diagnósti"))
    return "ciencias de la salud e información clínica";
  if (t.includes("finanz") || t.includes("contab") || t.includes("presupuest") || t.includes("inversión") || t.includes("económi"))
    return "análisis financiero y contabilidad";
  return "la tarea solicitada por el usuario";
}

function detectarObjetivos(descripcion) {
  const t = descripcion.toLowerCase();
  const objetivos = [];

  if (t.includes("analiz") || t.includes("analít"))  objetivos.push("Analizar y procesar la información proporcionada con rigor y profundidad.");
  if (t.includes("generar") || t.includes("crear") || t.includes("producir")) objetivos.push("Generar contenido estructurado, preciso y de alta calidad.");
  if (t.includes("resum") || t.includes("sinteti")) objetivos.push("Resumir y sintetizar información compleja en formatos accesibles.");
  if (t.includes("detectar") || t.includes("identific") || t.includes("encontrar")) objetivos.push("Identificar patrones, errores o elementos relevantes con precisión.");
  if (t.includes("exportar") || t.includes("formato") || t.includes("archivo")) objetivos.push("Exportar y estructurar resultados en los formatos solicitados.");
  if (t.includes("explicar") || t.includes("enseñar") || t.includes("clarificar")) objetivos.push("Explicar conceptos complejos de manera clara y comprensible.");
  if (t.includes("revisar") || t.includes("corregir") || t.includes("validar")) objetivos.push("Revisar y validar la información para garantizar su exactitud.");
  if (t.includes("optimizar") || t.includes("mejorar") || t.includes("refinar")) objetivos.push("Optimizar y mejorar los resultados entregados iterativamente.");
  if (t.includes("recomendar") || t.includes("sugerir") || t.includes("proponer")) objetivos.push("Proporcionar recomendaciones fundamentadas y accionables.");

  if (objetivos.length === 0) {
    objetivos.push(
      "Comprender con precisión la intención del usuario.",
      "Ejecutar la tarea con alto nivel técnico y profesional.",
      "Proporcionar resultados estructurados y reutilizables.",
    );
  }

  while (objetivos.length < 3) {
    objetivos.push("Asegurar la calidad y consistencia de cada respuesta entregada.");
  }

  return objetivos.slice(0, 6);
}

function detectarRestrictores(descripcion) {
  const t = descripcion.toLowerCase();
  const restricciones = [
    "No inventar datos, citas o referencias que no hayan sido proporcionados.",
    "Indicar claramente las limitaciones o incertidumbres presentes.",
    "Mantener consistencia terminológica a lo largo de toda la interacción.",
  ];

  if (t.includes("privad") || t.includes("confidencial") || t.includes("datos person"))
    restricciones.push("Tratar con absoluta confidencialidad los datos personales o sensibles.");
  if (t.includes("médic") || t.includes("legal") || t.includes("financ"))
    restricciones.push("Aclarar que las respuestas no reemplazan asesoramiento profesional certificado.");
  if (t.includes("código") || t.includes("program") || t.includes("software"))
    restricciones.push("No ejecutar ni sugerir código que pueda comprometer la seguridad del sistema.");

  return restricciones;
}

function detectarFormato(descripcion) {
  const t = descripcion.toLowerCase();
  const formatos = [];

  if (t.includes("markdown") || t.includes(".md"))   formatos.push("Documento Markdown con estructura jerárquica.");
  if (t.includes("excel") || t.includes("csv") || t.includes("tabla"))
    formatos.push("Tabla o archivo en formato Excel/CSV cuando aplique.");
  if (t.includes("json"))  formatos.push("Objeto JSON estructurado cuando corresponda.");
  if (t.includes("pdf"))   formatos.push("Informe exportable en formato PDF.");
  if (t.includes("código") || t.includes("program"))
    formatos.push("Bloques de código con sintaxis resaltada y comentarios explicativos.");
  if (t.includes("resum") || t.includes("informe"))
    formatos.push("Resumen ejecutivo con puntos clave destacados.");
  if (t.includes("lista") || t.includes("viñeta"))
    formatos.push("Listas con viñetas para mejorar la legibilidad.");

  if (formatos.length === 0) {
    formatos.push(
      "Respuesta en Markdown con títulos y subtítulos jerárquicos.",
      "Listas ordenadas y no ordenadas según corresponda.",
      "Tablas comparativas cuando mejoren la comprensión del contenido.",
    );
  }

  return formatos;
}

function generarPromptLocal(descripcion) {
  const rol = detectarRol(descripcion);
  const objetivos = detectarObjetivos(descripcion);
  const restricciones = detectarRestrictores(descripcion);
  const formatos = detectarFormato(descripcion);

  const lineas = [
    `# Rol del Asistente`,
    ``,
    `- Actúa como un especialista senior en ${rol}.`,
    `- Posee amplia experiencia práctica y conocimiento técnico actualizado.`,
    `- Entrega respuestas rigurosas, estructuradas, claras y orientadas a resultados.`,
    `- Se adapta al nivel de conocimiento del usuario, ajustando el lenguaje y la profundidad.`,
    ``,
    `# Contexto`,
    ``,
    `- Solicitud original del usuario: "${descripcion}"`,
    `- El objetivo es transformar esta solicitud en instrucciones precisas y reutilizables para cualquier modelo de IA.`,
    `- La salida debe ser compatible con ChatGPT, Claude, Gemini y otros modelos de lenguaje.`,
    ``,
    `# Objetivos`,
    ``,
    ...objetivos.map(o => `- ${o}`),
    ``,
    `# Reglas`,
    ``,
    `- Organiza siempre la información en secciones y subsecciones claras.`,
    `- Usa listas con viñetas para mejorar la legibilidad cuando sea apropiado.`,
    `- Incluye ejemplos concretos cuando aporten claridad y valor.`,
    `- Solicita información adicional si faltan datos críticos para completar la tarea.`,
    `- Prioriza la precisión sobre la extensión: sé conciso pero completo.`,
    ``,
    `# Restricciones`,
    ``,
    ...restricciones.map(r => `- ${r}`),
    ``,
    `# Tono y Estilo`,
    ``,
    `- Profesional, preciso y directo.`,
    `- Sin ambigüedades ni generalidades vagas.`,
    `- Orientado a resultados concretos y accionables.`,
    `- Emplea terminología específica del dominio cuando sea pertinente.`,
    ``,
    `# Formato de Salida`,
    ``,
    ...formatos.map(f => `- ${f}`),
    ``,
    `# Ejemplos de Uso`,
    ``,
    `- Proporcionar análisis detallados con evidencia y justificación.`,
    `- Crear resúmenes ejecutivos estructurados y fáciles de compartir.`,
    `- Generar recomendaciones específicas con pasos de implementación.`,
    ``,
    `# Limitaciones Conocidas`,
    ``,
    `- La calidad del resultado depende directamente de la claridad del contexto entregado.`,
    `- Si la solicitud es ambigua, deben explicitarse los supuestos utilizados.`,
    `- El asistente no tiene acceso a información en tiempo real salvo que se le proporcione.`,
  ];

  return lineas.join("\n");
}

function optimizarPromptLocal(markdown) {
  // Detecta secciones existentes
  const tieneLimitaciones = markdown.includes("# Limitaciones");
  const tieneEjemplos = markdown.includes("# Ejemplos");

  const adicion = [
    ``,
    `# Recomendaciones de Uso Avanzado`,
    ``,
    `- Verifica que cada instrucción sea específica, medible y libre de ambigüedades.`,
    `- Prioriza la claridad y la estructura por encima de la extensión del prompt.`,
    `- Incluye siempre ejemplos de entrada y salida esperada cuando sea posible.`,
    `- Define explícitamente las restricciones y los supuestos de partida.`,
    `- Solicita aclaraciones al usuario antes de responder si faltan datos críticos.`,
    `- Itera y refina el prompt basándote en los resultados obtenidos.`,
    ``,
    `# Criterios de Calidad`,
    ``,
    `- **Precisión**: Las respuestas deben ser técnicamente correctas y verificables.`,
    `- **Relevancia**: El contenido debe responder directamente a la solicitud del usuario.`,
    `- **Completitud**: Cubrir todos los aspectos relevantes sin omisiones importantes.`,
    `- **Consistencia**: Mantener el mismo estilo, tono y terminología a lo largo de la respuesta.`,
    `- **Utilidad**: El resultado debe ser directamente aplicable sin necesitar reformulación.`,
  ];

  if (!tieneEjemplos) {
    adicion.push(
      ``,
      `# Ejemplos de Interacción Esperada`,
      ``,
      `- **Usuario proporciona**: Contexto claro con datos específicos.`,
      `- **Asistente entrega**: Respuesta estructurada, precisa y con los formatos solicitados.`,
      `- **En caso de ambigüedad**: El asistente formula preguntas aclaratorias antes de proceder.`,
    );
  }

  if (!tieneLimitaciones) {
    adicion.push(
      ``,
      `# Limitaciones Conocidas`,
      ``,
      `- Sin acceso a internet ni datos en tiempo real salvo los proporcionados.`,
      `- El conocimiento tiene una fecha de corte según el modelo utilizado.`,
      `- No puede ejecutar código real en producción, solo simularlo o sugerirlo.`,
    );
  }

  return markdown + adicion.join("\n");
}

// ============================================================
// COMPONENTE: PREVIEW MARKDOWN
// ============================================================
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
              <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
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
      result.push(<p key={i} style={{ fontSize: 14, color: "#444441", margin: "4px 0", lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />);
    }
  });
  flushList();
  return <div style={{ padding: "4px 0" }}>{result}</div>;
}

// ============================================================
// APP PRINCIPAL
// ============================================================
export default function App() {
  const [userInput, setUserInput] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [tab, setTab] = useState("editor");
  const [history, setHistory] = useState([]);
  const [copyLabel, setCopyLabel] = useState("Copiar");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => { loadHistory(); }, []);

  async function loadHistory() {
    try {
      const r = await window.storage.get("pf-history-offline");
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
    try { await window.storage.set("pf-history-offline", JSON.stringify(next)); } catch {}
  }

  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 2500);
  };

  // GENERAR: 100% local, sin API
  async function generate() {
    if (!userInput.trim() || isGenerating) return;
    setIsGenerating(true);
    try {
      // Simulamos un leve delay para feedback visual
      await new Promise(r => setTimeout(r, 400));
      const result = generarPromptLocal(userInput);
      setMarkdown(result);
      setTab("editor");
      await saveHistory(userInput, result);
      showNotif("✅ Prompt generado correctamente");
    } finally {
      setIsGenerating(false);
    }
  }

  // OPTIMIZAR: 100% local, sin API
  async function optimize() {
    if (!markdown.trim() || isOptimizing) return;
    setIsOptimizing(true);
    try {
      await new Promise(r => setTimeout(r, 300));
      const result = optimizarPromptLocal(markdown);
      setMarkdown(result);
      showNotif("✨ Prompt optimizado exitosamente");
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
          animation: "fadeIn 0.2s ease",
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
            <button onClick={() => setHistoryOpen(!historyOpen)} style={{
              padding: "6px 12px", borderRadius: 8, border: "1px solid #2C4A47",
              background: historyOpen ? "#1D2B2A" : "#1D2B2A", color: "#9FE1CB",
              cursor: "pointer", fontSize: 12, fontWeight: 500,
            }}>
              🕐 Historial ({history.length})
            </button>
          )}
          {/* Badge: 100% Local */}
          <span style={{ background: "#1D2B2A", color: "#5DCAA5", fontSize: 11, padding: "4px 12px", borderRadius: 20, border: "1px solid #2C4A47", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#1D9E75", display: "inline-block" }} />
            100% Local
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
              placeholder={"Describe en lenguaje natural el comportamiento deseado de tu asistente IA\n\nEjemplo: Quiero un asistente experto en bibliometría que analice referencias APA 7, detecte DOI y exporte resultados a Excel..."}
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
            <div style={{ fontSize: 11, color: "#B4B2A9", marginTop: 5 }}>Ctrl+Enter para generar · Sin conexión requerida</div>
          </div>

          {/* Action buttons */}
          <div style={{ padding: "0 20px 16px", display: "flex", gap: 8 }}>
            <button onClick={generate} disabled={isGenerating || !userInput.trim()} style={{ ...btnPrimary(isGenerating || !userInput.trim()), flex: 1, justifyContent: "center" }}>
              {isGenerating ? <><Spinner /> Generando…</> : "⚡ Generar Prompt"}
            </button>
            <button onClick={optimize} disabled={isOptimizing || !markdown} title="Enriquecer el prompt con secciones adicionales" style={{ ...btnSecondary(isOptimizing || !markdown, false), padding: "9px 13px" }}>
              {isOptimizing ? <Spinner color="#0F6E56" /> : "✨"} Optimizar
            </button>
          </div>

          {/* Offline info banner */}
          <div style={{ margin: "0 20px 14px", padding: "10px 14px", background: "#E8F5F0", border: "1px solid #A8DCC8", borderRadius: 8, fontSize: 12, color: "#0A5540", display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ fontSize: 14 }}>🔒</span>
            <span>Modo <strong>100% local</strong>. No se envían datos a servidores externos. No requiere API Key ni conexión a internet.</span>
          </div>

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
              {["# Rol del Asistente", "# Contexto", "# Objetivos", "# Reglas", "# Restricciones", "# Tono y Estilo", "# Formato de Salida", "# Ejemplos de Uso", "# Limitaciones Conocidas"].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1D9E75", flexShrink: 0 }} />
                  <code style={{ fontSize: 11, color: "#444441", fontFamily: "'Courier New', monospace" }}>{s}</code>
                </div>
              ))}
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
                {markdown ? <MarkdownPreview content={markdown} /> : <EmptyState />}
              </div>
            )}
          </div>

          {/* Export bar */}
          <div style={{ background: "#fff", borderTop: "1.5px solid #D3D1C7", padding: "12px 20px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#888780", textTransform: "uppercase", letterSpacing: 0.8, marginRight: 4 }}>Exportar:</span>
            <button onClick={() => download("md", "text/markdown")} disabled={!markdown} style={btnSecondary(!markdown, false)}>⬇ .md</button>
            <button onClick={() => download("txt", "text/plain")} disabled={!markdown} style={btnSecondary(!markdown, false)}>⬇ .txt</button>
            <button onClick={printPDF} disabled={!markdown} style={btnSecondary(!markdown, false)}>🖨 PDF</button>
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
