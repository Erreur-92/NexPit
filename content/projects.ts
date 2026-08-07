import { PENDING, type Project } from "./types";

/**
 * Les six études de cas.
 *
 * Règle appliquée à chaque ligne : tout ce qui est affirmé ici est vérifiable
 * dans le dépôt du projet concerné. Les métriques portent leur source. Aucune
 * capture d'écran n'est publiée — les projets sont internes — donc chaque page
 * porte à la place un schéma d'architecture dessiné à partir du code réel.
 *
 * `stage` vaut « prototype » partout : c'est le plancher honnête tant que
 * NexPit n'a pas confirmé lesquels tournent en production chez un tiers.
 */

export const projects: readonly Project[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: "carwatch",
    name: "CarWatch",
    index: "P.01",
    stage: "prototype",
    summary: {
      fr: "Cartographie des garages et stations-service, avec calcul d'itinéraire et de coût de carburant à partir des caractéristiques réelles du véhicule.",
      en: "Mapping of garages and fuel stations, with routing and fuel-cost estimation based on the vehicle's actual characteristics.",
    },
    period: { fr: "Mars – avril 2026", en: "March – April 2026" },
    role: {
      fr: "Conception du schéma de données, API TypeScript, interface cartographique.",
      en: "Data schema design, TypeScript API, mapping interface.",
    },
    problem: {
      fr: "Un automobiliste qui cherche du carburant ne veut pas le prix au litre le plus bas : il veut le coût total le plus bas, trajet compris. Cela suppose de connaître sa consommation, son carburant et sa position, puis de croiser ces trois données avec un réseau routier et des prix qui bougent tous les jours.",
      en: "A driver looking for fuel does not want the lowest price per litre: they want the lowest total cost, detour included. That requires knowing their consumption, their fuel type and their position, then crossing those three against a road network and prices that change daily.",
    },
    built: {
      fr: [
        "Une carte Leaflet avec couches séparées pour les stations, les garages, l'itinéraire calculé et la position du véhicule de l'utilisateur.",
        "Une API Express en TypeScript strict découpée en routes, services et middlewares, avec gestion d'erreur centralisée et route de santé.",
        "Un schéma PostgreSQL qui décrit le véhicule de l'utilisateur : plaque, carburant, puissance, consommation aux 100, marque, modèle.",
        "Une recherche par plaque d'immatriculation qui préremplit ces champs.",
        "Un espace compte, une liste de carburants suivis et une carte météo attachée à la position courante.",
      ],
      en: [
        "A Leaflet map with separate layers for stations, garages, the computed route and the user's vehicle position.",
        "An Express API in strict TypeScript split into routes, services and middlewares, with centralised error handling and a health route.",
        "A PostgreSQL schema describing the user's vehicle: plate, fuel, power, consumption per 100 km, make, model.",
        "A licence-plate lookup that pre-fills those fields.",
        "An account area, a watched-fuel list and a weather card tied to the current position.",
      ],
    },
    decisions: [
      {
        title: {
          fr: "Les règles métier vivent dans la base, pas seulement dans le code",
          en: "Business rules live in the database, not only in the code",
        },
        body: {
          fr: "Le type de carburant est un enum PostgreSQL, la plaque est validée par une expression régulière côté base, la puissance et la consommation portent des contraintes CHECK. Une API mal écrite, un script d'import ou une insertion manuelle ne peuvent pas produire un véhicule à 4 000 chevaux consommant 800 litres aux 100. La base reste cohérente même quand le code au-dessus ne l'est pas.",
          en: "Fuel type is a PostgreSQL enum, the plate is validated by a regular expression at the database level, power and consumption carry CHECK constraints. A badly written API, an import script or a manual insert cannot produce a 4,000 hp vehicle burning 800 litres per 100 km. The database stays consistent even when the code above it is not.",
        },
      },
      {
        title: {
          fr: "Migrations datées dès le premier jour",
          en: "Dated migrations from day one",
        },
        body: {
          fr: "Le schéma initial et la migration d'ajout des champs d'authentification et de véhicule sont deux fichiers distincts, le second préfixé par sa date. Rejouer l'historique sur une base vierge donne exactement l'état courant. C'est ce qui rend une reprise de projet possible sans dump de production.",
          en: "The initial schema and the migration adding authentication and vehicle fields are two separate files, the second prefixed with its date. Replaying the history on an empty database yields exactly the current state. That is what makes picking the project back up possible without a production dump.",
        },
      },
      {
        title: {
          fr: "Leaflet plutôt qu'une carte propriétaire",
          en: "Leaflet rather than a proprietary map",
        },
        body: {
          fr: "Pas de clé d'API, pas de facturation à la vue de carte, pas de dépendance à la politique tarifaire d'un fournisseur. Les couches d'itinéraire et de marqueurs sont écrites à la main, ce qui coûte davantage de code au départ mais rend le rendu entièrement contrôlable.",
          en: "No API key, no per-map-view billing, no dependency on a vendor's pricing policy. The route and marker layers are hand-written, which costs more code up front but makes the rendering fully controllable.",
        },
      },
    ],
    stack: [
      "TypeScript",
      "Express",
      "PostgreSQL",
      "React",
      "Vite",
      "Leaflet",
      "react-leaflet",
      "React Router",
    ],
    metrics: [
      {
        value: "64",
        label: { fr: "commits", en: "commits" },
        source: {
          fr: "dépôt git du projet, du 3 mars au 5 avril 2026",
          en: "project git repository, 3 March to 5 April 2026",
        },
      },
      {
        value: "6",
        label: { fr: "carburants typés en base", en: "fuel types typed in the database" },
        source: {
          fr: "enum fuel_type_enum : SP95, SP98, E10, E85, Gazole, GPL",
          en: "fuel_type_enum: SP95, SP98, E10, E85, Diesel, LPG",
        },
      },
      {
        value: "4",
        label: { fr: "couches cartographiques", en: "map layers" },
        source: {
          fr: "stations, garages, itinéraire, véhicule utilisateur",
          en: "stations, garages, route, user vehicle",
        },
      },
    ],
    diagram: {
      caption: {
        fr: "Chemin d'une requête, de la plaque saisie à la carte affichée.",
        en: "Path of a request, from the entered plate to the rendered map.",
      },
      nodes: [
        { id: "plate", label: { fr: "Plaque saisie", en: "Plate entered" }, sub: { fr: "AA-123-BB", en: "AA-123-BB" }, col: 0, row: 0, kind: "source" },
        { id: "geo", label: { fr: "Position", en: "Position" }, sub: { fr: "navigator.geolocation", en: "navigator.geolocation" }, col: 0, row: 1, kind: "source" },
        { id: "prices", label: { fr: "Prix carburant", en: "Fuel prices" }, sub: { fr: "flux externe", en: "external feed" }, col: 0, row: 2, kind: "source" },
        { id: "api", label: { fr: "API Express", en: "Express API" }, sub: { fr: "routes / services", en: "routes / services" }, col: 1, row: 0, kind: "process" },
        { id: "cost", label: { fr: "Coût trajet", en: "Trip cost" }, sub: { fr: "conso × distance × prix", en: "usage × distance × price" }, col: 1, row: 2, kind: "process" },
        { id: "pg", label: { fr: "PostgreSQL", en: "PostgreSQL" }, sub: { fr: "enum + CHECK", en: "enum + CHECK" }, col: 1, row: 1, kind: "store" },
        { id: "map", label: { fr: "Carte Leaflet", en: "Leaflet map" }, sub: { fr: "4 couches", en: "4 layers" }, col: 2, row: 1, kind: "surface" },
      ],
      edges: [
        { from: "plate", to: "api" },
        { from: "geo", to: "api" },
        { from: "prices", to: "cost" },
        { from: "api", to: "pg", label: { fr: "véhicule", en: "vehicle" } },
        { from: "pg", to: "cost", label: { fr: "l/100", en: "l/100 km" } },
        { from: "api", to: "map" },
        { from: "cost", to: "map" },
      ],
    },
    demonstrates: {
      fr: "Modélisation de données véhicule, contraintes d'intégrité, API typée, rendu cartographique sans dépendance propriétaire.",
      en: "Vehicle data modelling, integrity constraints, typed API, map rendering with no proprietary dependency.",
    },
    link: PENDING,
    expertiseKeys: ["applications"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "raceshare",
    name: "RaceShare",
    index: "P.02",
    stage: "prototype",
    summary: {
      fr: "Plateforme de mise en relation entre pilotes, sponsors et professionnels du sport automobile : annonces, profils, messagerie temps réel.",
      en: "Matchmaking platform between drivers, sponsors and motorsport professionals: listings, profiles, real-time messaging.",
    },
    period: { fr: "Août 2025 – juin 2026", en: "August 2025 – June 2026" },
    role: {
      fr: "Architecture complète, backend, base de données, interface.",
      en: "Full architecture, backend, database, interface.",
    },
    problem: {
      fr: "Un pilote cherchant un budget et un sponsor cherchant une visibilité ne se rencontrent aujourd'hui que par relations personnelles. Le problème n'est pas d'afficher des annonces : c'est de rendre le premier contact possible sans exposer les coordonnées de tout le monde à tout le monde.",
      en: "A driver looking for a budget and a sponsor looking for exposure currently only meet through personal connections. The problem is not displaying listings: it is making first contact possible without exposing everyone's details to everyone.",
    },
    built: {
      fr: [
        "Trois rôles distincts — administrateur, pilote, sponsor — avec des vues et des droits séparés.",
        "Une messagerie temps réel sur socket.io, avec un mécanisme de demande de contact : on ne peut pas écrire à quelqu'un tant qu'il n'a pas accepté.",
        "Un système d'annonces avec tags, permettant de filtrer par discipline, catégorie et besoin.",
        "Un gestionnaire de photos qui redimensionne à l'envoi plutôt qu'à l'affichage.",
        "Des profils publics, un annuaire de contacts et un fil de publications.",
      ],
      en: [
        "Three distinct roles — administrator, driver, sponsor — with separate views and permissions.",
        "Real-time messaging on socket.io, with a contact-request mechanism: you cannot write to someone until they have accepted.",
        "A tagged listings system, allowing filtering by discipline, category and need.",
        "A photo manager that resizes on upload rather than on display.",
        "Public profiles, a contact directory and a posts feed.",
      ],
    },
    decisions: [
      {
        title: {
          fr: "La demande de contact avant la messagerie",
          en: "Contact request before messaging",
        },
        body: {
          fr: "Une plateforme où un sponsor reçoit trente messages non sollicités par jour meurt en trois semaines. Les conversations ne s'ouvrent qu'après acceptation explicite, et les demandes en attente vivent dans une file séparée. C'est une contrainte produit avant d'être une contrainte technique, et elle a dicté le modèle de données.",
          en: "A platform where a sponsor receives thirty unsolicited messages a day dies in three weeks. Conversations only open after explicit acceptance, and pending requests live in a separate queue. That is a product constraint before being a technical one, and it drove the data model.",
        },
      },
      {
        title: {
          fr: "Redimensionnement à l'envoi",
          en: "Resizing on upload",
        },
        body: {
          fr: "Les photos passent par sharp au moment du dépôt et sont stockées à la taille servie. Le serveur ne refait jamais le travail à chaque affichage, et une photo de 8 Mo sortie d'un téléphone ne devient jamais 8 Mo de bande passante pour chaque visiteur.",
          en: "Photos go through sharp at upload time and are stored at the size they are served. The server never redoes the work on each display, and an 8 MB phone photo never becomes 8 MB of bandwidth for every visitor.",
        },
      },
      {
        title: {
          fr: "Limitation de débit et en-têtes de sécurité dès le départ",
          en: "Rate limiting and security headers from the start",
        },
        body: {
          fr: "express-rate-limit sur les routes d'authentification et helmet sur l'ensemble de l'application. Sur un site où l'on peut créer un compte, une route de connexion sans limitation est une invitation au bourrage d'identifiants. C'est une ligne de code au premier jour et une reprise complète au six-centième.",
          en: "express-rate-limit on the authentication routes and helmet across the whole application. On a site where accounts can be created, a login route without limiting is an invitation to credential stuffing. It is one line of code on day one and a full rework on day six hundred.",
        },
      },
    ],
    stack: [
      "React 19",
      "Express 5",
      "PostgreSQL",
      "socket.io",
      "JWT",
      "bcrypt",
      "helmet",
      "sharp",
      "multer",
    ],
    metrics: [
      {
        value: "6",
        label: { fr: "services backend", en: "backend services" },
        source: {
          fr: "auth, annonces, contacts, messages, photos, publications",
          en: "auth, listings, contacts, messages, photos, posts",
        },
      },
      {
        value: "3",
        label: { fr: "rôles cloisonnés", en: "separated roles" },
        source: {
          fr: "administrateur, pilote, sponsor",
          en: "administrator, driver, sponsor",
        },
      },
      {
        value: "10",
        label: { fr: "mois de développement", en: "months of development" },
        source: {
          fr: "premier au dernier commit, août 2025 – juin 2026",
          en: "first to last commit, August 2025 – June 2026",
        },
      },
    ],
    diagram: {
      caption: {
        fr: "Cloisonnement des échanges : rien ne passe entre deux comptes sans acceptation.",
        en: "Exchange partitioning: nothing passes between two accounts without acceptance.",
      },
      nodes: [
        { id: "driver", label: { fr: "Pilote", en: "Driver" }, sub: { fr: "compte", en: "account" }, col: 0, row: 0, kind: "source" },
        { id: "sponsor", label: { fr: "Sponsor", en: "Sponsor" }, sub: { fr: "compte", en: "account" }, col: 0, row: 2, kind: "source" },
        { id: "req", label: { fr: "Demande", en: "Request" }, sub: { fr: "file d'attente", en: "queue" }, col: 1, row: 1, kind: "process" },
        { id: "auth", label: { fr: "JWT + bcrypt", en: "JWT + bcrypt" }, sub: { fr: "rôles", en: "roles" }, col: 1, row: 0, kind: "process" },
        { id: "db", label: { fr: "PostgreSQL", en: "PostgreSQL" }, sub: { fr: "annonces / tags", en: "listings / tags" }, col: 1, row: 2, kind: "store" },
        { id: "ws", label: { fr: "socket.io", en: "socket.io" }, sub: { fr: "conversation ouverte", en: "open conversation" }, col: 2, row: 1, kind: "surface" },
      ],
      edges: [
        { from: "driver", to: "auth" },
        { from: "sponsor", to: "auth" },
        { from: "auth", to: "req" },
        { from: "req", to: "db" },
        { from: "req", to: "ws", label: { fr: "si accepté", en: "if accepted" } },
        { from: "db", to: "ws" },
      ],
    },
    demonstrates: {
      fr: "Authentification multi-rôles, temps réel, modération des échanges, traitement d'images côté serveur.",
      en: "Multi-role authentication, real time, exchange moderation, server-side image processing.",
    },
    link: PENDING,
    expertiseKeys: ["applications"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "pitlabs",
    name: "Pitlabs",
    index: "P.03",
    stage: "prototype",
    summary: {
      fr: "Chaîne de télémétrie sim-racing et piste : captation des canaux du simulateur, découpage en tours, analyse de freinage, comparaison de trajectoires.",
      en: "Sim-racing and track telemetry chain: capturing simulator channels, splitting into laps, braking analysis, trajectory comparison.",
    },
    period: { fr: "Décembre 2025", en: "December 2025" },
    role: {
      fr: "Captation, format de stockage, moteur d'analyse, interface.",
      en: "Capture, storage format, analysis engine, interface.",
    },
    problem: {
      fr: "Un pilote qui perd trois dixièmes ne sait pas où il les perd. Le simulateur expose l'intégralité de l'état physique de la voiture à chaque image, mais sous forme d'un flux brut sans notion de tour, de secteur ni de comparaison. Toute l'utilité est dans ce qu'on fait après la captation.",
      en: "A driver losing three tenths does not know where they are losing them. The simulator exposes the car's entire physical state on every frame, but as a raw stream with no notion of lap, sector or comparison. All the value is in what happens after capture.",
    },
    built: {
      fr: [
        "Un récepteur qui lit la mémoire partagée du simulateur et écrit trois flux distincts : physique, affichage et données de session.",
        "Un découpage en tours à partir de la position normalisée sur le circuit, ce qui donne un axe en distance et non en temps — deux tours de durées différentes deviennent comparables point à point.",
        "Une interface d'analyse : carte du circuit, superposition de tours, analyse de freinage, passage en courbe, gestion du carburant, forces g.",
        "Un export de session pour rejouer une analyse hors ligne.",
      ],
      en: [
        "A receiver reading the simulator's shared memory and writing three separate streams: physics, graphics and session data.",
        "Lap splitting from normalised track position, which gives a distance axis rather than a time axis — two laps of different durations become comparable point by point.",
        "An analysis interface: track map, lap overlay, braking analysis, cornering, fuel management, g-forces.",
        "A session export to replay an analysis offline.",
      ],
    },
    decisions: [
      {
        title: {
          fr: "Trois fichiers plutôt qu'un",
          en: "Three files rather than one",
        },
        body: {
          fr: "Les canaux physiques changent à chaque image, les données de session ne changent jamais, l'état d'affichage change à un rythme intermédiaire. Les écrire ensemble reviendrait à répéter le nom du circuit quarante-quatre mille fois. Séparés et joints sur l'horodatage, ils restent lisibles à l'œil nu et diffables.",
          en: "Physics channels change every frame, session data never changes, graphics state changes at an intermediate rate. Writing them together would mean repeating the track name forty-four thousand times. Split and joined on the timestamp, they stay human-readable and diffable.",
        },
      },
      {
        title: {
          fr: "La distance comme axe de référence, pas le temps",
          en: "Distance as the reference axis, not time",
        },
        body: {
          fr: "Superposer deux tours sur un axe temporel ne dit rien : le tour lent est simplement plus long. En rééchantillonnant sur la position normalisée du circuit, un point du tracé correspond au même endroit de la piste dans les deux tours. C'est la seule façon de voir qu'on freine quinze mètres trop tôt.",
          en: "Overlaying two laps on a time axis says nothing: the slow lap is simply longer. By resampling on normalised track position, a point on the trace corresponds to the same place on track in both laps. It is the only way to see that you are braking fifteen metres too early.",
        },
      },
      {
        title: {
          fr: "Du CSV, délibérément",
          en: "CSV, deliberately",
        },
        body: {
          fr: "Un format binaire aurait été plus compact. Le CSV se lit dans un tableur, se coupe avec head, se recharge dans pandas dix ans plus tard sans le logiciel qui l'a produit. Pour de la donnée d'analyse qu'on relit rarement mais longtemps, la longévité prime sur la taille.",
          en: "A binary format would have been more compact. CSV opens in a spreadsheet, can be cut with head, and reloads into pandas ten years later without the software that produced it. For analysis data read rarely but for a long time, longevity beats size.",
        },
      },
    ],
    stack: ["Python", "pandas", "Tkinter", "matplotlib", { fr: "mémoire partagée", en: "shared memory" }, "CSV"],
    metrics: [
      {
        value: "44 728",
        label: { fr: "échantillons captés en une session", en: "samples captured in one session" },
        source: {
          fr: "session du 11 décembre 2025, Red Bull Ring, Lotus Exos 125",
          en: "session of 11 December 2025, Red Bull Ring, Lotus Exos 125",
        },
      },
      {
        value: "≈ 39 Hz",
        label: { fr: "fréquence de relevé", en: "sampling rate" },
        source: {
          fr: "3 203 points relevés sur un tour de 1:22.130",
          en: "3,203 points recorded over a 1:22.130 lap",
        },
      },
      {
        value: "14",
        label: { fr: "tours exploitables", en: "usable laps" },
        source: {
          fr: "découpage par position normalisée sur la même session",
          en: "split by normalised position over the same session",
        },
      },
    ],
    diagram: {
      caption: {
        fr: "De la mémoire partagée du simulateur à la superposition de deux tours.",
        en: "From the simulator's shared memory to a two-lap overlay.",
      },
      nodes: [
        { id: "sim", label: { fr: "Simulateur", en: "Simulator" }, sub: { fr: "mémoire partagée", en: "shared memory" }, col: 0, row: 1, kind: "source" },
        { id: "recv", label: { fr: "Récepteur", en: "Receiver" }, sub: { fr: "boucle de lecture", en: "read loop" }, col: 1, row: 1, kind: "process" },
        { id: "phys", label: { fr: "physics.csv", en: "physics.csv" }, sub: { fr: "par image", en: "per frame" }, col: 1, row: 0, kind: "store" },
        { id: "graph", label: { fr: "graphics.csv", en: "graphics.csv" }, sub: { fr: "tours, secteurs", en: "laps, sectors" }, col: 1, row: 2, kind: "store" },
        { id: "split", label: { fr: "Découpage", en: "Splitting" }, sub: { fr: "position normalisée", en: "normalised position" }, col: 2, row: 1, kind: "process" },
        { id: "ui", label: { fr: "Analyse", en: "Analysis" }, sub: { fr: "freinage, g, carburant", en: "braking, g, fuel" }, col: 2, row: 2, kind: "surface" },
      ],
      edges: [
        { from: "sim", to: "recv" },
        { from: "recv", to: "phys" },
        { from: "recv", to: "graph" },
        { from: "phys", to: "split", label: { fr: "jointure ts", en: "join on ts" } },
        { from: "graph", to: "split" },
        { from: "split", to: "ui" },
      ],
    },
    demonstrates: {
      fr: "Captation haute fréquence, choix de format de données durable, traitement de séries temporelles, restitution graphique d'un signal.",
      en: "High-frequency capture, durable data format choice, time-series processing, graphical rendering of a signal.",
    },
    link: PENDING,
    expertiseKeys: ["acquisition"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "pr-venx",
    name: "Pr-venx",
    index: "P.04",
    stage: "prototype",
    summary: {
      fr: "Détection temps réel de la signalisation routière et des feux tricolores sur flux caméra, avec jeux de données constitués et annotés à la main.",
      en: "Real-time detection of road signs and traffic lights on a camera stream, with hand-built and hand-annotated datasets.",
    },
    period: { fr: "Janvier 2026", en: "January 2026" },
    role: {
      fr: "Constitution des jeux de données, entraînement, intégration temps réel.",
      en: "Dataset construction, training, real-time integration.",
    },
    problem: {
      fr: "Reconnaître un panneau sur une photo est un exercice résolu. Le faire sur un flux caméra, sur une machine sans carte graphique dédiée, en gardant une image fluide, ne l'est pas. La difficulté n'est pas le modèle : c'est le budget de calcul par image.",
      en: "Recognising a sign in a photo is a solved exercise. Doing it on a camera stream, on a machine without a dedicated GPU, while keeping the image smooth, is not. The difficulty is not the model: it is the compute budget per frame.",
    },
    built: {
      fr: [
        "Dix classes distinctes : stop, cédez le passage, limitation, sens interdit, priorité, passage piéton, et les quatre états d'un feu tricolore — rouge, orange, vert, éteint.",
        "Trois jeux de données maintenus séparément : panneaux stop, feux, puis un jeu fusionné pour l'entraînement final.",
        "Une boucle d'affichage découplée de la boucle d'inférence.",
        "Une chaîne d'entraînement reproductible : préparation du jeu de données, entraînement, test, documentée pas à pas.",
      ],
      en: [
        "Ten distinct classes: stop, yield, speed limit, no entry, priority, pedestrian crossing, and the four states of a traffic light — red, amber, green, off.",
        "Three separately maintained datasets: stop signs, traffic lights, then a merged set for final training.",
        "A display loop decoupled from the inference loop.",
        "A reproducible training chain: dataset preparation, training, testing, documented step by step.",
      ],
    },
    decisions: [
      {
        title: {
          fr: "Découpler l'inférence de l'affichage",
          en: "Decoupling inference from display",
        },
        body: {
          fr: "Le modèle ne tourne pas à chaque image mais à intervalle fixe, et les dernières boîtes détectées restent affichées entre deux passes. L'œil ne voit pas la différence sur un panneau qui approche, alors que faire tourner le réseau sur chaque image saccade l'image. C'est un compromis de perception, pas de précision.",
          en: "The model does not run on every frame but at a fixed interval, and the last detected boxes stay on screen between passes. The eye sees no difference on an approaching sign, whereas running the network on every frame makes the image stutter. It is a perception trade-off, not an accuracy one.",
        },
      },
      {
        title: {
          fr: "Le feu éteint est une classe à part entière",
          en: "An unlit traffic light is a class of its own",
        },
        body: {
          fr: "Un feu hors service n'est pas l'absence de feu : c'est une situation de conduite précise, avec une règle de priorité différente. La plupart des jeux de données publics ne distinguent pas ce cas. Le traiter comme une classe explicite a demandé de constituer les images correspondantes.",
          en: "An out-of-service light is not the absence of a light: it is a specific driving situation, with a different priority rule. Most public datasets do not distinguish that case. Treating it as an explicit class required building the corresponding images.",
        },
      },
      {
        title: {
          fr: "Trois jeux de données plutôt qu'un",
          en: "Three datasets rather than one",
        },
        body: {
          fr: "Les panneaux et les feux ont des difficultés différentes : forme fixe et couleur variable d'un côté, forme variable et couleur discriminante de l'autre. Les maintenir séparés permet de mesurer où le modèle échoue avant de fusionner, ce qu'un jeu unique rend impossible.",
          en: "Signs and lights present different difficulties: fixed shape and variable colour on one side, variable shape and discriminating colour on the other. Keeping them separate makes it possible to measure where the model fails before merging, which a single set makes impossible.",
        },
      },
    ],
    stack: ["Python", "YOLOv8", "Ultralytics", "OpenCV", "Tkinter", "Pillow"],
    metrics: [
      {
        value: "10",
        label: { fr: "classes détectées", en: "detected classes" },
        source: {
          fr: "table traffic_signs du code source",
          en: "traffic_signs table in the source code",
        },
      },
      {
        value: "3",
        label: { fr: "jeux de données constitués", en: "datasets built" },
        source: {
          fr: "dataset_stop, dataset_traffic_light, dataset_merged",
          en: "dataset_stop, dataset_traffic_light, dataset_merged",
        },
      },
      {
        value: "0,7 s",
        label: { fr: "intervalle d'inférence", en: "inference interval" },
        source: {
          fr: "constante yolo_interval, ajustée pour tenir la fluidité",
          en: "yolo_interval constant, tuned to keep the stream smooth",
        },
      },
    ],
    diagram: {
      caption: {
        fr: "Deux boucles à des fréquences différentes sur le même flux.",
        en: "Two loops at different rates over the same stream.",
      },
      nodes: [
        { id: "cam", label: { fr: "Caméra", en: "Camera" }, sub: { fr: "flux continu", en: "continuous stream" }, col: 0, row: 1, kind: "source" },
        { id: "loop", label: { fr: "Boucle image", en: "Frame loop" }, sub: { fr: "plein débit", en: "full rate" }, col: 1, row: 0, kind: "process" },
        { id: "yolo", label: { fr: "YOLOv8", en: "YOLOv8" }, sub: { fr: "toutes les 0,7 s", en: "every 0.7 s" }, col: 1, row: 2, kind: "process" },
        { id: "cache", label: { fr: "Dernières boîtes", en: "Last boxes" }, sub: { fr: "état conservé", en: "retained state" }, col: 2, row: 2, kind: "store" },
        { id: "out", label: { fr: "Affichage", en: "Display" }, sub: { fr: "image + boîtes", en: "frame + boxes" }, col: 2, row: 0, kind: "surface" },
      ],
      edges: [
        { from: "cam", to: "loop" },
        { from: "cam", to: "yolo", label: { fr: "échantillon", en: "sample" } },
        { from: "yolo", to: "cache" },
        { from: "cache", to: "out", label: { fr: "superposition", en: "overlay" } },
        { from: "loop", to: "out" },
      ],
    },
    demonstrates: {
      fr: "Vision par ordinateur sous contrainte de temps réel, constitution et annotation de jeux de données, arbitrage entre précision et fluidité.",
      en: "Computer vision under real-time constraints, dataset construction and annotation, trade-off between accuracy and smoothness.",
    },
    link: PENDING,
    expertiseKeys: ["vision"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "nexgen3d",
    name: "nexgen3d",
    index: "P.05",
    stage: "prototype",
    summary: {
      fr: "Outil en ligne de commande qui reconstruit un modèle 3D texturé à partir d'une seule photographie, exploitable directement dans Blender.",
      en: "Command-line tool reconstructing a textured 3D model from a single photograph, usable directly in Blender.",
    },
    period: { fr: "2026", en: "2026" },
    role: {
      fr: "Conception de la chaîne, gestion des replis, intégration Blender.",
      en: "Pipeline design, fallback handling, Blender integration.",
    },
    problem: {
      fr: "Les modèles de reconstruction 3D à partir d'une image existent et sont publics. Ce qui n'existe pas, c'est une façon fiable de les utiliser : ils tournent sur des GPU partagés dont les quotas s'épuisent, dont les points d'entrée changent, et dont les étages de texture tombent en panne indépendamment de l'étage de forme.",
      en: "Single-image 3D reconstruction models exist and are public. What does not exist is a reliable way to use them: they run on shared GPUs whose quotas run out, whose endpoints change, and whose texture stage fails independently of the shape stage.",
    },
    built: {
      fr: [
        "Une interface en ligne de commande unique devant trois modèles de qualités et de vitesses différentes.",
        "Un repli automatique : si l'étage de texture est en panne, la forme est produite seule puis texturée par un second modèle.",
        "Un mode entièrement local, sans réseau, pour les cas où le quota GPU distant est épuisé.",
        "Une sortie au format glTF binaire, importable dans Blender sans conversion.",
      ],
      en: [
        "A single command-line interface in front of three models of differing quality and speed.",
        "An automatic fallback: if the texture stage is down, the shape is produced alone then textured by a second model.",
        "A fully local, network-free mode for when the remote GPU quota is exhausted.",
        "Binary glTF output, importable into Blender without conversion.",
      ],
    },
    decisions: [
      {
        title: {
          fr: "Traiter la panne du fournisseur comme un cas nominal",
          en: "Treating provider failure as a nominal case",
        },
        body: {
          fr: "Un service gratuit tombe. La chaîne ne s'arrête pas dessus : elle détecte l'étage défaillant, produit ce qu'elle peut, et complète avec un autre modèle. L'utilisateur obtient un résultat dégradé plutôt qu'une trace d'erreur, et sait lequel des deux il a obtenu.",
          en: "A free service goes down. The pipeline does not stop there: it detects the failing stage, produces what it can, and completes with another model. The user gets a degraded result rather than a stack trace, and knows which of the two they got.",
        },
      },
      {
        title: {
          fr: "Une échelle de qualité explicite",
          en: "An explicit quality scale",
        },
        body: {
          fr: "Trois modèles, trois compromis annoncés : quelques secondes pour un brouillon, quelques minutes pour un résultat exploitable. L'utilisateur choisit son budget de temps au lancement plutôt que de découvrir après six minutes que le résultat ne convenait pas.",
          en: "Three models, three stated trade-offs: seconds for a draft, minutes for a usable result. The user picks their time budget at launch rather than discovering after six minutes that the result was not suitable.",
        },
      },
    ],
    stack: ["Python", "Hugging Face Spaces", "Hunyuan3D-2", "TripoSG", "trimesh", "rembg", "Blender"],
    metrics: [
      {
        value: "3",
        label: { fr: "modèles derrière une seule commande", en: "models behind one command" },
        source: {
          fr: "options --model du script : hunyuan, triposg, triposr",
          en: "script --model options: hunyuan, triposg, triposr",
        },
      },
      {
        value: "2",
        label: { fr: "modes d'exécution", en: "execution modes" },
        source: {
          fr: "GPU distant ou local hors ligne",
          en: "remote GPU or offline local",
        },
      },
    ],
    diagram: {
      caption: {
        fr: "Chemin nominal et chemin de repli quand l'étage de texture est indisponible.",
        en: "Nominal path and fallback path when the texture stage is unavailable.",
      },
      nodes: [
        { id: "photo", label: { fr: "Photo", en: "Photo" }, sub: { fr: "objet unique", en: "single object" }, col: 0, row: 1, kind: "source" },
        { id: "cli", label: { fr: "CLI", en: "CLI" }, sub: { fr: "choix du modèle", en: "model choice" }, col: 1, row: 1, kind: "process" },
        { id: "shape", label: { fr: "Forme", en: "Shape" }, sub: { fr: "maillage", en: "mesh" }, col: 2, row: 0, kind: "process" },
        { id: "tex", label: { fr: "Texture", en: "Texture" }, sub: { fr: "repli si panne", en: "fallback on failure" }, col: 2, row: 2, kind: "process" },
        { id: "glb", label: { fr: "Sortie .glb", en: ".glb output" }, sub: { fr: "import Blender", en: "Blender import" }, col: 3, row: 1, kind: "surface" },
      ],
      edges: [
        { from: "photo", to: "cli" },
        { from: "cli", to: "shape" },
        { from: "shape", to: "tex", label: { fr: "si texture KO", en: "if texture is down" } },
        { from: "shape", to: "glb" },
        { from: "tex", to: "glb" },
      ],
    },
    demonstrates: {
      fr: "Orchestration de modèles tiers instables, conception de replis, automatisation d'une chaîne de production 3D.",
      en: "Orchestrating unstable third-party models, fallback design, automating a 3D production pipeline.",
    },
    link: PENDING,
    expertiseKeys: ["vision"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "systemes-embarques",
    name: "Systèmes embarqués",
    index: "P.06",
    stage: "prototype",
    summary: {
      fr: "Travaux bas niveau en C et C++ : lecture OBD-II multi-canaux, chronométrage réseau sur microcontrôleur, instrumentation graphique temps réel.",
      en: "Low-level work in C and C++: multi-channel OBD-II reading, network timing on microcontrollers, real-time graphical instrumentation.",
    },
    period: { fr: "2025 – 2026", en: "2025 – 2026" },
    role: {
      fr: "Acquisition, protocoles, affichage, outillage de build.",
      en: "Acquisition, protocols, display, build tooling.",
    },
    problem: {
      fr: "Entre le calculateur d'une voiture et un écran lisible, il y a une longue suite de choses qui n'existent pas toutes seules : un lien série ou réseau qui se coupe, des canaux qui répondent à des rythmes différents, et un affichage qui ne doit jamais attendre la donnée.",
      en: "Between a car's ECU and a readable screen lies a long series of things that do not exist on their own: a serial or network link that drops, channels answering at different rates, and a display that must never wait on data.",
    },
    built: {
      fr: [
        "Une lecture OBD-II de huit canaux — régime, vitesse, carburant, température de liquide, pression de pneus, pression de freins, position de pédale, rapport engagé — chacun écrit dans son propre fichier.",
        "Une reconnexion automatique : la coupure du lien n'interrompt ni la lecture des autres canaux ni l'écriture sur disque.",
        "Un affichage en C : compteur de vitesse et compte-tours dessinés, alimentés par le flux Python via un lien local.",
        "Un chronométrage en C++ qui interroge un microcontrôleur en réseau et horodate les passages, un fil d'exécution par voiture.",
        "Un lanceur qui démarre les deux processus, propage les signaux d'arrêt aux enfants et ne laisse pas de processus orphelin.",
      ],
      en: [
        "OBD-II reading across eight channels — engine speed, road speed, fuel, coolant temperature, tyre pressure, brake pressure, pedal position, engaged gear — each written to its own file.",
        "Automatic reconnection: a link drop interrupts neither the other channels' reading nor the writing to disk.",
        "A display in C: speedometer and tachometer drawn from scratch, fed by the Python stream over a local link.",
        "Timing in C++ that polls a networked microcontroller and timestamps passes, one thread per car.",
        "A launcher that starts both processes, propagates stop signals to children and leaves no orphan process.",
      ],
    },
    decisions: [
      {
        title: {
          fr: "Un fichier par canal",
          en: "One file per channel",
        },
        body: {
          fr: "Les canaux OBD-II ne répondent pas au même rythme et certains ne répondent pas du tout selon le véhicule. Un fichier unique aurait imposé d'attendre le canal le plus lent, ou d'écrire des trous. Un fichier par canal permet à chacun d'avancer à sa cadence, et l'absence d'un capteur se voit immédiatement : le fichier reste vide.",
          en: "OBD-II channels do not answer at the same rate and some do not answer at all depending on the vehicle. A single file would have meant waiting on the slowest channel, or writing gaps. One file per channel lets each advance at its own cadence, and a missing sensor is immediately visible: the file stays empty.",
        },
      },
      {
        title: {
          fr: "Écriture forcée sur disque",
          en: "Forced write to disk",
        },
        body: {
          fr: "Chaque relevé est vidé du tampon puis synchronisé sur le support. Sur une acquisition en voiture, la session se termine rarement proprement : on coupe le contact, on débranche, la batterie de l'ordinateur lâche. Une donnée restée dans un tampon système est une donnée perdue.",
          en: "Each reading is flushed then synced to the medium. On an in-car acquisition, the session rarely ends cleanly: the ignition is cut, something is unplugged, the laptop battery dies. Data left in a system buffer is data lost.",
        },
      },
      {
        title: {
          fr: "Propagation explicite des signaux d'arrêt",
          en: "Explicit propagation of stop signals",
        },
        body: {
          fr: "Le lanceur intercepte l'interruption et termine ses enfants avant de sortir. Sans cela, un Ctrl-C laisse un processus Python accroché au port série, et le lancement suivant échoue sur un périphérique occupé — sur le bord d'une piste, avec un ordinateur portable et cinq minutes devant soi, ce détail décide si la séance a lieu.",
          en: "The launcher traps the interrupt and terminates its children before exiting. Without that, a Ctrl-C leaves a Python process holding the serial port, and the next launch fails on a busy device — trackside, with a laptop and five minutes to spare, that detail decides whether the session happens.",
        },
      },
    ],
    stack: ["C", "C++", "Python", "OBD-II", { fr: "sockets TCP", en: "TCP sockets" }, "ESP32", "Make"],
    metrics: [
      {
        value: "8",
        label: { fr: "canaux véhicule lus en parallèle", en: "vehicle channels read in parallel" },
        source: {
          fr: "sorties CSV déclarées dans le module d'acquisition",
          en: "CSV outputs declared in the acquisition module",
        },
      },
      {
        value: "1 ms",
        label: { fr: "période de scrutation", en: "polling period" },
        source: {
          fr: "paramètre poll_interval du module d'acquisition",
          en: "poll_interval parameter of the acquisition module",
        },
      },
      {
        value: "0,1 s",
        label: { fr: "délai de reconnexion", en: "reconnection delay" },
        source: {
          fr: "paramètre reconnect_delay du module d'acquisition",
          en: "reconnect_delay parameter of the acquisition module",
        },
      },
    ],
    diagram: {
      caption: {
        fr: "Deux processus, un lien local, un lanceur qui les arrête ensemble.",
        en: "Two processes, one local link, one launcher stopping both together.",
      },
      nodes: [
        { id: "ecu", label: { fr: "Calculateur", en: "ECU" }, sub: { fr: "OBD-II", en: "OBD-II" }, col: 0, row: 0, kind: "source" },
        { id: "esp", label: { fr: "ESP32", en: "ESP32" }, sub: { fr: "TCP, passage", en: "TCP, pass" }, col: 0, row: 2, kind: "source" },
        { id: "py", label: { fr: "Acquisition", en: "Acquisition" }, sub: { fr: "Python, 1 ms", en: "Python, 1 ms" }, col: 1, row: 0, kind: "process" },
        { id: "cpp", label: { fr: "Chronométrage", en: "Timing" }, sub: { fr: "C++, un fil / voiture", en: "C++, one thread / car" }, col: 1, row: 2, kind: "process" },
        { id: "csv", label: { fr: "8 fichiers", en: "8 files" }, sub: { fr: "flush + fsync", en: "flush + fsync" }, col: 2, row: 0, kind: "store" },
        { id: "ui", label: { fr: "Instruments", en: "Instruments" }, sub: { fr: "C, compteur / compte-tours", en: "C, speedo / tacho" }, col: 2, row: 2, kind: "surface" },
      ],
      edges: [
        { from: "ecu", to: "py" },
        { from: "esp", to: "cpp" },
        { from: "py", to: "csv" },
        { from: "csv", to: "ui" },
        { from: "cpp", to: "csv", label: { fr: "horodatage", en: "timestamp" } },
      ],
    },
    demonstrates: {
      fr: "Programmation système, protocoles véhicule, robustesse aux coupures, gestion de processus et de signaux.",
      en: "Systems programming, vehicle protocols, robustness to disconnections, process and signal handling.",
    },
    link: PENDING,
    expertiseKeys: ["acquisition"],
  },
];

export function projectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function projectsForExpertise(key: string): Project[] {
  return projects.filter((p) => p.expertiseKeys.includes(key));
}
