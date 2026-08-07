#!/usr/bin/env node
/**
 * Liste ce que NexPit doit encore fournir.
 *
 * Le site n'invente rien : toute donnée absente vaut `PENDING` dans content/,
 * et les composants sautent la section correspondante. Ce script sort ces
 * manques du navigateur pour qu'on puisse les traiter sans cliquer partout.
 *
 *   pnpm check:content              liste et sort en 0
 *   pnpm check:content --strict     sort en 1 s'il reste des manques légaux
 *
 * L'analyse est textuelle : elle repère les occurrences de PENDING dans les
 * fichiers de contenu. Pas d'exécution du code, donc pas de dépendance à une
 * chaîne de compilation pour un outil censé rendre service en trois secondes.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(root, "content");

/** Champs dont l'absence empêche une mise en ligne légale en France. */
const BLOCKING = new Set([
  "legalName",
  "legalForm",
  "siret",
  "address",
  "publicationDirector",
  "host",
]);

const EXPLAIN = {
  legalName: "Raison sociale exacte",
  legalForm: "Forme juridique (micro-entreprise, SASU, …)",
  siret: "Numéro SIRET",
  ape: "Code APE",
  vat: "Numéro de TVA intracommunautaire (ou franchise en base)",
  shareCapital: "Capital social, si société",
  address: "Adresse du siège rendue publique",
  publicationDirector: "Directeur de la publication",
  registrationCity: "Ville d'immatriculation (RCS ou RM)",
  host: "Nom et adresse de l'hébergeur",
  phone: "Téléphone public, si vous en voulez un",
  founded: "Mois et année de création de NexPit",
  team: "Noms, rôles et parcours de l'équipe",
  headcount: "Nombre de personnes dans la structure",
  link: "Lien public vers le projet, s'il en existe un",
};

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (full.endsWith(".ts") || full.endsWith(".tsx")) out.push(full);
  }
  return out;
}

const findings = [];

for (const file of walk(contentDir)) {
  const rel = path.relative(root, file);
  const lines = readFileSync(file, "utf8").split("\n");

  lines.forEach((line, i) => {
    if (!/\bPENDING\b/.test(line)) return;

    // On ne retient qu'une affectation réelle : `  siret: PENDING,` ou
    // `  phone: PENDING as Maybe<string>,`. Les imports, les commentaires et
    // les déclarations de types citent PENDING sans rien laisser à remplir.
    const m = /^\s*(?:readonly\s+)?([A-Za-z0-9_]+)\s*:\s*PENDING\b/.exec(line);
    if (!m) return;
    const field = m[1];

    // Retrouve le projet concerné pour les champs répétés d'un tableau.
    let scope = "";
    if (rel.endsWith("projects.ts")) {
      for (let j = i; j >= 0; j -= 1) {
        const s = /^\s*slug:\s*"([^"]+)"/.exec(lines[j]);
        if (s) {
          scope = ` (projet ${s[1]})`;
          break;
        }
      }
    }

    findings.push({
      file: rel,
      line: i + 1,
      field,
      scope,
      blocking: BLOCKING.has(field),
      help: EXPLAIN[field] ?? "",
    });
  });
}

const blocking = findings.filter((f) => f.blocking);
const rest = findings.filter((f) => !f.blocking);

const show = (list) => {
  for (const f of list) {
    const help = f.help ? ` — ${f.help}` : "";
    console.log(`  ${f.file}:${f.line}  ${f.field}${f.scope}${help}`);
  }
};

console.log("");
if (blocking.length) {
  console.log(`BLOQUANT POUR LA MISE EN LIGNE (${blocking.length})`);
  console.log("  Sans ces champs, les mentions légales sont incomplètes, ce que");
  console.log("  l'article 6-III de la LCEN sanctionne. Fichier : content/site.ts");
  console.log("");
  show(blocking);
  console.log("");
}

if (rest.length) {
  console.log(`À COMPLÉTER QUAND VOUS AUREZ L'INFORMATION (${rest.length})`);
  console.log("  Ces sections ne s'affichent pas tant que la donnée manque.");
  console.log("");
  show(rest);
  console.log("");
}

if (findings.length === 0) {
  console.log("Rien à compléter : tous les champs de contenu sont renseignés.");
  console.log("");
}

if (process.argv.includes("--strict") && blocking.length > 0) {
  console.error(`Échec : ${blocking.length} champs légaux manquants.`);
  process.exit(1);
}
