import { useState } from "react";
import logo from "./logo.jpg";

export default function TelefonleitfadenApp() {
  const steps = {
    start: {
      question: "Worum geht es beim Anruf?",
      options: [
        { label: "Buchungsanfrage", next: "buchung_rueckfrage" },
        { label: "Verlängerung", next: "verlaengerung_1" },
        { label: "Aktueller Gast", next: "gast_1" },
        { label: "Handwerker", next: "handwerker_1" },
        { label: "Werbeanruf", next: "werbung" }
      ]
    },
    buchung_rueckfrage: {
      question: "Stellt der Anrufer zuerst Rückfragen zu Wohnungen, Betten oder Standorten?",
      options: [
        { label: "Ja", next: "buchung_info" },
        { label: "Nein, direkt Anfrage", next: "buchung_1" }
      ]
    },
    buchung_info: {
      question: "Antwort: Wir bieten voll ausgestattete Apartments für 1–6 Personen in Neumünster, Kiel und Itzehoe. Einzel-/Doppel-/Dreibettzimmer, WLAN, Küche, Waschmaschine, Parkplatz.",
      options: [{ label: "Weiter zu Buchungsdetails", next: "buchung_1" }]
    },
    buchung_1: { question: "Für welchen Zeitraum wird eine Unterkunft gesucht?", input: true, next: "buchung_2" },
    buchung_2: { question: "In welcher Stadt oder Region?", input: true, next: "buchung_3" },
    buchung_3: { question: "Wie viele Personen reisen an?", input: true, next: "buchung_4" },
    buchung_4: { question: "Welche Zimmerart und wie viele Zimmer werden benötigt?", input: true, next: "buchung_5" },
    buchung_5: { question: "Ist der Aufenthalt beruflich oder privat?", input: true, next: "buchung_6" },
    buchung_6: { question: "Gibt es ein Budget?", input: true, next: "buchung_7" },
    buchung_7: { question: "Gibt es besondere Wünsche?", input: true, next: "buchung_8" },
    buchung_8: { question: "Bitte Kontaktdaten aufnehmen:", inputs: ["Name", "E-Mail", "Telefonnummer"], required: true, next: "ende" },
    verlaengerung_1: { question: "Name der Firma oder auf wen läuft die Buchung?", input: true, next: "verlaengerung_2" },
    verlaengerung_2: { question: "Bis wann geht die ursprüngliche Buchung?", input: true, next: "verlaengerung_3" },
    verlaengerung_3: { question: "Welche Wohnung bewohnt der Anrufer aktuell?", input: true, next: "verlaengerung_4" },
    verlaengerung_4: {
      question: "Bis wann soll verlängert werden? Hinweis: Bitte zusätzlich per E-Mail an buchung@elephant-apartments.com senden",
      input: true,
      next: "ende"
    },
    gast_1: {
      question: "Bitte wähle das Anliegen des Gastes:",
      options: [
        { label: "WLAN funktioniert nicht", next: "gast_anliegen_detail" },
        { label: "Schlüsselproblem oder Check-in", next: "gast_anliegen_detail" },
        { label: "Frage zum Check-in", next: "gast_anliegen_detail" },
        { label: "Frage zur Abreise", next: "gast_anliegen_detail" },
        { label: "Mängel an der Wohnung", next: "gast_anliegen_detail" },
        { label: "Lärmbeschwerde / Störung", next: "gast_anliegen_detail" }
      ]
    },
    gast_anliegen_detail: {
      question: "Bitte beschreibe das Anliegen möglichst genau:",
      input: true,
      next: "gast_wohnung"
    },
    gast_wohnung: {
      question: "Welche Wohnung bewohnt der Gast?",
      input: true,
      next: "gast_detail"
    },
    gast_detail: {
      question: "Bitte trage die Kontaktdaten des Gastes ein:",
      inputs: ["Name", "E-Mail", "Telefonnummer"],
      required: true,
      next: "ende"
    },
    handwerker_1: { question: "Welches Objekt oder welche Adresse betrifft es?", input: true, next: "handwerker_2" },
    handwerker_2: { question: "Was genau soll gemacht werden?", input: true, next: "handwerker_3" },
    handwerker_3: { question: "Gibt es einen Termin oder Beauftragenden?", input: true, next: "handwerker_4" },
    handwerker_4: { question: "Wurde bereits mit jemandem gesprochen?", input: true, next: "ende" },
    werbung: {
      question: "Bitte senden Sie Ihr Angebot schriftlich an buchung@elephant-apartments.com",
      options: [{ label: "Gespräch freundlich beenden", next: "ende" }]
    },
    ende: {
      question: "Gespräch beendet oder weitergeleitet. Danke für den Anruf!",
      summary: true,
      restart: true
    }
  };
  const [step, setStep] = useState("start");
  const [answers, setAnswers] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [inputFields, setInputFields] = useState({});
  const current = steps[step];
  const anliegenLabel = answers["start"];

  const handleNext = () => {
    setAnswers({ ...answers, [step]: inputValue });
    setInputValue("");
    setStep(current.next);
  };

  const handleMultiNext = () => {
    setAnswers({ ...answers, [step]: inputFields });
    setInputFields({});
    setStep(current.next);
  };

  const copySummary = () => {
    const text = Object.entries(answers)
      .map(([key, val]) => {
        if (typeof val === "object") {
          return Object.entries(val)
            .map(([label, value]) => `${label}: ${value}`)
            .join("\n");
        } else {
          return `${steps[key]?.question || key}: ${val}`;
        }
      })
      .join("\n\n");
    navigator.clipboard.writeText(text);
    alert("Zusammenfassung kopiert!");
  };

  const downloadSummary = () => {
    const content = Object.entries(answers)
      .map(([key, val]) => {
        if (typeof val === "object") {
          return Object.entries(val)
            .map(([label, value]) => `${label}: ${value}`)
            .join("\n");
        } else {
          return `${steps[key]?.question || key}: ${val}`;
        }
      })
      .join("\n\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zusammenfassung.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <img src={logo} alt="Logo" style={{ maxWidth: 300, marginBottom: 20 }} />

      <h2>{current.question}</h2>

      {current.options && current.options.map((opt, i) => (
        <button key={i} onClick={() => {
          setAnswers({ ...answers, [step]: opt.label });
          setStep(opt.next);
        }} style={{ display: "block", margin: "10px 0", padding: "10px 15px", width: "100%" }}>
          {opt.label}
        </button>
      ))}

      {current.input && (
        <div>
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <button onClick={handleNext}>Weiter</button>
        </div>
      )}

      {current.inputs && (
        <div>
          {current.inputs.map((label, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <label>{label}</label><br />
              <input
                type="text"
                value={inputFields[label] || ""}
                onChange={e => setInputFields({ ...inputFields, [label]: e.target.value })}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>
          ))}
          <button onClick={handleMultiNext}>Weiter</button>
        </div>
      )}

      {current.summary && (
        <div>
          <h3>📋 Zusammenfassung:</h3>
          <pre style={{ background: "#f4f4f4", padding: "10px", whiteSpace: "pre-wrap" }}>
            {Object.entries(answers)
              .map(([k, v]) => {
                if (typeof v === "object") {
                  return Object.entries(v)
                    .map(([lk, lv]) => `• ${lk}: ${lv}`)
                    .join("\n");
                } else {
                  return `• ${steps[k]?.question || k}: ${v}`;
                }
              }).join("\n")}
          </pre>
          <button onClick={copySummary} style={{ marginRight: 10 }}>📋 Kopieren</button>
          <button onClick={downloadSummary} style={{ marginRight: 10 }}>💾 Speichern</button>
          {current.restart && (
            <button onClick={() => { setStep("start"); setAnswers({}); }}>🔁 Zurück zum Start</button>
          )}
        </div>
      )}
    </div>
  );
}
