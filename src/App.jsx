import { useState, useEffect, useRef } from "react";

const FONTES = [
  { id: "elton", nome: "Elton Luiz", tipo: "Curso · Terças", cor: "#C4A882" },
  { id: "rd", nome: "Reservatório", tipo: "Curso · Quintas", cor: "#9B7AB0" },
  { id: "lucia", nome: "Lucia Helena", tipo: "Curso · Sextas", cor: "#7A8CB0" },
  { id: "artur", nome: "Artur Valadares", tipo: "Palestras · Fins de semana", cor: "#5A9A8C" },
  { id: "livro", nome: "Livro dos Espíritos", tipo: "Diário + semanal", cor: "#6B9B63" },
  { id: "youtube", nome: "YouTube", tipo: "Victor · Gabriel · outros", cor: "#C4614A" },
  { id: "revisitar", nome: "Revisitar", tipo: "Insights para voltar", cor: "#A89880" },
  { id: "semana", nome: "Por semana", tipo: "Preencher todo domingo", cor: "#B89A5A" },
];

const RITUAL = [
  "Releia as notas da última sessão desta fonte — 5 min",
  "Estude sem celular e sem pausas",
  "Feche tudo e escreva 3–5 linhas com suas palavras",
  "Responda: onde isso aparece na minha vida agora?",
];

const hoje = () =>
  new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

function useStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch { return initial; }
  });

  const save = (v) => {
    setVal(v);
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch (e) {
      console.error("Erro ao salvar:", e);
    }
  };

  return [val, save];
}

const S = {
  app: {
    background: "#F7F5F2",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
    fontWeight: 300,
    color: "#2E2B28",
    padding: "32px 16px 80px",
  },
  wrap: { maxWidth: 680, margin: "0 auto" },
  eyebrow: {
    fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase",
    color: "#A89880", marginBottom: 8,
  },
  title: {
    fontFamily: "'Lora', serif", fontSize: 34, fontWeight: 400,
    color: "#2E2B28", lineHeight: 1.15, marginBottom: 8,
  },
  sub: { fontSize: 13, color: "#8C8078", lineHeight: 1.6, marginBottom: 32 },
  ritualBox: {
    background: "#EDEAE4", borderRadius: 14, padding: "20px 22px", marginBottom: 32,
  },
  ritualLabel: {
    fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
    color: "#A89880", marginBottom: 12,
  },
  ritualRow: { display: "flex", gap: 12, marginBottom: 8, alignItems: "flex-start" },
  ritualN: { fontSize: 11, color: "#A89880", minWidth: 14, paddingTop: 1 },
  ritualText: { fontSize: 13, color: "#5C5450", lineHeight: 1.55 },
  nav: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 },
  navBtn: (active) => ({
    padding: "7px 16px", borderRadius: 20,
    border: `1px solid ${active ? "#2E2B28" : "#D4C9BC"}`,
    background: active ? "#2E2B28" : "transparent",
    color: active ? "#F7F5F2" : "#8C8078",
    fontSize: 12, cursor: "pointer", fontFamily: "inherit",
    transition: "all 0.18s",
  }),
  fonteHeader: { display: "flex", alignItems: "center", gap: 12, marginBottom: 28 },
  fonteDot: (cor) => ({ width: 10, height: 10, borderRadius: "50%", background: cor, flexShrink: 0 }),
  fonteNome: { fontFamily: "'Lora', serif", fontSize: 22, fontWeight: 400 },
  fonteTipo: { fontSize: 11, color: "#A89880", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 },
  card: {
    background: "#fff", borderRadius: 14, padding: "22px 22px 18px",
    marginBottom: 14, border: "1px solid #EDE8E2",
  },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  cardData: { fontSize: 11, color: "#A89880", letterSpacing: "0.08em" },
  cardNum: { fontSize: 11, color: "#C9BFB4" },
  fieldLabel: {
    fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
    color: "#A89880", marginBottom: 5, marginTop: 16,
  },
  fieldInput: {
    width: "100%", border: "none", borderBottom: "1px solid #EDE8E2",
    background: "transparent", fontFamily: "'Inter', sans-serif",
    fontSize: 13, fontWeight: 300, color: "#2E2B28",
    padding: "6px 0", outline: "none", lineHeight: 1.6,
    resize: "none", boxSizing: "border-box",
  },
  btnSalvar: {
    marginTop: 18, padding: "9px 22px", background: "#2E2B28",
    color: "#F7F5F2", border: "none", borderRadius: 8,
    fontSize: 12, cursor: "pointer", fontFamily: "inherit",
  },
  btnEditar: {
    marginTop: 18, padding: "8px 18px", background: "transparent",
    color: "#A89880", border: "1px solid #D4C9BC", borderRadius: 8,
    fontSize: 12, cursor: "pointer", fontFamily: "inherit",
  },
  btnNova: {
    width: "100%", padding: 14, border: "1.5px dashed #D4C9BC",
    borderRadius: 12, background: "transparent", fontFamily: "inherit",
    fontSize: 12, color: "#A89880", cursor: "pointer", marginTop: 4,
  },
  ytRow: { display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 0", borderBottom: "1px solid #EDE8E2" },
  ytDot: { width: 6, height: 6, borderRadius: "50%", background: "#D4C9BC", flexShrink: 0, marginTop: 6 },
  ytInput: (small) => ({
    border: "none", background: "transparent", fontFamily: "inherit",
    fontSize: small ? 11 : 13, fontWeight: 300, color: small ? "#8C8078" : "#2E2B28",
    outline: "none", width: "100%", padding: "3px 0",
    borderBottom: small ? "none" : "1px solid #EDE8E2",
  }),
  revisitarRow: { display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 0", borderBottom: "1px solid #EDE8E2" },
  check: { width: 16, height: 16, marginTop: 2, accentColor: "#2E2B28", flexShrink: 0, cursor: "pointer" },
  revisitarInput: {
    flex: 1, border: "none", background: "transparent", fontFamily: "inherit",
    fontSize: 13, fontWeight: 300, color: "#2E2B28", outline: "none",
    resize: "none", minHeight: 20, lineHeight: 1.5,
  },
  semanaCard: {
    background: "#fff", borderRadius: 14, padding: "22px 22px 18px",
    marginBottom: 14, border: "1px solid #EDE8E2",
  },
  semanatop: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 },
  semanatitle: { fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 400 },
  semanaData: { fontSize: 11, color: "#A89880" },
};

function AutoTextarea({ value, onChange, placeholder, disabled, style }) {
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);
  return (
    <textarea ref={ref} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} style={{ ...style, minHeight: 60 }} rows={1} />
  );
}

function MapaUpload({ value, onChange, disabled }) {
  const ref = useRef();
  if (value) return (
    <div style={{ position: "relative", marginTop: 6 }}>
      <img src={value} alt="mapa mental" style={{ width: "100%", borderRadius: 8 }} />
      {!disabled && <button onClick={() => onChange(null)} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.4)", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", fontSize: 12 }}>✕</button>}
    </div>
  );
  return (
    <div onClick={() => !disabled && ref.current?.click()} style={{ border: "1.5px dashed #D4C9BC", borderRadius: 8, padding: "18px 16px", textAlign: "center", cursor: disabled ? "default" : "pointer", marginTop: 6, color: "#C9BFB4", fontSize: 12, lineHeight: 1.6 }}>
      <div style={{ fontSize: 20, marginBottom: 4 }}>📷</div>
      Toque para adicionar foto do mapa mental
      <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = ev => onChange(ev.target.result); reader.readAsDataURL(file); }} />
    </div>
  );
}

function Sessao({ sessao, index, onUpdate, onSave, onEdit }) {
  const saved = sessao.saved;
  return (
    <div style={{ ...S.card, opacity: saved ? 0.75 : 1 }}>
      <div style={S.cardTop}>
        <span style={S.cardData}>{sessao.data}</span>
        <span style={S.cardNum}>Sessão {index + 1}{saved ? " · salvo" : ""}</span>
      </div>
      {[
        { key: "tema", label: "O que estudei", placeholder: "Tema, aula, trecho...", big: false },
        { key: "ficou", label: "O que ficou — com minhas palavras", placeholder: "3 a 5 linhas livres. Sem olhar para o material.", big: true },
        { key: "aplicacao", label: "Onde isso aparece na minha vida agora?", placeholder: "Uma frase já é suficiente.", big: true },
      ].map(({ key, label, placeholder, big }) => (
        <div key={key}>
          <div style={S.fieldLabel}>{label}</div>
          {big ? <AutoTextarea value={sessao[key] || ""} placeholder={placeholder} disabled={saved} onChange={e => onUpdate(key, e.target.value)} style={S.fieldInput} /> : <input style={S.fieldInput} value={sessao[key] || ""} placeholder={placeholder} disabled={saved} onChange={e => onUpdate(key, e.target.value)} />}
        </div>
      ))}
      <div style={S.fieldLabel}>Mapa mental</div>
      <MapaUpload value={sessao.mapa} disabled={saved} onChange={v => onUpdate("mapa", v)} />
      {!saved ? <button style={S.btnSalvar} onClick={onSave}>Salvar sessão</button> : <button style={S.btnEditar} onClick={onEdit}>Editar</button>}
    </div>
  );
}

function FontePage({ fonte, dados, onChange }) {
  const sessoes = dados.sessoes || [];
  const novaSessao = () => onChange({ ...dados, sessoes: [...sessoes, { data: hoje(), tema: "", ficou: "", aplicacao: "", mapa: null, saved: false }] });
  const updateSessao = (i, key, val) => onChange({ ...dados, sessoes: sessoes.map((s, idx) => idx === i ? { ...s, [key]: val } : s) });
  const salvarSessao = (i) => onChange({ ...dados, sessoes: sessoes.map((s, idx) => idx === i ? { ...s, saved: true } : s) });
  const editarSessao = (i) => onChange({ ...dados, sessoes: sessoes.map((s, idx) => idx === i ? { ...s, saved: false } : s) });
  return (
    <div>
      <div style={S.fonteHeader}>
        <div style={S.fonteDot(fonte.cor)} />
        <div>
          <div style={S.fonteNome}>{fonte.nome}</div>
          <div style={S.fonteTipo}>{fonte.tipo}</div>
        </div>
      </div>
      {sessoes.map((s, i) => <Sessao key={i} sessao={s} index={i} onUpdate={(k, v) => updateSessao(i, k, v)} onSave={() => salvarSessao(i)} onEdit={() => editarSessao(i)} />)}
      <button style={S.btnNova} onClick={novaSessao}>+ Nova sessão</button>
    </div>
  );
}

function YoutubePage({ dados, onChange }) {
  const itens = dados.itens || [{ canal: "", insight: "" }];
  const update = (i, key, val) => onChange({ ...dados, itens: itens.map((it, idx) => idx === i ? { ...it, [key]: val } : it) });
  const adicionar = () => onChange({ ...dados, itens: [...itens, { canal: "", insight: "" }] });
  return (
    <div>
      <div style={S.fonteHeader}>
        <div style={S.fonteDot("#C4614A")} />
        <div><div style={S.fonteNome}>YouTube</div><div style={S.fonteTipo}>Victor Sales · Gabriel Tortella · outros</div></div>
      </div>
      <div style={S.card}>
        {itens.map((it, i) => (
          <div key={i} style={S.ytRow}>
            <div style={S.ytDot} />
            <div style={{ flex: 1 }}>
              <input style={S.ytInput(true)} placeholder="Canal / título do vídeo" value={it.canal} onChange={e => update(i, "canal", e.target.value)} />
              <input style={S.ytInput(false)} placeholder="O que ficou..." value={it.insight} onChange={e => update(i, "insight", e.target.value)} />
            </div>
          </div>
        ))}
      </div>
      <button style={S.btnNova} onClick={adicionar}>+ Adicionar vídeo</button>
    </div>
  );
}

function RevisitarPage({ dados, onChange }) {
  const itens = dados.itens || [{ texto: "", feito: false }];
  const update = (i, key, val) => onChange({ ...dados, itens: itens.map((it, idx) => idx === i ? { ...it, [key]: val } : it) });
  const adicionar = () => onChange({ ...dados, itens: [...itens, { texto: "", feito: false }] });
  return (
    <div>
      <div style={S.fonteHeader}>
        <div style={S.fonteDot("#A89880")} />
        <div><div style={S.fonteNome}>Revisitar</div><div style={S.fonteTipo}>Insights que merecem mais atenção</div></div>
      </div>
      <div style={S.card}>
        {itens.map((it, i) => (
          <div key={i} style={S.revisitarRow}>
            <input type="checkbox" style={S.check} checked={it.feito} onChange={e => update(i, "feito", e.target.checked)} />
            <AutoTextarea value={it.texto} placeholder="Anote algo que quer voltar..." onChange={e => update(i, "texto", e.target.value)} style={{ ...S.revisitarInput, textDecoration: it.feito ? "line-through" : "none", color: it.feito ? "#A89880" : "#2E2B28" }} />
          </div>
        ))}
      </div>
      <button style={S.btnNova} onClick={adicionar}>+ Adicionar</button>
    </div>
  );
}

function SemanaPage({ dados, onChange }) {
  const semanas = dados.semanas || [];
  const nova = () => onChange({ ...dados, semanas: [...semanas, { data: hoje(), aprendi: "", mudou: "", saved: false }] });
  const update = (i, key, val) => onChange({ ...dados, semanas: semanas.map((s, idx) => idx === i ? { ...s, [key]: val } : s) });
  const salvar = (i) => onChange({ ...dados, semanas: semanas.map((s, idx) => idx === i ? { ...s, saved: true } : s) });
  const editar = (i) => onChange({ ...dados, semanas: semanas.map((s, idx) => idx === i ? { ...s, saved: false } : s) });
  return (
    <div>
      <div style={S.fonteHeader}>
        <div style={S.fonteDot("#B89A5A")} />
        <div><div style={S.fonteNome}>O que aprendi esta semana</div><div style={S.fonteTipo}>Preencher todo domingo</div></div>
      </div>
      {semanas.map((s, i) => (
        <div key={i} style={{ ...S.semanaCard, opacity: s.saved ? 0.75 : 1 }}>
          <div style={S.semanatop}>
            <span style={S.semanatitle}>Semana {i + 1}</span>
            <span style={S.semanaData}>{s.data}</span>
          </div>
          <div style={S.fieldLabel}>O que aprendi esta semana</div>
          <AutoTextarea value={s.aprendi} placeholder="3 a 5 frases livres. O que realmente ficou?" disabled={s.saved} onChange={e => update(i, "aprendi", e.target.value)} style={{ ...S.fieldInput, minHeight: 70 }} />
          <div style={S.fieldLabel}>Como mudou algo em mim ou na minha rotina?</div>
          <AutoTextarea value={s.mudou} placeholder="Uma frase já conta." disabled={s.saved} onChange={e => update(i, "mudou", e.target.value)} style={{ ...S.fieldInput, minHeight: 44 }} />
          {!s.saved ? <button style={S.btnSalvar} onClick={() => salvar(i)}>Salvar semana</button> : <button style={S.btnEditar} onClick={() => editar(i)}>Editar</button>}
        </div>
      ))}
      <button style={S.btnNova} onClick={nova}>+ Nova semana</button>
    </div>
  );
}

export default function App() {
  const [aba, setAba] = useState("elton");
  const [dados, setDados] = useStorage("estudos_90dias", {});
  const updateDados = (key, val) => setDados({ ...dados, [key]: val });
  const renderAba = () => {
    const fonte = FONTES.find(f => f.id === aba);
    if (["elton", "rd", "lucia", "artur", "livro"].includes(aba)) return <FontePage fonte={fonte} dados={dados[aba] || {}} onChange={v => updateDados(aba, v)} />;
    if (aba === "youtube") return <YoutubePage dados={dados.youtube || {}} onChange={v => updateDados("youtube", v)} />;
    if (aba === "revisitar") return <RevisitarPage dados={dados.revisitar || {}} onChange={v => updateDados("revisitar", v)} />;
    if (aba === "semana") return <SemanaPage dados={dados.semana || {}} onChange={v => updateDados("semana", v)} />;
  };
  return (
    <div style={S.app}>
      <div style={S.wrap}>
        <div style={S.eyebrow}>Sprint · 90 dias</div>
        <div style={S.title}>Segundo Cérebro</div>
        <div style={S.sub}>Capture o que aprende. Revise o que importa. Evolua com intenção.</div>
        <div style={S.ritualBox}>
          <div style={S.ritualLabel}>Ritual de cada sessão</div>
          {RITUAL.map((r, i) => (
            <div key={i} style={S.ritualRow}>
              <span style={S.ritualN}>{i + 1}</span>
              <span style={S.ritualText}>{r}</span>
            </div>
          ))}
        </div>
        <nav style={S.nav}>
          {FONTES.map(f => <button key={f.id} style={S.navBtn(aba === f.id)} onClick={() => setAba(f.id)}>{f.nome}</button>)}
        </nav>
        {renderAba()}
      </div>
    </div>
  );
}
