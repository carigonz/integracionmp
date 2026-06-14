import { useState, useEffect } from "react";

const PRICES = {
  bocaToma: 30000,
  bocaLuz: 20000,
  canalizacionSuperficial: 10000,
  canalizacionEmbutida: 20000,
  tableroBase: 40000,
  termicaAdicional: 15000,
  protectorTension: 40000,
  deteccionFalla: 120000,
  tendidoCable: 15000,
};

const RECARGOS = {
  edificioViejo: 0.15, // +15% edificios >20 años
  pisoAlto: 0.10,      // +10% piso 5+
};

function formatARS(n) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

// Step indicator dots
function StepDots({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 16 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 24 : 8,
            height: 8,
            borderRadius: 4,
            background: i <= current ? "#d4930d" : "rgba(255,255,255,0.2)",
            transition: "all 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

// Radio-style option button
function OptionButton({ selected, label, subtitle, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        padding: "12px 16px",
        borderRadius: 10,
        border: selected ? "2px solid #d4930d" : "2px solid rgba(255,255,255,0.12)",
        background: selected ? "rgba(212,147,13,0.12)" : "rgba(255,255,255,0.04)",
        color: "white",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.2s ease",
        fontSize: 14,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div>
        <div style={{ fontWeight: 600 }}>{label}</div>
        {subtitle && <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>{subtitle}</div>}
      </div>
    </button>
  );
}

// Counter input
function Counter({ label, value, onChange, min = 0, max = 50, unit = "" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <span style={{ color: "white", fontSize: 14, fontFamily: "'Inter', sans-serif" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          style={{
            width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.06)", color: "white", fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >−</button>
        <span style={{ color: "white", fontWeight: 700, fontSize: 16, minWidth: 28, textAlign: "center", fontFamily: "'Inter', sans-serif" }}>
          {value}{unit && <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.6 }}> {unit}</span>}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          style={{
            width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.06)", color: "white", fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >+</button>
      </div>
    </div>
  );
}

function CheckOption({ label, checked, onChange, icon }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 14px",
        borderRadius: 8, border: checked ? "2px solid #d4930d" : "2px solid rgba(255,255,255,0.1)",
        background: checked ? "rgba(212,147,13,0.1)" : "transparent",
        color: "white", cursor: "pointer", textAlign: "left", fontSize: 13,
        fontFamily: "'Inter', sans-serif", transition: "all 0.2s",
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: 4, border: checked ? "none" : "2px solid rgba(255,255,255,0.3)",
        background: checked ? "#d4930d" : "transparent", display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 13, flexShrink: 0,
      }}>
        {checked && "✓"}
      </div>
      <span>{icon} {label}</span>
    </button>
  );
}

export default function PresupuestoWizard() {
  const [step, setStep] = useState(0);
  const [minimized, setMinimized] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Step 0: Tipo de propiedad
  const [tipoPropiedad, setTipoPropiedad] = useState(null); // casa | depto | ph

  // Step 1: Detalles propiedad
  const [piso, setPiso] = useState(1);
  const [antiguedad, setAntiguedad] = useState(10);
  const [ambientes, setAmbientes] = useState(2);
  const [m2, setM2] = useState(50);

  // Step 2: Trabajos (multi-select)
  const [trabajos, setTrabajos] = useState({
    bocasToma: false,
    bocasLuz: false,
    canalizacion: false,
    tablero: false,
    protector: false,
    falla: false,
    tendidoCable: false,
  });

  // Step 3: Cantidades
  const [cantBocasToma, setCantBocasToma] = useState(1);
  const [cantBocasLuz, setCantBocasLuz] = useState(1);
  const [metrosCanalizacion, setMetrosCanalizacion] = useState(5);
  const [tipoCanalizacion, setTipoCanalizacion] = useState("superficial");
  const [termicasAdicionales, setTermicasAdicionales] = useState(0);
  const [metrosCable, setMetrosCable] = useState(5);

  const totalSteps = 4;

  function calcularPresupuesto() {
    let total = 0;
    if (trabajos.bocasToma) total += cantBocasToma * PRICES.bocaToma;
    if (trabajos.bocasLuz) total += cantBocasLuz * PRICES.bocaLuz;
    if (trabajos.canalizacion) {
      total += metrosCanalizacion * (tipoCanalizacion === "superficial" ? PRICES.canalizacionSuperficial : PRICES.canalizacionEmbutida);
    }
    if (trabajos.tablero) total += PRICES.tableroBase + termicasAdicionales * PRICES.termicaAdicional;
    if (trabajos.protector) total += PRICES.protectorTension;
    if (trabajos.falla) total += PRICES.deteccionFalla;
    if (trabajos.tendidoCable) total += metrosCable * PRICES.tendidoCable;

    // Recargos
    if (tipoPropiedad === "depto") {
      if (antiguedad > 20) total *= (1 + RECARGOS.edificioViejo);
      if (piso >= 5) total *= (1 + RECARGOS.pisoAlto);
    }

    return total;
  }

  const anyTrabajoSelected = Object.values(trabajos).some(Boolean);

  function canAdvance() {
    if (step === 0) return tipoPropiedad !== null;
    if (step === 1) return true;
    if (step === 2) return anyTrabajoSelected;
    if (step === 3) return true;
    return false;
  }

  function handleNext() {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  }

  function handleBack() {
    if (showResult) {
      setShowResult(false);
    } else if (step > 0) {
      setStep(step - 1);
    }
  }

  function handleReset() {
    setStep(0);
    setShowResult(false);
    setTipoPropiedad(null);
    setTrabajos({ bocasToma: false, bocasLuz: false, canalizacion: false, tablero: false, protector: false, falla: false, tendidoCable: false });
  }

  function buildWhatsAppMessage() {
    const lines = ["Hola, solicito un presupuesto estimado:"];
    lines.push(`Tipo: ${tipoPropiedad === "casa" ? "Casa" : tipoPropiedad === "depto" ? "Departamento" : "PH"}`);
    if (tipoPropiedad === "depto") {
      lines.push(`Piso: ${piso} | Antigüedad: ${antiguedad} años`);
    } else {
      lines.push(`Ambientes: ${ambientes} | m²: ${m2}`);
    }
    lines.push("Trabajos:");
    if (trabajos.bocasToma) lines.push(`- Bocas de toma: ${cantBocasToma}`);
    if (trabajos.bocasLuz) lines.push(`- Bocas de luz: ${cantBocasLuz}`);
    if (trabajos.canalizacion) lines.push(`- Canalización ${tipoCanalizacion}: ${metrosCanalizacion}m`);
    if (trabajos.tablero) lines.push(`- Tablero + ${termicasAdicionales} térmicas adicionales`);
    if (trabajos.protector) lines.push("- Protector de tensión");
    if (trabajos.falla) lines.push("- Detección de falla");
    if (trabajos.tendidoCable) lines.push(`- Tendido de cable: ${metrosCable}m`);
    const total = calcularPresupuesto();
    lines.push(`Estimado web: ${formatARS(total)} - ${formatARS(total * 1.2)}`);
    return encodeURIComponent(lines.join("\n"));
  }

  // --- MINIMIZED FLOATING BUTTON ---
  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        style={{
          position: "fixed", bottom: 90, right: 24, zIndex: 999,
          background: "linear-gradient(135deg, #d4930d 0%, #b87a0a 100%)",
          color: "white", border: "none", borderRadius: 50, padding: "14px 22px",
          fontSize: 14, fontWeight: 700, cursor: "pointer",
          boxShadow: "0 4px 20px rgba(212,147,13,0.4)",
          display: "flex", alignItems: "center", gap: 8,
          fontFamily: "'Poppins', sans-serif",
          animation: "pulse 2s infinite",
        }}
      >
        <span style={{ fontSize: 18 }}>⚡</span> Presupuesto rápido
        <style>{`@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }`}</style>
      </button>
    );
  }

  // --- RESULT SCREEN ---
  if (showResult) {
    const total = calcularPresupuesto();
    const min = total;
    const max = Math.round(total * 1.2);

    return (
      <div style={{
        background: "rgba(10,20,40,0.92)", backdropFilter: "blur(20px)",
        borderRadius: 16, padding: 28, maxWidth: 380, width: "100%",
        border: "1px solid rgba(255,255,255,0.08)",
        fontFamily: "'Inter', sans-serif",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>⚡</div>
          <h3 style={{ color: "white", fontSize: 18, fontWeight: 700, fontFamily: "'Poppins', sans-serif", margin: 0 }}>
            Estimación aproximada
          </h3>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 4 }}>
            Sujeto a visita técnica
          </p>
        </div>

        <div style={{
          background: "linear-gradient(135deg, rgba(212,147,13,0.15) 0%, rgba(212,147,13,0.05) 100%)",
          borderRadius: 12, padding: "20px 16px", textAlign: "center",
          border: "1px solid rgba(212,147,13,0.25)", marginBottom: 16,
        }}>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginBottom: 6 }}>Rango estimado</div>
          <div style={{ color: "#d4930d", fontSize: 28, fontWeight: 800, fontFamily: "'Poppins', sans-serif" }}>
            {formatARS(min)}
          </div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "4px 0" }}>a</div>
          <div style={{ color: "#d4930d", fontSize: 28, fontWeight: 800, fontFamily: "'Poppins', sans-serif" }}>
            {formatARS(max)}
          </div>
        </div>

        {/* Desglose */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Desglose</div>
          {trabajos.bocasToma && (
            <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.7)", fontSize: 13, padding: "4px 0" }}>
              <span>Bocas de toma ×{cantBocasToma}</span><span>{formatARS(cantBocasToma * PRICES.bocaToma)}</span>
            </div>
          )}
          {trabajos.bocasLuz && (
            <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.7)", fontSize: 13, padding: "4px 0" }}>
              <span>Bocas de luz ×{cantBocasLuz}</span><span>{formatARS(cantBocasLuz * PRICES.bocaLuz)}</span>
            </div>
          )}
          {trabajos.canalizacion && (
            <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.7)", fontSize: 13, padding: "4px 0" }}>
              <span>Canalización {tipoCanalizacion} {metrosCanalizacion}m</span>
              <span>{formatARS(metrosCanalizacion * (tipoCanalizacion === "superficial" ? PRICES.canalizacionSuperficial : PRICES.canalizacionEmbutida))}</span>
            </div>
          )}
          {trabajos.tablero && (
            <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.7)", fontSize: 13, padding: "4px 0" }}>
              <span>Tablero {termicasAdicionales > 0 ? `+${termicasAdicionales} térm.` : ""}</span>
              <span>{formatARS(PRICES.tableroBase + termicasAdicionales * PRICES.termicaAdicional)}</span>
            </div>
          )}
          {trabajos.protector && (
            <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.7)", fontSize: 13, padding: "4px 0" }}>
              <span>Protector de tensión</span><span>{formatARS(PRICES.protectorTension)}</span>
            </div>
          )}
          {trabajos.falla && (
            <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.7)", fontSize: 13, padding: "4px 0" }}>
              <span>Detección de falla</span><span>{formatARS(PRICES.deteccionFalla)}</span>
            </div>
          )}
          {trabajos.tendidoCable && (
            <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.7)", fontSize: 13, padding: "4px 0" }}>
              <span>Tendido cable {metrosCable}m</span><span>{formatARS(metrosCable * PRICES.tendidoCable)}</span>
            </div>
          )}
          {tipoPropiedad === "depto" && (antiguedad > 20 || piso >= 5) && (
            <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,200,100,0.7)", fontSize: 12, padding: "6px 0", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 4 }}>
              <span>Recargo depto {antiguedad > 20 ? "(+15% antigüedad)" : ""} {piso >= 5 ? "(+10% piso alto)" : ""}</span>
              <span>incluido</span>
            </div>
          )}
        </div>

        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, textAlign: "center", margin: "0 0 16px", lineHeight: 1.5 }}>
          Este es un estimado orientativo. El presupuesto final se define con una visita técnica.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <a
            href={`https://wa.me/5491173644604?text=${buildWhatsAppMessage()}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "12px 20px", borderRadius: 10,
              background: "#25D366", color: "white", fontWeight: 700, fontSize: 14,
              textDecoration: "none", cursor: "pointer", border: "none",
            }}
          >
            📱 Enviar por WhatsApp
          </a>
          <button
            onClick={() => { /* Navegar a /cotizar */ }}
            style={{
              padding: "12px 20px", borderRadius: 10,
              background: "linear-gradient(135deg, #d4930d, #b87a0a)",
              color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer", border: "none",
            }}
          >
            📋 Presupuesto detallado
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleBack} style={{
              flex: 1, padding: "10px", borderRadius: 8, background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer", fontSize: 13,
            }}>← Volver</button>
            <button onClick={handleReset} style={{
              flex: 1, padding: "10px", borderRadius: 8, background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer", fontSize: 13,
            }}>Reiniciar</button>
          </div>
        </div>

        <button
          onClick={() => setMinimized(true)}
          style={{
            position: "absolute", top: 10, right: 10, background: "transparent",
            border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 18,
          }}
        >×</button>
      </div>
    );
  }

  // --- WIZARD STEPS ---
  return (
    <div style={{
      background: "rgba(10,20,40,0.92)", backdropFilter: "blur(20px)",
      borderRadius: 16, padding: 28, maxWidth: 380, width: "100%",
      border: "1px solid rgba(255,255,255,0.08)", position: "relative",
      fontFamily: "'Inter', sans-serif",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ color: "white", fontSize: 16, fontWeight: 700, margin: "0 0 4px", fontFamily: "'Poppins', sans-serif" }}>
          ⚡ Presupuesto rápido
        </h3>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, margin: 0 }}>
          Estimá el costo de tu proyecto en segundos
        </p>
      </div>

      <StepDots current={step} total={totalSteps} />

      {/* STEP 0: Tipo de propiedad */}
      {step === 0 && (
        <div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginBottom: 12 }}>¿Qué tipo de propiedad es?</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <OptionButton icon="🏠" label="Casa" subtitle="Vivienda particular" selected={tipoPropiedad === "casa"} onClick={() => setTipoPropiedad("casa")} />
            <OptionButton icon="🏢" label="Departamento" subtitle="En edificio" selected={tipoPropiedad === "depto"} onClick={() => setTipoPropiedad("depto")} />
            <OptionButton icon="🏘️" label="PH" subtitle="Propiedad horizontal" selected={tipoPropiedad === "ph"} onClick={() => setTipoPropiedad("ph")} />
          </div>
        </div>
      )}

      {/* STEP 1: Detalles propiedad */}
      {step === 1 && (
        <div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginBottom: 12 }}>
            Contanos sobre la propiedad
          </p>
          {tipoPropiedad === "depto" ? (
            <>
              <Counter label="Piso" value={piso} onChange={setPiso} min={1} max={30} />
              <Counter label="Antigüedad del edificio" value={antiguedad} onChange={setAntiguedad} min={0} max={100} unit="años" />
              <Counter label="Ambientes" value={ambientes} onChange={setAmbientes} min={1} max={10} />
            </>
          ) : (
            <>
              <Counter label="Ambientes" value={ambientes} onChange={setAmbientes} min={1} max={15} />
              <Counter label="Superficie aprox." value={m2} onChange={setM2} min={10} max={500} unit="m²" />
            </>
          )}
        </div>
      )}

      {/* STEP 2: Trabajos */}
      {step === 2 && (
        <div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginBottom: 12 }}>¿Qué trabajos necesitás?</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <CheckOption icon="🔌" label="Cambio de bocas de toma" checked={trabajos.bocasToma} onChange={(v) => setTrabajos({ ...trabajos, bocasToma: v })} />
            <CheckOption icon="💡" label="Bocas de luz" checked={trabajos.bocasLuz} onChange={(v) => setTrabajos({ ...trabajos, bocasLuz: v })} />
            <CheckOption icon="🔧" label="Canalización eléctrica" checked={trabajos.canalizacion} onChange={(v) => setTrabajos({ ...trabajos, canalizacion: v })} />
            <CheckOption icon="📦" label="Cambio de tablero" checked={trabajos.tablero} onChange={(v) => setTrabajos({ ...trabajos, tablero: v })} />
            <CheckOption icon="🛡️" label="Protector de tensión" checked={trabajos.protector} onChange={(v) => setTrabajos({ ...trabajos, protector: v })} />
            <CheckOption icon="🔍" label="Detección de falla" checked={trabajos.falla} onChange={(v) => setTrabajos({ ...trabajos, falla: v })} />
            <CheckOption icon="🔌" label="Tendido de cable principal" checked={trabajos.tendidoCable} onChange={(v) => setTrabajos({ ...trabajos, tendidoCable: v })} />
          </div>
        </div>
      )}

      {/* STEP 3: Cantidades */}
      {step === 3 && (
        <div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginBottom: 12 }}>Definí las cantidades</p>
          {trabajos.bocasToma && (
            <Counter label="Bocas de toma" value={cantBocasToma} onChange={setCantBocasToma} min={1} max={30} />
          )}
          {trabajos.bocasLuz && (
            <Counter label="Bocas de luz" value={cantBocasLuz} onChange={setCantBocasLuz} min={1} max={30} />
          )}
          {trabajos.canalizacion && (
            <>
              <Counter label="Metros de canalización" value={metrosCanalizacion} onChange={setMetrosCanalizacion} min={1} max={100} unit="m" />
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <OptionButton label="Superficial" selected={tipoCanalizacion === "superficial"} onClick={() => setTipoCanalizacion("superficial")} icon="📐" />
                <OptionButton label="Embutida" selected={tipoCanalizacion === "embutida"} onClick={() => setTipoCanalizacion("embutida")} icon="🧱" />
              </div>
            </>
          )}
          {trabajos.tablero && (
            <Counter label="Térmicas adicionales" value={termicasAdicionales} onChange={setTermicasAdicionales} min={0} max={10} />
          )}
          {trabajos.tendidoCable && (
            <Counter label="Metros de cable" value={metrosCable} onChange={setMetrosCable} min={1} max={100} unit="m" />
          )}
          {!trabajos.bocasToma && !trabajos.bocasLuz && !trabajos.canalizacion && !trabajos.tablero && !trabajos.tendidoCable && (
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
              Los servicios seleccionados tienen precio fijo. Continuá para ver el estimado.
            </p>
          )}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
        {step > 0 && (
          <button
            onClick={handleBack}
            style={{
              flex: "0 0 auto", padding: "12px 16px", borderRadius: 10,
              background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", fontSize: 14,
            }}
          >←</button>
        )}
        <button
          onClick={handleNext}
          disabled={!canAdvance()}
          style={{
            flex: 1, padding: "12px 20px", borderRadius: 10,
            background: canAdvance() ? "linear-gradient(135deg, #d4930d, #b87a0a)" : "rgba(255,255,255,0.06)",
            color: canAdvance() ? "white" : "rgba(255,255,255,0.3)",
            border: "none", fontWeight: 700, fontSize: 14, cursor: canAdvance() ? "pointer" : "default",
            transition: "all 0.2s",
          }}
        >
          {step === totalSteps - 1 ? "Ver estimado" : "Siguiente →"}
        </button>
      </div>

      {/* Minimize */}
      <button
        onClick={() => setMinimized(true)}
        style={{
          position: "absolute", top: 10, right: 10, background: "transparent",
          border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 18,
        }}
      >×</button>
    </div>
  );
}
