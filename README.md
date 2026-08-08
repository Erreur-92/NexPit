# Site NexPit

Site public de NexPit : Next.js 16 (App Router), React 19, TypeScript strict,
Tailwind 3. Français et anglais. Formulaire de contact, prise de rendez-vous
avec invitation calendrier, lettre d'information à double confirmation.

---

## Sommaire

1. [Lancer le projet](#1-lancer-le-projet)
2. [Variables d'environnement](#2-variables-denvironnement)
3. [Modifier le contenu](#3-modifier-le-contenu)
4. [Ce qui reste à compléter](#4-ce-qui-reste-à-compléter)
5. [Architecture](#5-architecture)
6. [Prise de rendez-vous](#6-prise-de-rendez-vous)
7. [Emails](#7-emails)
8. [Stockage](#8-stockage)
9. [Rappels automatiques](#9-rappels-automatiques)
10. [Mesure d'audience et RGPD](#10-mesure-daudience-et-rgpd)
11. [Polices](#11-polices)
12. [Tests et vérifications](#12-tests-et-vérifications)
13. [Déploiement](#13-déploiement)

---

## 1. Lancer le projet

Node 20 ou plus récent, pnpm 9 ou plus récent.

```bash
pnpm install
cp .env.example .env.local     # puis remplir, voir section 2
pnpm dev                       # http://localhost:3000 → redirige vers /fr
```

Autres commandes :

| Commande | Ce qu'elle fait |
|---|---|
| `pnpm build` | Build de production |
| `pnpm start` | Sert le build de production |
| `pnpm test` | Suite de tests (63 tests) |
| `pnpm test:watch` | Tests en continu |
| `pnpm typecheck` | Vérification des types, sans build |
| `pnpm lint` | ESLint |
| `pnpm check:content` | Liste ce qui reste à renseigner dans `content/` |

---

## 2. Variables d'environnement

Tout est décrit dans `.env.example`, à copier en `.env.local`. Les indispensables :

| Variable | Rôle | Sans elle |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL publique, sans barre finale | Les liens des emails pointent vers l'URL par défaut |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASS` | Envoi d'emails | Les formulaires **refusent** l'envoi et l'affichent clairement |
| `SMTP_FROM` | Adresse d'expédition | Retombe sur `SMTP_USER` |
| `CONTACT_NOTIFY_TO` | Boîte interne qui reçoit les demandes | Retombe sur l'adresse historique |
| `CRON_SECRET` | Protège la route des rappels | La route répond 503, aucun rappel n'est envoyé |
| `DATABASE_URL` | Base PostgreSQL (inscriptions, rendez-vous) | Le stockage refuse de démarrer |

En développement, mettre `NEXT_PUBLIC_SITE_URL=http://localhost:3000` : sinon les
liens de confirmation reçus par email pointent vers la production.

**Sur Gmail** : `SMTP_PASS` est un *mot de passe d'application*, pas le mot de
passe du compte. Et Gmail réécrit l'expéditeur si `SMTP_FROM` n'est ni le compte
authentifié ni un alias vérifié dans « Envoyer des emails en tant que ». Si vous
voulez que les messages partent de `contact@nexpit.fr`, il faut d'abord déclarer
cet alias côté Gmail, sinon les destinataires verront l'adresse Gmail.

---

## 3. Modifier le contenu

**Aucun texte visible ne vit dans un composant.** Tout est dans `content/`, et
chaque chaîne porte ses deux langues côte à côte, ce qui rend une traduction
manquante impossible à oublier : c'est une erreur de compilation.

| Fichier | Contient |
|---|---|
| `content/site.ts` | Nom, accroche, adresses email, réseaux sociaux, **identité légale**, menus |
| `content/pages.ts` | Accueil, expertise, projets, à propos, contact, rendez-vous, lettre d'information |
| `content/projects.ts` | Les six études de cas : problème, réalisations, décisions, métriques, schémas |
| `content/expertise.ts` | Les trois domaines et leurs livrables |
| `content/legal.ts` | Mentions légales et politique de confidentialité |
| `content/ui.ts` | Boutons, états, messages d'erreur, libellés de champs |
| `content/emails.ts` | Toutes les formulations des emails envoyés |
| `content/availability.ts` | Horaires de rendez-vous |
| `content/telemetry.ts` | Le tour de télémétrie affiché en page d'accueil (généré, voir §5) |
| `content/types.ts` | Les types de tout ce qui précède |

Exemple — changer le titre de la page d'accueil :

```ts
// content/pages.ts
export const home = {
  title: {
    fr: "Du capteur à l'écran",
    en: "From sensor to screen",
  },
  // …
};
```

Ajouter un projet : ajouter une entrée dans le tableau `projects` de
`content/projects.ts`. La page `/projets/<slug>`, l'entrée du sitemap et les
liens croisés apparaissent tout seuls.

---

## 4. Ce qui reste à compléter

Le site n'invente aucune donnée. Ce que NexPit n'a pas fourni vaut `PENDING`
dans `content/`, et la section correspondante **ne s'affiche pas** en production
plutôt que d'afficher un texte plausible.

```bash
pnpm check:content            # liste tout
pnpm check:content --strict   # sort en erreur s'il manque des champs légaux
```

En développement, ces manques apparaissent aussi à l'écran, dans un encadré
jaune. En production, ils sont silencieux — sauf sur les mentions légales, où
l'absence est signalée en rouge, parce qu'un site accessible au public sans
identification de l'éditeur est sanctionné par l'article 6-III de la LCEN.

---

## 5. Architecture

```
app/
  [locale]/                 toutes les pages, sous /fr ou /en
    layout.tsx              layout racine : porte <html lang>, en-tête, pied de page
    page.tsx                accueil
    expertise/              les trois domaines
    projets/                index + une page par projet
    a-propos/  contact/  rendez-vous/  newsletter/
    mentions-legales/  confidentialite/
    error.tsx  not-found.tsx
  api/
    newsletter/confirm/     deuxième temps du double opt-in
    newsletter/unsubscribe/ désinscription (GET clic, POST RFC 8058)
    cron/reminders/         rappels de rendez-vous
    og/                     images Open Graph générées
  sitemap.ts  robots.ts  global-error.tsx  not-found.tsx
components/                 rendu ; aucun texte en dur
content/                    tout le texte, typé et bilingue
lib/
  actions/                  actions serveur des formulaires
  booking.ts                moteur de créneaux
  time.ts                   conversions de fuseau, sans dépendance
  ics.ts                    invitations calendrier (RFC 5545)
  mail.ts                   transport SMTP et gabarit d'email
  store.ts                  persistance
  validation.ts             schémas Zod, messages traduits
  rate-limit.ts  tokens.ts  seo.ts  i18n.ts
tests/                      63 tests
scripts/check-content.mjs
```

**Server Components par défaut.** Sept fichiers seulement sont clients, et pour
une raison précise à chaque fois : `site-header` (menu sous 1024 px et page
courante), `contact-form`, `newsletter-form`, `booking-widget` (fuseau du
visiteur), `cancel-booking-form`, `consent-banner`, et `form-bits` qui regroupe
leurs champs communs. La page d'accueil, les pages projet et les pages légales
n'embarquent aucun JavaScript applicatif au-delà du routeur.

**URLs.** Les segments sont identiques dans les deux langues (`/fr/projets` et
`/en/projets`). C'est un choix : NexPit est une structure française, la version
anglaise est une traduction, et dupliquer l'arborescence pour traduire des slugs
coûterait plus en maintenance que le gain en référencement. Pour changer d'avis,
tout passe par `lib/i18n.ts`.

**Le tracé de la page d'accueil** n'est pas une décoration : c'est la vitesse
relevée sur le dixième tour d'une session Pitlabs du 11 décembre 2025 (Red Bull
Ring, Lotus Exos 125, 1:22.130). Les valeurs sont figées dans
`content/telemetry.ts`, extraites de `~/NexPit/Pitlabs/data/*.csv`. Le rendu est
entièrement serveur ; la seule animation du site est le tracé initial du trait,
en CSS, désactivée si le visiteur a demandé moins de mouvement.

---

## 6. Prise de rendez-vous

### Pourquoi pas Cal.com

Le comparatif, fait avant d'écrire une ligne :

| | Cal.com hébergé | Cal.com auto-hébergé | Implémentation maison |
|---|---|---|---|
| Coût | Gratuit à 1 utilisateur, ~13 €/mois au-delà | 0 € de licence | 0 € |
| Mise en route | Une heure | Une à deux journées (base, Docker, migrations) | — |
| Ce qu'il faut maintenir | Rien | Une base, un conteneur, les mises à jour | ~400 lignes |
| Charte graphique | Iframe ou redirection, look Cal.com | Personnalisable au prix d'un fork | Native |
| RGPD | Sous-traitant supplémentaire à déclarer | Aucun | Aucun |
| Synchronisation d'agenda | Oui, bidirectionnelle | Oui | Non |

**Retenu : implémentation maison**, pour trois raisons. La contrainte était
« tout gratuit », ce qui excluait le palier payant de Cal.com. L'auto-hébergement
coûte plus cher en temps de maintenance que les 400 lignes du moteur de créneaux,
pour un volume de quelques rendez-vous par semaine. Et un iframe Cal.com au
milieu d'un site dont toute la valeur est le soin apporté à la mise en page
aurait annulé une partie du travail.

**Ce qu'on perd, honnêtement** : la synchronisation bidirectionnelle avec un
agenda Google. Le site sait quels créneaux il a lui-même attribués, pas ce que
vous avez posé à la main dans votre agenda. Deux parades : bloquer un jour dans
`content/availability.ts` (`blackout`), ou passer plus tard à Cal.com — le module
est isolé dans `lib/booking.ts` et `components/booking-widget.tsx`.

### Configurer les horaires

```ts
// content/availability.ts
export const availability = {
  timezone: "Europe/Paris",   // fuseau de référence des plages ci-dessous
  durationMin: 30,            // durée d'un rendez-vous
  stepMin: 30,                // écart entre deux départs
  leadTimeHours: 24,          // délai minimum avant un rendez-vous
  horizonDays: 14,            // profondeur de réservation
  weekly: {
    1: [["09:30", "12:00"], ["14:00", "17:30"]],   // lundi
    // 0 = dimanche … 6 = samedi ; [] = fermé
  },
  blackout: ["2026-12-24"],   // jours entièrement fermés
};
```

Les heures s'écrivent en heure locale de NexPit. Le moteur convertit dans le
fuseau du visiteur, changements d'heure compris — c'est ce que vérifie
`tests/booking.test.ts`, autour des bascules de mars et d'octobre.

### Ce que fait le parcours

Réservation → email de confirmation avec `.ics` joint + notification interne →
rappel la veille → lien d'annulation et de report valable jusqu'au rendez-vous.
L'annulation renvoie un `.ics` `METHOD:CANCEL`, qui retire l'événement de
l'agenda du visiteur.

Le lien de gestion porte un jeton de 192 bits ; il remplace un compte
utilisateur. Ces pages ne sont jamais indexées.

**Double réservation** : la vérification de disponibilité et l'écriture ont lieu
dans la même opération sérialisée. Deux visiteurs qui valident le même créneau à
la même seconde ne peuvent pas réserver tous les deux.

---

## 7. Emails

Transport SMTP via nodemailer, repris du site précédent plutôt que remplacé par
un service tiers : les identifiants existent, l'envoi fonctionne, et un relais
SMTP ne coûte rien de plus que ce qui est déjà payé. L'ajout est une vérification
de configuration au démarrage, pour qu'une variable absente se voie dans les
journaux plutôt qu'à la première tentative.

Les formulations sont dans `content/emails.ts`, l'assemblage dans `lib/mail.ts`
et `lib/booking-mail.ts`. Chaque message part en texte **et** en HTML, construits
d'un seul appel pour qu'ils ne divergent jamais.

Messages envoyés : accusé de réception de contact, notification interne de
contact, demande de confirmation d'inscription, bienvenue avec lien de
désinscription, confirmation de rendez-vous, report, annulation, rappel,
notification interne de rendez-vous.

**Protection anti-spam** : pot de miel invisible et hors du parcours clavier,
plus une limitation de débit par empreinte d'IP (5 envois / 15 min sur le
contact et la lettre d'information, 8 / heure sur les rendez-vous). Aucun
captcha. L'adresse IP n'est jamais stockée : seul un condensé salé l'est, et le
sel change à chaque redémarrage.

---

## 8. Stockage

Un fichier JSON, écrit de façon atomique (écriture dans un temporaire puis
`rename`), avec une file d'attente en mémoire qui sérialise les opérations.

C'est un choix assumé : le site enregistre des inscriptions et des rendez-vous,
soit quelques écritures par semaine. Une base relationnelle ajouterait une
dépendance native à la chaîne de déploiement pour un volume qui tient dans
quelques kilo-octets.

Le document vit dans une ligne `jsonb` d'une table `store`, créée au premier
accès. Chaque écriture prend un verrou consultatif transactionnel
(`pg_advisory_xact_lock`) avant de lire : entre la lecture et la réécriture,
aucune autre instance ne peut s'intercaler. C'est ce qui permet de vérifier une
disponibilité et d'écrire dans le même souffle — deux visiteurs qui valident le
même créneau ne peuvent pas réserver tous les deux.

Le verrou étant tenu par le serveur de base et non par le processus, **le site
peut tourner en plusieurs instances**, ce qu'impose un hébergement en fonctions.

Préférer l'adresse groupée (« pooled ») fournie par l'hébergeur : le verrou est
transactionnel, donc compatible avec un pooler en mode transaction.

Sauvegarde : celle de la base. `SELECT data FROM store;` suffit à tout exporter.

---

## 9. Rappels automatiques

Le rappel de la veille est déclenché par un appel externe, pas par une minuterie
interne — un `setInterval` dans un processus Next disparaît au redémarrage sans
que personne ne le remarque.

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://www.nexpit.fr/api/cron/reminders
```

Toutes les heures suffit. La route est idempotente : un rendez-vous déjà rappelé
n'est pas repris, l'appeler dix fois n'envoie pas dix emails. Si l'envoi échoue,
le rappel est rouvert pour la passe suivante.

Quatre façons de la brancher, toutes gratuites :

- **le cron Vercel**, déclaré dans `vercel.json` (voir ci-dessous)
- **cron système** sur le serveur : `0 * * * * curl -sS -H "Authorization: Bearer …" …`
- **le planificateur de l'hébergeur** (Coolify, Dokploy et Railway en ont un)
- **un service de cron gratuit** type cron-job.org, si le serveur n'a pas de cron

Sans `CRON_SECRET`, la route répond 503 et le signale dans les journaux.

### Sur Vercel

`vercel.json` déclare une passe quotidienne à 8 h UTC. L'en-tête `Authorization`
attendu par la route est ajouté automatiquement à partir de `CRON_SECRET`, il n'y
a rien à écrire.

Une passe par jour suffit, et ce n'est pas un compromis : la fenêtre d'envoi de
la route va de 6 h à 30 h avant le rendez-vous, soit **24 h de large**, c'est-à-dire
exactement la période du cron. Les fenêtres des passes successives pavent donc la
ligne du temps sans trou ni recouvrement, et chaque rendez-vous tombe dans une
et une seule d'entre elles. La contrepartie est la précision : le rappel part
entre 6 et 30 h à l'avance selon l'heure du créneau, au lieu d'environ 24 h.

Le plan Hobby **refuse** une expression plus fréquente — le déploiement échoue,
il ne dégrade pas silencieusement. Pour resserrer le délai, passer à `0 * * * *`
demande un plan Pro.

---

## 10. Mesure d'audience et RGPD

Par défaut, **aucun traceur**. Le bandeau ne charge un script qu'après
acceptation explicite, et « Refuser » a exactement la même taille et la même
place qu'« Accepter ». Le choix est gardé six mois dans `localStorage`, jamais
dans un cookie, et n'est jamais envoyé au serveur.

Pour activer une mesure d'audience, renseigner `NEXT_PUBLIC_ANALYTICS_SRC` et
`NEXT_PUBLIC_ANALYTICS_SITE_ID`. Le composant pose les attributs attendus par
Umami (`data-website-id`) et par Plausible (`data-domain`) ; chacun ignore celui
qui ne le concerne pas. Les deux s'auto-hébergent gratuitement.

Vercel Analytics a été retiré : il ne fonctionne que sur Vercel, et le
`nixpacks.toml` de ce dépôt indique un hébergement autonome.

La politique de confidentialité décrit les traitements qui existent réellement
dans le code. **Si vous ajoutez un traitement, ajoutez-le dans
`content/legal.ts`** : c'est la seule façon que cette page reste vraie.

---

## 11. Polices

Archivo (display et texte) et Martian Mono (données et étiquettes), toutes deux
sous licence SIL Open Font, auto-hébergées dans `public/fonts/`.

Les fichiers d'origine ont été réinstanciés sur les seuls axes utilisés : Archivo
de `wght 100-900 / wdth 62-125` vers `400-700 / 100-125`, Martian Mono de
`wght 100-800 / wdth 75-112,5` vers `400-600 / wdth figé à 87,5`. Le jeu latin
passe ainsi de 128 à 72 Ko, sans changer une règle CSS.

Les fichiers d'origine sont conservés dans `assets/fonts/_original/`,
hors de `public/` pour ne pas être servis inutilement. Pour
refaire l'opération après une mise à jour de police :

```python
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

font = TTFont("assets/fonts/_original/archivo-latin.woff2")
instancer.instantiateVariableFont(font, {"wght": (400, 700), "wdth": (100, 125)}, inplace=True)
font.flavor = "woff2"
font.save("public/fonts/archivo-latin.woff2")
```

Seul le sous-ensemble `latin` est préchargé : il couvre l'intégralité du français
et de l'anglais. `latin-ext` ne se télécharge que si un caractère l'exige.

---

## 12. Tests et vérifications

```bash
pnpm test
```

63 tests, là où une erreur coûterait cher :

- `tests/time.test.ts` — conversions de fuseau, changements d'heure de mars et
  d'octobre, fuseaux à décalage non entier, allers-retours sur douze mois
- `tests/booking.test.ts` — génération de créneaux, week-ends, délai de
  prévenance, jours fermés, créneaux pris, validation serveur
- `tests/validation.test.ts` — schémas des trois formulaires, messages traduits,
  pot de miel
- `tests/ics.test.ts` — pliage à 75 octets sans couper un caractère accentué,
  échappement, CRLF, annulation

Mesures relevées sur le build de production, en local :

| | Perf | A11y | Bonnes pratiques | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| Desktop | 100 | 100 | 100 | 100 | 0,6 s | 0 |
| Mobile | 96–98 | 100 | 100 | 100 | 2,4–2,8 s | 0 |

Le LCP mobile est mesuré sous le bridage simulé de Lighthouse (1,6 Mbit/s,
processeur ralenti 4×), pas sur un vrai téléphone en 4G. La cible « LCP sous
1,5 s » est tenue en desktop ; sous ce profil mobile synthétique elle ne l'est
pas, et c'est le seul objectif chiffré du cahier des charges qui ne le soit pas.

Poids d'une page, en gzip : 199 Ko de JavaScript, 20 Ko de CSS, 71 Ko de
polices. Le JavaScript est presque intégralement le socle React 19 et le
routeur Next : le code applicatif de la page d'accueil tient en 13 Ko, et les
pages projet comme les pages légales n'embarquent aucun composant client.
`next start` ne sert qu'en gzip ; derrière un reverse proxy avec brotli, compter
environ 170 Ko.

axe-core ne relève aucune violation WCAG 2.1 AA sur onze pages en 390 px et
1440 px. Aucun débordement horizontal de 360 à 2560 px.

---

## 13. Déploiement

Le dépôt est prévu pour un hébergement autonome : `nixpacks.toml` décrit
l'installation, le build et le démarrage.

**Avant la première mise en ligne :**

1. `pnpm check:content --strict` doit passer — sinon les mentions légales sont
   incomplètes, ce qui est une infraction, pas un détail cosmétique.
2. Renseigner toutes les variables de `.env.example` côté hébergeur.
3. Provisionner la base et renseigner `DATABASE_URL`.
4. Brancher la route des rappels (section 9).
5. Vérifier que `NEXT_PUBLIC_SITE_URL` vaut bien l'URL publique : les liens de
   confirmation et d'annulation en dépendent.

Pour afficher le repère de révision dans le cartouche du pied de page :

```bash
NEXT_PUBLIC_BUILD_REV=$(git rev-parse --short HEAD) pnpm build
```

**Sur une plateforme en fonctions sans état** (Vercel et assimilés), la
planification des rappels passe par le cron de l'hébergeur : `vercel.json`
déclare l'appel horaire à `/api/cron/reminders`, et l'en-tête `Authorization`
attendu par la route est ajouté automatiquement à partir de `CRON_SECRET`.
