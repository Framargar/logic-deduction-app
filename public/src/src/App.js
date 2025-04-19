import React, { useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { motion } from "framer-motion";

// Regole di inferenza base
const rules = {
  "→E (Modus Ponens)": ([b, a]) =>
    b.formula.includes("\\supset") &&
    a.formula === b.formula.split(" \\supset ")[0],
  "MT (Modus Tollens)": ([b, a]) =>
    b.formula.includes("\\supset") &&
    a.formula === `\\sim ${b.formula.split(" \\supset ")[1]}`,
  "DN (Double Negation)": (step) => /\\sim\\sim/.test(step.formula),
  "∀I": (a) => a.formula.startsWith("\\forall"),
  "∀E": (a) => a.formula.includes("\\forall"),
  "Nec": (a) => a.formula.startsWith("\\Box"),
};

function renderFormula(formula) {
  try {
    return katex.renderToString(formula, { throwOnError: false });
  } catch {
    return formula;
  }
}

export default function App() {
  const [steps, setSteps] = useState([]);
  const [input, setInput] = useState("");
  const [showTree, setShowTree] = useState(false);

  const translateFormula = (text) =>
    text
      .replace(/->/g, " \\supset ")
      .replace(/~/g, "\\sim ")
      .replace(/&/g, " \\cdot ")
      .replace(/forall/g, "\\forall")
      .replace(/exists/g, "\\exists")
      .replace(/Box/g, "\\Box")
      .replace(/Diamond/g, "\\Diamond");

  const addStep = () => {
    if (!input.trim()) return;
    const [formula, justification] = input.split(" (");
    const step = {
      id: steps.length + 1,
      formula: translateFormula(formula.trim()),
      rule: justification ? justification.replace(")", "").trim() : "",
    };
    setSteps([...steps, step]);
    setInput("");
  };

  const verifyDeduction = () => {
    if (steps.length < 2) return false;
    const last = steps[steps.length - 1];
    for (let [name, fn] of Object.entries(rules)) {
      try {
        if (fn(steps.slice(-2), last)) return true;
      } catch {}
    }
    return false;
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h1>Deduzioni Logiche</h1>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Es: P -> Q (→E)"
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={addStep}>Aggiungi</button>
        <
