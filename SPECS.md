# Invisithèque Throwaway Interactive UI Prototype
## Implementation Brief for an LLM Coding Agent

> **Primary purpose of this document**
>
> This is an implementation specification for building a **throwaway, interactive UX prototype** of the Invisithèque web application. The prototype is intended for client workshops and requirement validation. It is **not** the production application and must not evolve into production architecture by accident.
>
> The coding agent should optimize for: **clarity, speed of iteration, realistic interactions, small codebase, and easy replacement**.

> **Revision note (rev. 2)**
>
> This version was reviewed line by line against the source brief "L'Invisithèque" (association Les Invisibles), including its three embedded images (two filter-UI references and the draft professional fiche wireframe).
>
> Changes: candidate resource types `practical_tool` / `program_training` (section 9.1); professional families (9.2); `atelier` and `service` formats (9.3); a transversal trust and provenance model (9.6); E1/E2/E3 phase mapping (7.3); required primary-vs-advanced filter disclosure and top-bar filter variant (8.2); detail pages opening in another tab (8.2, 14 — revised in rev. 5); precise-disease-name search keywords (11.1); the "signaler l'absence de ressource" flow (18); the adherent discount macaron (13, 15); the "et cie" multi-author rule (16); inclusive writing rule (6.1); stronger accessibility expectations (38); seed dataset raised to 18 records; open questions consolidated in section 49.
>
> Section 49 lists what the brief does not settle. Do not silently resolve those points in code — implement the stated default and keep it easy to flip.
>
> **Rev. 3** — the bento result grid was implemented, reviewed and abandoned: variable card sizes hurt readability and were read as a ranking. The result grid is now uniform; highlighting relies on badges and sort order (section 13).
>
> **Rev. 5** — internal navigation no longer opens a new tab: result cards are plain same-tab links and the search is preserved through URL state + the Back button. Only outbound links keep `target="_blank"` (section 8.2).
>
> **Rev. 4** — the UI layer moved to Tailwind + shadcn/ui, and the resource type is now a real tab bar rather than a row of chips: presenting a single-choice dimension in the same shape as the cumulative filters made the hierarchy unreadable (sections 5, 8.2, 37).
>
> **Rev. 6** — the "Vérifié par Les Invisibles" badge, its `isVerifiedByAssociation` field and the "verified only" toggle filter were removed: the client's brief never asks for a per-resource verification label. It presents evaluation as a condition of entry ("Toutes seront évaluées suivant des critères précis"), which the contribution page's 3-step panel already shows. Trust now rests on peer recommendation (`recommendedBy`, `proposerOpinion`) and, in E3, user reviews (section 9.6). Verification never carried a relevance bonus, so sorting is unchanged.

---

# 1. Agent role

You are acting as a senior frontend engineer and prototyping specialist.

Your task is to build a **small interactive web prototype** that allows a client to understand and validate:

- what the Invisithèque interface looks like;
- how users browse different resource types;
- how search and filters behave;
- which filters are global and which are contextual;
- how results are displayed;
- what information appears on resource detail pages;
- how a user could propose a new resource;
- how some future Step 3 interactions could be visually demonstrated without implementing a real user system.

Do **not** build the real Invisithèque application.

Do **not** optimize for production scalability.

Do **not** introduce infrastructure unless it is strictly needed for demonstrating the UX.

---

# 2. Product context

The Invisithèque is a collaborative directory and search experience for reliable resources related to invisible illnesses and disabilities.

Its goal is to centralize useful resources recommended or curated by the community and the association "Les Invisibles", so that users can more easily find trustworthy and relevant support.

The platform may include:

- professionals providing care, psychological support, coaching, body-based wellbeing or related support;
- cultural and media content;
- digital tools and practical content;
- support groups, wellbeing spaces, accessible places and services;
- associations and institutions;
- research centers and universities.

The core product value is not simply a directory. It is the combination of:

1. a heterogeneous resource catalog;
2. a shared taxonomy across resource types;
3. faceted filtering;
4. resource-specific filters;
5. clear result cards;
6. detailed resource pages;
7. a future community contribution layer.

---

# 3. Prototype objective

The prototype exists to help the developer and client answer questions such as:

- Is the information architecture understandable?
- Are the resource categories correct?
- Are the filters useful?
- Are some filters missing?
- Are there too many filters?
- Which filters should appear immediately and which should be hidden under "More filters"?
- Which filters should change depending on the selected resource type?
- What should happen when multiple filters are combined?
- What should a resource card show?
- What should a resource detail page show?
- Do highlighted resources need a visual distinction beyond their badges? (a bento grid was tried and dropped)
- How should highlighted resources, partner resources or upcoming association events be surfaced?
- What should happen if no exact results are found?
- Is the "propose a resource" flow understandable?

The prototype must therefore feel **interactive enough to discuss behavior**, while remaining intentionally lightweight.

---

# 4. Explicit non-goals

The following must **not** be implemented unless they are necessary for a trivial visual simulation:

- no production backend;
- no database;
- no SQLite;
- no ORM;
- no Prisma;
- no authentication provider;
- no real accounts;
- no permissions system;
- no admin panel;
- no CMS;
- no API layer;
- no server-side search engine;
- no Elasticsearch / Meilisearch / Algolia;
- no real email sending;
- no real file uploads;
- no persistent favorites;
- no persistent reviews;
- no analytics integration;
- no payment integration;
- no production monitoring;
- no complex architecture patterns;
- no repository/service abstraction merely for architecture purity;
- no unnecessary packages.

If a feature can be simulated with local React state, use local React state.

If a feature can be simulated with static JSON, use static JSON.

The prototype should be easy to delete after client validation.

---

# 5. Recommended technical stack

Use:

- **Next.js** using the current stable App Router approach available in the environment;
- **TypeScript**;
- **React**;
- static **JSON files** as the only data source;
- client-side filtering;
- local component state;
- optionally `URLSearchParams` for filter state if it remains simple;
- **Tailwind CSS + shadcn/ui** for the component layer (button, card, tabs, toggles, select, dialog, accordion…), or CSS Modules / plain CSS if the component library is not wanted.

shadcn/ui components are copied into `components/ui/` rather than installed as a black box, so they stay editable and disposable like the rest of the prototype.

Deployment target:

- Vercel.

The prototype should work without a database or external service.

Prefer built-in platform capabilities over additional libraries.

---

# 6. Language and content rules

The implementation code may use English identifiers.

The **visible user interface must be in French**, because this prototype is intended for the client and future French-speaking users.

Examples:

- "Que recherchez-vous ?"
- "Professionnels"
- "Contenus"
- "Dispositifs et espaces"
- "Institutions et partenaires"
- "Plus de filtres"
- "Voir la fiche"
- "En savoir plus"
- "Proposer une ressource"
- "Aucun résultat exact"
- "Ressources susceptibles de vous aider"
- "Signaler l'absence de ressource sur ma maladie"

Keep the tone accessible, calm and non-technical.

## 6.1 Inclusive writing

The association writes in French inclusive form using the middle dot (`·`), consistently, in all its material:

- "pair·es";
- "personnes concerné·es";
- "adhérent·es";
- "professionnel·les";
- "accompagné·e".

Apply the same convention to every visible label in the prototype. This is an identity marker for "Les Invisibles", not a stylistic option.

---

# 7. Source requirements vs prototype decisions

The coding agent must understand this distinction.

## 7.1 Requirements originating from the project brief

These are product requirements or ideas explicitly present in the source project:

- resource browsing by type;
- basic and advanced filters;
- cumulative filters;
- filter options that depend on the selected resource type;
- type of resource as a primary filter;
- objectives as an important filter dimension;
- formats for cultural/media content;
- country and consultation mode for professionals;
- filtering by broad types of disorders rather than precise diseases;
- free / paid filter;
- sorting by relevance, reviews or newest;
- results displayed as a grid, with a possible bento approach (tried, then dropped — see section 13);
- a "load more" or infinite-scroll style interaction;
- detailed resource pages;
- "learn more" outbound links;
- possibility to propose a missing resource;
- later user accounts, reviews, favorites and viewed-resource history;
- professionals connected to an upcoming association wellbeing event may receive priority;
- association partners may receive priority;
- resources are recommended by peers and evaluated by qualified association volunteers against defined criteria;
- a user who finds nothing about their illness can propose a resource **and/or signal that no resource exists on that illness**;
- clicking a result card must not lose the current search — the brief asks for a new tab, the prototype answers the need differently (see 8.2);
- secondary filters live in a "plus de filtres" / advanced section, distinct from the primary filters shown on the home page;
- professionals are organised in three families: coaching/personal development, therapies and psychological support, body wellbeing and relaxation.

## 7.2 Prototype implementation decisions

The following are **prototype decisions**, not confirmed production requirements:

- exact page layout;
- exact navigation structure;
- exact number of cards per row;
- exact filter placement;
- exact mobile behavior;
- exact ranking algorithm;
- exact visual design;
- exact URL structure;
- exact data model implementation;
- exact wording of generated seed content;
- how highlighted resources are distinguished in the result grid;
- the shape of the contribution form and its 3-step "Proposition / Vérification / Publication" panel;
- how the provenance signals are presented;
- the `searchKeywords` disease-name mapping.

Do not present prototype-specific assumptions as validated business requirements.

## 7.3 Phase mapping (E1 / E2 / E3)

The source brief assigns every feature to a delivery step. This matters for the workshop, because the association's funding request covers **E1 + E2 as the V1**, with E3 planned later.

| Phase | Scope in the brief | In this prototype |
|---|---|---|
| **E1** | tab navigation by resource type, result grid, card → full page, answers even when there is no result, "charger plus" / back to top, "en savoir plus" links | fully demonstrated |
| **E2** | more filters (objectives, formats, country + consultation mode, disorder types, free/paid), advanced "plus de filtres" section, cumulative filters, sort by relevance/reviews/newest, wellbeing-circle and partner boosts | fully demonstrated |
| **E3** | personal accounts, ratings and reviews, favorites, saved searches/filter history, "déjà consulté" | **visual simulation only** (see section 21) |

Two consequences for the prototype:

- every E3 control must be visibly marked as a later phase (badge, muted styling, or "(démo)" suffix) so the client never mistakes it for V1 scope;
- the "Avis" sort option is E2 in the brief, but the review data it sorts on only exists in E3. Keep the control, use fake data, and label the dependency in the UI or in the workshop notes.

---

# 8. Required prototype pages

Build the following main views.

## 8.1 Home / search page

Suggested route:

`/`

The page must contain:

### Header

- Invisithèque name/logo placeholder;
- navigation items, for example:
  - Rechercher;
  - Ressources;
  - Contribuer;
  - À propos;
- optional disabled or visual-only account icon.

### Hero/search area

Include:

- a short value proposition;
- one prominent search input;
- resource-type tabs or segmented controls;
- a few high-level filter shortcuts.

Suggested resource tabs:

- Tous;
- Professionnels;
- Contenus;
- Dispositifs et espaces;
- Institutions et partenaires.

Suggested quick filters:

- Objectif;
- Type de trouble;
- Localisation;
- En ligne / Présentiel;
- Gratuit / Payant.

### Featured resources

Display 3 to 5 representative resources.

These cards exist to discuss editorial highlighting, partner promotion and association content.

At least one highlighted resource should demonstrate a priority reason, for example:

- partner of the association;
- upcoming wellbeing circle/event;
- association-curated recommendation.

---

## 8.2 Search results page

Suggested route:

`/search`

This is the most important screen in the prototype.

### Required layout

Desktop:

- filter panel (see the two variants below);
- main result area;
- search field at the top;
- active-filter chips;
- result count;
- sort control;
- result grid.

Mobile can use a filter drawer, but mobile polish is secondary to desktop behavior.

### Filter hierarchy (required)

Two different mechanisms must not look alike:

- **resource type** — single choice, one value at a time → render as a **segmented tab bar** (grey track, active tab as a white pill, its own row above the filters, on a single line that scrolls rather than wraps);
- **filters** — cumulative, multi-value → render as **toggle pills** grouped by dimension inside a panel.

Tab labels may be shortened ("Dispositifs", "Institutions") so the bar never wraps; the full label stays everywhere else. Chips-for-everything was tried and rejected in review: users could not tell which control was exclusive and which was cumulative. Labelling the two levels on screen ("1. Type de ressource — un seul choix", "2. Filtres — cumulables") is cheap and removes the ambiguity.

### Primary vs advanced filters (required)

The brief explicitly separates:

- **primary filters**, visible immediately (resource type, objectives);
- **secondary filters**, placed in a "plus de filtres" / advanced section.

The prototype must implement this disclosure, not show every filter flat. A collapsed "Plus de filtres" control revealing the secondary dimensions is one of the main things the client has to arbitrate.

### Filter placement variants

The client's own reference images use a **horizontal filter bar**: resource-type tabs, a few always-visible quick filters, and an expandable full-width panel with chips grouped by dimension.

Therefore:

- implement the **top filter bar + expandable panel** as the default;
- a left sidebar is an acceptable alternative if it is faster to build, but do not present it as the client's expected pattern;
- if it is cheap, make the layout switchable so both can be compared during the workshop.

Filter placement remains a prototype decision (section 7.2), not a validated requirement.

### Opening a resource

The brief specifies that clicking a result card opens the full resource page **in another tab**, while the results stay available in the original tab.

**The prototype deliberately does not do this**, and the divergence must be presented to the client.

The underlying need — *ne pas perdre sa recherche* — is met without hijacking the browser:

- the full search state (query, type, filters, sort) lives in the URL, so the browser Back button returns to the exact result set;
- result cards are ordinary internal links: same tab, client-side navigation, and anyone who wants a new tab still has cmd/ctrl-click;
- the detail page keeps a breadcrumb back to the results.

Why not `target="_blank"` on internal links:

- it kills the Back button in the new tab, which is the reflex most users try first;
- browsing ten resources leaves ten tabs — the opposite of the brief's own promise of *"réduction de la charge mentale"*;
- unannounced new windows are a known disorientation problem for screen-reader and cognitive-load users (WCAG 3.2.5), which matters for this audience in particular;
- on mobile, tab switching is hidden behind an extra layer and users simply lose the site.

**Outbound links are the exception and keep `target="_blank"`**: "En savoir plus", the professional's website or booking page, social links, "Consulter la ressource". Leaving for an external site is exactly where a new tab is a service rather than a hijack. These links carry a visible external-link icon and a screen-reader hint "(ouvre un nouvel onglet)".

If the client insists after the workshop, the fallback is an explicit, labelled "ouvrir dans un nouvel onglet" affordance rather than silently retargeting every card.

### Required interactions

Users must be able to:

- type in the search field;
- choose one resource type;
- select multiple values in compatible filters;
- remove active filters individually;
- reset all filters;
- sort results;
- open a result detail page;
- trigger a "load more" interaction;
- observe a no-exact-match state;
- follow a CTA to propose a missing resource.

All search/filter behavior can happen client-side.

---

# 9. Filter behavior

The filter system is one of the main reasons for building this prototype.

It must visibly demonstrate **faceted filtering** and **contextual filters**.

## 9.1 Global filters

The following dimensions can apply to several resource categories:

### Resource type

Values:

- professional;
- cultural_content;
- support_space;
- institution_partner;
- practical_tool *(candidate — to validate)*;
- program_training *(candidate — to validate)*.

**Open question — do not resolve silently.**

The brief describes the catalog in 4 content families (professionals, cultural content and media, support spaces, institutions and partners), but its list of *primary filter values* is broader:

> Professionnel, Contenu culturel, **Outil pratique**, **Programmes/Formations**, Lieu/association, Institution, etc.

The prototype keeps the 4 families as the main tabs, because they map to the 3 fiche structures the brief defines. `practical_tool` and `program_training` are added as **candidate types** so the client can decide during the workshop whether:

- practical/digital tools are a resource type of their own, or a format of cultural content (`app`, `website`, `practical_guide`);
- programs/trainings are a resource type of their own, a support-space category, or a format (`atelier`).

Implementation: model them as real values, seed 1–2 records for each, and make it trivial to promote them to top-level tabs or demote them back into formats. Visible French labels: "Outils pratiques", "Programmes et formations".

### Objectives

Use a representative list such as:

- s_informer;
- etre_accompagne;
- mieux_vivre_au_quotidien;
- se_detendre;
- apprendre;
- echanger;
- trouver_du_soutien;
- orientation_sociale.

Visible French labels should be natural:

- S'informer;
- Être accompagné·e;
- Mieux vivre au quotidien;
- Se détendre;
- Apprendre;
- Échanger;
- Trouver du soutien;
- Obtenir de l'aide pour s'orienter.

### Disorder categories

The source project explicitly prefers **broad disorder types instead of precise disease names in the filtering system**.

Use a small representative taxonomy such as:

- troubles_douleur_chronique;
- troubles_fatigue;
- troubles_digestifs;
- troubles_vestibulaires;
- troubles_neurologiques;
- troubles_psychiques;
- troubles_musculosquelettiques;
- tous_troubles.

This taxonomy is test data, not a medically validated final taxonomy.

### Pricing

Values:

- free;
- paid;
- mixed.

Visible labels:

- Gratuit;
- Payant;
- Gratuit et payant.

---

## 9.2 Professional-specific filters

These filters should become visible or relevant when `professional` is selected.

### Country

Representative values:

- CH;
- FR;
- BE;
- CA.

### Consultation mode

Values:

- in_person;
- remote;
- hybrid.

Visible labels:

- Présentiel;
- Visio;
- Mixte.

### Professional family

The brief defines three explicit professional families, each with its own definition. They are a level above specialties and must exist as their own filter dimension:

- `coaching_developpement` — "Coaching et développement personnel": goal-oriented support, autonomy, personal development;
- `therapies_psy` — "Thérapies et accompagnement psychologique": emotional support, stress management, resilience (psychologue, hypnothérapeute, psychothérapeute, ergothérapeute, psychanalyste…);
- `bien_etre_corporel` — "Bien-être corporel et relaxation": relaxation, body awareness, global wellbeing (sophrologue, yoga, relaxologue, masseur…).

Specialties below are nested under these families. A workshop question to raise: is the family enough as a filter, or do users need the specialty level too?

### Specialties / practices

Representative values:

- psychologie;
- psychotherapie;
- coaching;
- ergotherapie;
- sophrologie;
- yoga;
- relaxation;
- hypnose.

Limit the prototype taxonomy to what is useful for interaction testing.

---

## 9.3 Cultural-content-specific filters

These filters should become visible or relevant when `cultural_content` is selected.

### Media format

Representative values based on the brief:

- book;
- comic;
- podcast;
- movie;
- series;
- documentary;
- video;
- blog;
- magazine;
- app;
- website;
- practical_guide;
- association_article;
- atelier;
- service.

`atelier` and `service` come from the brief's own format list and must not be dropped. They overlap with the `program_training` candidate type — that overlap is exactly what the workshop needs to arbitrate.

### Genre

Representative prototype values:

- testimony;
- educational;
- wellbeing_practice;
- practical;
- fiction;
- documentary.

### Point of view

Representative values:

- patient;
- doctor;
- journalist;
- practitioner;
- researcher;
- association.

---

## 9.4 Support-space-specific filters

Representative filters may include:

### Support type

- peer_group;
- wellbeing_space;
- accessible_cultural_place;
- care_center;
- rehabilitation_center;
- collaborative_platform;
- forum;
- administrative_support;
- social_orientation;
- association_circle.

### Delivery mode

- in_person;
- digital;
- hybrid.

---

## 9.5 Institution/partner-specific filters

Representative categories:

- association;
- public_institution;
- private_organization;
- research_center;
- university.

Include:

- `isAssociationPartner` boolean.

A partner resource should be visually identifiable and may rank higher in one prototype scenario.

In the brief, partnership is described as an "échange de visibilité" — a reciprocal visibility agreement, not an editorial quality judgement. Keep the badge wording neutral ("Partenaire des Invisibles"): it is not a quality mark.

---

## 9.6 Trust and provenance (transversal)

This is central to the brief's positioning — "un repère de confiance", resources "recommandées par celles et ceux qui vivent avec l'Invisible" and "évaluées suivant des critères précis, définis avec l'aide de bénévoles qualifié·es de l'association".

Two **distinct** signals must not be conflated:

1. **Peer recommendation** — who proposed the resource and why. Field `recommendedBy` (fictional first name / "Un·e bénévole de l'association") plus, for cultural content, the existing `proposerOpinion`.
2. **User ratings and reviews** — E3 only, fake data, demo UI.

There is deliberately **no per-resource "verified" badge** (removed in rev. 6). The brief presents evaluation as a condition of entry — every listed resource "sera évaluée suivant des critères précis" — not as a distinction between listed resources, and it never asks for such a label. The review step stays visible where the brief grounds it: the contribution page's "Proposition / Vérification / Publication" panel.

For the prototype:

- show `recommendedBy` on detail pages;
- show `proposerOpinion` on cultural-content detail pages.

The evaluation criteria themselves are not defined yet. Do not invent a scoring scale or a verification mark.

---

# 10. Cumulative filter semantics

The prototype must make filter combination behavior explicit.

Use the following simple rules unless changed during a client workshop:

## Between different filter dimensions: AND

Example:

`resourceType = professional`

AND

`country = CH`

AND

`objective = etre_accompagne`

Only resources matching all selected dimensions should remain.

## Within one multi-select dimension: OR

Example:

`consultationMode = remote OR hybrid`

A resource matching either selected value remains.

Example:

`disorderCategory = troubles_fatigue OR troubles_vestibulaires`

A resource matching one or both remains.

This rule should be encapsulated in one straightforward filtering function so it is easy to modify during prototyping.

---

# 11. Text search behavior

This is a prototype, not a real information-retrieval system.

Implement intentionally simple text search.

Search across a normalized combination of:

- title/name;
- short description;
- themes;
- `searchKeywords`;
- specialties;
- format labels;
- category labels;
- optionally location labels.

Use lowercase normalization and basic substring matching.

## 11.1 Precise disease names

The brief deliberately keeps **precise disease names out of the filtering system** and uses broad disorder types instead. But it also describes the opposite user behavior: someone searching for resources "sur sa maladie", by its name.

The prototype must be able to demonstrate that tension. Therefore:

- seed a `searchKeywords` array on resources with a few precise, plausible disease names attached to their broad category (for example fibromyalgie, endométriose, SEP, SFC/EM, maladie de Menière, syndrome de l'intestin irritable);
- typing a disease name in the search field should return the resources of the corresponding broad category;
- typing a disease name that no resource covers should trigger the no-exact-result state of section 18.

This is seed data for discussion, not a medical mapping. Keep it in the taxonomy/seed files, never hard-coded in components.

Do not add fuzzy search libraries unless they are already available and trivial to use.

The goal is to demonstrate the interface, not search quality.

---

# 12. Sorting behavior

Required visible options:

- Pertinence;
- Nouveauté;
- Avis.

Because the production relevance model is not yet defined, the prototype must use a deliberately transparent, simple ranking model.

## 12.1 Prototype relevance score

Each resource may have a static numeric `baseRelevance` between 0 and 100.

Add simple optional priority bonuses:

- +20 if `hasUpcomingAssociationEvent = true`;
- +10 if `isAssociationPartner = true`;
- +5 if `isFeatured = true`.

Optional text-match bonus can be added when a search query is non-empty.

This scoring system is **not a product requirement**. It exists only to demonstrate what "priority" could feel like.

## 12.2 Newest

Sort by `publishedAt` descending.

## 12.3 Reviews

Sort by `ratingAverage` descending, then by `reviewCount` descending.

Review data may be fake because actual reviews belong to a later project phase.

Note the phase mismatch documented in section 7.3: the brief places this sort option in E2, but the reviews it depends on in E3. Keep the control visible and mention the dependency during the workshop.

---

# 13. Result grid

The brief mentions a possible **bento grid**. It was built, reviewed, and **dropped**: the
variable card sizes made the result list harder to scan, and the emphasis was read as a ranking
rather than as a highlight.

For this prototype:

- use a **uniform card grid** — every result carries the same visual weight;
- no wide cards, no spanning, no masonry;
- highlighting happens through **badges** (partner, upcoming circle) and through
  **sort order**, not through card size;
- editorial highlighting stays confined to the home page "À la une" section.

If the question comes back during the workshop, the open version of it is: *do users need any
visual distinction between a highlighted resource and a normal one, beyond its badges?*

Each result card should show only the most useful summary information.

Suggested card anatomy:

- image placeholder;
- resource-type badge;
- title;
- 1 short description;
- 2 to 4 useful metadata chips;
- partner/event badge if relevant;
- discount macaron (for example "-15%") if the professional offers an adherent discount;
- "Voir la fiche" CTA (internal link, same tab).

Optional subtle hover state is appropriate — the brief asks for a "effet discret de mouseover".

---

# 14. Resource detail pages

Suggested route:

`/resources/[slug]`

Use one route with rendering dependent on `resourceType`.

Do not build four completely unrelated detail-page systems unless that is simpler for the prototype.

The page should include:

- breadcrumb or clear return-to-results link;
- primary image;
- resource type;
- resource title/name;
- relevant tags;
- `recommendedBy` provenance line;
- main description;
- resource-specific information;
- external "En savoir plus" CTA.

Cards open this page in the same tab; the breadcrumb and the browser Back button both return to the results, filters intact.

The source brief defines three main front-facing detail structures.

---

# 15. Professional resource details

The source brief expects the following information to be representable:

- photo;
- first name;
- last name;
- location;
- website / booking site;
- phone;
- email;
- social links;
- short professional presentation, maximum approximately 400 characters in the real project;
- up to 3 specialties/practices;
- a short presentation for each specialty;
- discount percentage;
- short discount explanation.

The client's draft wireframe shows how the discount is framed: a **"-15%" macaron** in the top-right corner of the fiche, plus a section titled **"Offre adhérent·es de l'asso"** carrying the explanation. It is a benefit reserved for association members, not a generic promotion — reproduce that wording. The same wireframe shows the specialties as expandable rows (label + chevron) rather than plain paragraphs; an accordion is a reasonable prototype interpretation.

Prototype-specific useful fields:

- professional family (see 9.2);
- consultation modes;
- country;
- upcoming association event flag;
- event title/date for one or two examples.

Interactions:

- "En savoir plus" can link to `#` or a safe placeholder URL;
- future review/favorite controls may appear as disabled or demo-only UI.

---

# 16. Cultural/media resource details

The source brief expects:

- image;
- title;
- one or more authors — the brief adds a display rule: when the resource has more than two authors, the front end shows the first author followed by "et cie";
- broad illness/disability applicability information;
- media format;
- media genre;
- point of view;
- main theme;
- external link(s) for consultation/purchase;
- description, approximately 400 characters in the real project;
- recommendation/comment from the person who proposed the resource, approximately 400 characters.

Future Step 3 interactions can be shown visually:

- submit review;
- like;
- mark as already read/watched/listened/consulted.

These must not require real accounts.

---

# 17. Support spaces, institutions and partners details

The source brief combines these into a similar information structure.

Represent:

- image;
- name;
- type/category;
- association partner yes/no;
- location or delivery mode: in person / digital / mixed;
- website;
- social links;
- presentation;
- "Pourquoi ça peut vous aider ?" content.

Interactions:

- "En savoir plus";
- partner badge if applicable;
- future review UI can be demo-only.

---

# 18. No-results and partial-results behavior

The source project explicitly wants the interface to provide helpful answers even when the exact expected result is not found.

Create at least two states:

## Exact results exist

Show the normal result grid.

## No exact results

Do not show a dead empty screen.

Instead show:

1. message:
   - "Aucun résultat exact pour cette recherche.";
2. two distinct CTAs — the brief asks for both:
   - "Proposer une ressource" → leads to the contribution page;
   - "Signaler l'absence de ressource sur ma maladie" → opens a small inline form or modal with a single free-text field ("Quelle maladie ou quel handicap cherchiez-vous ?") prefilled with the current query, and a confirmation message. Nothing is persisted.
3. optional relaxed suggestions section:
   - "Ressources susceptibles de vous aider".

The second CTA is deliberately lighter than the first: proposing a resource is a contribution, signalling a gap is feedback. Keeping them separate is one of the things the workshop should confirm.

For prototype purposes, relaxed suggestions may simply ignore one of the most restrictive selected filters.

This fallback logic does not need to be intelligent.

The goal is to discuss the expected UX with the client.

---

# 19. Load-more behavior

Use a simple client-side pagination simulation.

Example:

- show 6 resources initially;
- "Charger plus" reveals 6 more;
- hide the button when there are no more results.

Do not implement real infinite scroll unless it is trivial.

A "back to top" button may appear after loading more items.

---

# 20. Contribution page

Suggested route:

`/contribute`

This page demonstrates how community contribution could work.

It does not submit data anywhere.

Include fields representing a reasonable cross-resource proposal form:

- resource type;
- name/title;
- thematic/objective;
- broad disorder type(s);
- link;
- location;
- contact;
- description;
- "Pourquoi recommandez-vous cette ressource ?";
- optional image upload placeholder;
- consent/confirmation checkbox.

The form may adapt slightly when the selected resource type changes.

On submit:

- validate required client-side fields lightly;
- show a success state or modal;
- do not persist anything.

Suggested explanation panel:

1. Proposition;
2. Vérification;
3. Publication.

This makes the collaborative moderation concept visible without implementing moderation. It is grounded in the brief's promise that resources are "évaluées suivant des critères précis, définis avec l'aide de bénévoles qualifié·es", but the 3-step wording itself is a prototype decision.

The lighter "Signaler l'absence de ressource sur ma maladie" flow from section 18 is **not** this form. Keep it to a single field plus a confirmation, so the client can compare the two levels of effort asked of a user.

---

# 21. Optional Step 3 demo interactions

Step 3 of the project includes future personal accounts, reviews, favorites, saved filters and already-viewed resources.

These are out of scope as real features.

However, the prototype may include **visual simulations** where useful for discussion.

Allowed examples:

### Favorite

Click a bookmark icon:

- local state toggles;
- icon changes visually;
- optional toast: "Ajouté aux favoris (démo)".

### Already consulted

Click:

- local state toggles;
- label changes to "Déjà consulté".

### Review

Open a small modal with disabled/demo star controls.

No review should be persisted.

### Saved search

A "Sauvegarder cette recherche" button can show a tooltip:

"Fonction prévue dans une phase ultérieure."

Do not implement authentication.

---

# 22. JSON data architecture

Use static JSON files under a clear directory such as:

```text
/data
  resources.json
  taxonomy.json
```

Optional alternative if it improves clarity:

```text
/data
  resources.json
  taxonomies/
    objectives.json
    disorder-categories.json
    specialties.json
    formats.json
```

Prefer the smallest structure that remains easy to understand.

The prototype must not fetch an external API.

---

# 23. Core resource JSON schema

Use a shared resource shape with type-specific nested objects.

Recommended conceptual schema:

```ts
interface BaseResource {
  id: string;
  slug: string;
  resourceType:
    | "professional"
    | "cultural_content"
    | "support_space"
    | "institution_partner"
    | "practical_tool"      // candidate type, see 9.1
    | "program_training";   // candidate type, see 9.1

  title: string;
  shortDescription: string;
  image: string;

  objectives: string[];
  disorderCategories: string[];   // "tous_troubles" means: applies to every disorder
  themes: string[];
  searchKeywords: string[];       // precise disease names, search only, never a filter
  pricing: "free" | "paid" | "mixed";

  isFeatured: boolean;
  recommendedBy: string | null;   // fictional peer or "Un·e bénévole de l'association"
  isAssociationPartner: boolean;
  hasUpcomingAssociationEvent: boolean;

  baseRelevance: number;
  publishedAt: string;

  // Fake Step 3/demo metrics
  ratingAverage: number | null;
  reviewCount: number;

  externalUrl: string;

  professional?: ProfessionalDetails;
  culturalContent?: CulturalContentDetails;
  supportSpace?: SupportSpaceDetails;
  institution?: InstitutionDetails;
}
```

Keep unused type-specific properties absent, not filled with meaningless `null` values unless the implementation strongly benefits from a fixed shape.

Two modeling notes:

- "applies to all disorders" is expressed **once**, through the `tous_troubles` value in `disorderCategories`. Do not also carry a separate boolean — one concept, one field.
- the brief's fiche field lists describe **front-facing** fields only. None of them include objectives, disorder categories or pricing, yet the filters require all three on every resource type. The prototype therefore implies back-office fields the client has not listed. Raise this explicitly during the workshop: it affects the contribution form and the future admin.

---

# 24. Professional JSON schema

```ts
interface ProfessionalDetails {
  firstName: string;
  lastName: string;

  family:
    | "coaching_developpement"
    | "therapies_psy"
    | "bien_etre_corporel";

  country: "CH" | "FR" | "BE" | "CA";
  city: string;

  consultationModes: Array<"in_person" | "remote" | "hybrid">;

  specialties: Array<{
    id: string;
    label: string;
    description: string;
  }>;

  presentation: string;

  contact: {
    website?: string;
    bookingUrl?: string;
    phone?: string;
    email?: string;
  };

  socialLinks?: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
    twitter?: string;
  };

  // "Offre adhérent·es de l'asso" — member benefit, shown as a macaron
  discount?: {
    percentage: number;
    description: string;
  };

  upcomingAssociationEvent?: {
    title: string;
    date: string;
  };
}
```

For prototype seed data, not every professional needs every contact or social field.

---

# 25. Cultural content JSON schema

```ts
interface CulturalContentDetails {
  authors: string[];
  hasMultipleAuthors: boolean;   // renders "<first author> et cie" in the UI

  format:
    | "book"
    | "comic"
    | "podcast"
    | "movie"
    | "series"
    | "documentary"
    | "video"
    | "blog"
    | "magazine"
    | "app"
    | "website"
    | "practical_guide"
    | "association_article"
    | "atelier"
    | "service";

  genre: string;
  pointOfView: string;
  mainTheme: string;

  description: string;
  proposerOpinion: string;

  links: Array<{
    label: string;
    url: string;
  }>;
}
```

---

# 26. Support-space JSON schema

```ts
interface SupportSpaceDetails {
  category:
    | "peer_group"
    | "wellbeing_space"
    | "accessible_cultural_place"
    | "care_center"
    | "rehabilitation_center"
    | "collaborative_platform"
    | "forum"
    | "administrative_support"
    | "social_orientation"
    | "association_circle";

  deliveryMode: "in_person" | "digital" | "hybrid";

  country?: "CH" | "FR" | "BE" | "CA";
  city?: string;

  presentation: string;
  whyItHelps: string;

  website?: string;
  socialLinks?: Record<string, string>;
}
```

---

# 27. Institution / partner JSON schema

```ts
interface InstitutionDetails {
  category:
    | "association"
    | "public_institution"
    | "private_organization"
    | "research_center"
    | "university";

  deliveryMode: "in_person" | "digital" | "hybrid";

  country?: "CH" | "FR" | "BE" | "CA";
  city?: string;

  presentation: string;
  whyItHelps: string;

  website?: string;
  socialLinks?: Record<string, string>;
}
```

---

# 28. Taxonomy JSON structure

Use IDs that are stable and implementation-friendly, with French display labels.

Example:

```json
{
  "objectives": [
    {
      "id": "s_informer",
      "label": "S'informer"
    },
    {
      "id": "etre_accompagne",
      "label": "Être accompagné·e"
    },
    {
      "id": "mieux_vivre_au_quotidien",
      "label": "Mieux vivre au quotidien"
    },
    {
      "id": "echanger",
      "label": "Échanger"
    }
  ],
  "disorderCategories": [
    {
      "id": "troubles_fatigue",
      "label": "Troubles liés à la fatigue"
    },
    {
      "id": "troubles_digestifs",
      "label": "Troubles digestifs"
    },
    {
      "id": "troubles_vestibulaires",
      "label": "Troubles vestibulaires"
    },
    {
      "id": "troubles_douleur_chronique",
      "label": "Douleurs chroniques"
    }
  ],
  "professionalFamilies": [
    {
      "id": "coaching_developpement",
      "label": "Coaching et développement personnel"
    },
    {
      "id": "therapies_psy",
      "label": "Thérapies et accompagnement psychologique"
    },
    {
      "id": "bien_etre_corporel",
      "label": "Bien-être corporel et relaxation"
    }
  ]
}
```

The exact medical/taxonomic wording is not validated. Treat the list as UI test data.

Every visible label in the prototype must come from this file, never from a hard-coded string in a component. The workshop will change these words.

---

# 29. Required seed dataset

Generate approximately **18 resources**.

Do not generate 100 resources.

The dataset should be intentionally constructed to exercise filter combinations.

Recommended distribution:

- 5 professionals (one per family at minimum);
- 4 cultural/media resources;
- 4 support spaces/services;
- 3 institutions/partners;
- 1 practical tool *(candidate type)*;
- 1 program/training *(candidate type)*.

The goal is not realism by volume. The goal is **coverage of interaction scenarios**.

---

# 30. Seed dataset coverage matrix

Ensure the generated test records include the following combinations.

## Professionals

### Professional A

- Switzerland;
- Lausanne or Geneva;
- in person + remote;
- fatigue + chronic pain;
- family `therapies_psy`, psychology or psychotherapy;
- paid;
- adherent discount (for example -15%), so the macaron is demonstrable;
- normal relevance.

### Professional B

- Switzerland;
- remote;
- vestibular disorders;
- coaching or support;
- paid;
- has upcoming association event;
- should rank highly in relevance mode.

### Professional C

- France;
- in person;
- digestive disorders;
- family `bien_etre_corporel`, sophrology / relaxation;
- paid.

### Professional D

- Belgium;
- hybrid;
- psychological disorders;
- psychology;
- paid;
- association partner.

### Professional E

- Canada;
- remote;
- broad/all-disorder support (`tous_troubles`);
- family `coaching_developpement`;
- mixed pricing.

## Cultural/media resources

Include at least:

- one book;
- one podcast;
- one documentary or video;
- one practical guide / app / website.

Distribute fatigue, chronic pain, digestive or vestibular themes across them.

At least one should be free and one paid.

## Support spaces/services

Include at least:

- one online peer-support group;
- one association circle;
- one physical or hybrid wellbeing space;
- one administrative/social orientation service.

At least one should be in Switzerland and free.

## Institutions/partners

Include at least:

- one association;
- one public institution or university;
- one research center/private specialist organization.

At least one should have `isAssociationPartner = true`.

## Candidate types

- one `practical_tool` (symptom-tracking app or budgeting/energy-management tool);
- one `program_training` (multi-session workshop or online course).

Both exist to test whether they deserve their own tab, or belong under cultural content / support spaces.

## Search keywords

Spread a handful of precise disease names across the records via `searchKeywords`, and deliberately leave at least one plausible disease name uncovered so scenario E can be triggered by a text search alone.

---

# 31. Example full JSON record: professional

Use this as structural guidance, not mandatory copy.

```json
{
  "id": "pro-001",
  "slug": "claire-moret-psychologue",
  "resourceType": "professional",
  "title": "Claire Moret – Psychologue",
  "shortDescription": "Accompagnement psychologique pour les personnes vivant avec fatigue persistante et douleur chronique.",
  "image": "/images/placeholders/professional-01.jpg",
  "objectives": ["etre_accompagne", "mieux_vivre_au_quotidien"],
  "disorderCategories": ["troubles_fatigue", "troubles_douleur_chronique"],
  "themes": ["psychologie", "gestion_du_quotidien"],
  "searchKeywords": ["fibromyalgie", "syndrome de fatigue chronique", "EM/SFC"],
  "pricing": "paid",
  "isFeatured": true,
  "recommendedBy": "Un·e bénévole de l'association",
  "isAssociationPartner": false,
  "hasUpcomingAssociationEvent": false,
  "baseRelevance": 78,
  "publishedAt": "2026-06-18",
  "ratingAverage": 4.6,
  "reviewCount": 12,
  "externalUrl": "#",
  "professional": {
    "firstName": "Claire",
    "lastName": "Moret",
    "family": "therapies_psy",
    "country": "CH",
    "city": "Lausanne",
    "consultationModes": ["in_person", "remote"],
    "specialties": [
      {
        "id": "psychologie",
        "label": "Psychologie",
        "description": "Accompagnement centré sur l'adaptation au quotidien, la fatigue et la douleur persistante."
      },
      {
        "id": "gestion_stress",
        "label": "Gestion du stress",
        "description": "Outils pratiques pour réduire la surcharge et retrouver des marges de récupération."
      }
    ],
    "presentation": "Claire accompagne des personnes vivant avec des symptômes persistants ou fluctuants. Son approche met l'accent sur l'écoute, l'autonomie et les stratégies concrètes du quotidien.",
    "contact": {
      "website": "#",
      "bookingUrl": "#",
      "phone": "+41 21 000 00 00",
      "email": "contact@example.test"
    },
    "socialLinks": {
      "linkedin": "#",
      "instagram": "#"
    },
    "discount": {
      "percentage": 15,
      "description": "-15% sur les séances pour les adhérent·es de l'association. Pour en savoir plus, merci de contacter directement la professionnelle."
    }
  }
}
```

All people and organizations generated specifically for the prototype should be clearly fictional unless they are existing association content deliberately supplied later by the developer.

Use `.test`, `#`, or obvious placeholder URLs where appropriate.

---

# 32. Example full JSON record: cultural content

```json
{
  "id": "content-001",
  "slug": "comprendre-la-fatigue-persistante",
  "resourceType": "cultural_content",
  "title": "Comprendre la fatigue persistante",
  "shortDescription": "Un guide accessible pour comprendre les mécanismes de la fatigue et mieux organiser son quotidien.",
  "image": "/images/placeholders/content-01.jpg",
  "objectives": ["s_informer", "mieux_vivre_au_quotidien"],
  "disorderCategories": ["troubles_fatigue"],
  "themes": ["fatigue", "gestion_du_quotidien"],
  "searchKeywords": ["fatigue chronique", "EM/SFC"],
  "pricing": "free",
  "isFeatured": true,
  "recommendedBy": "Léa, membre de la communauté",
  "isAssociationPartner": false,
  "hasUpcomingAssociationEvent": false,
  "baseRelevance": 72,
  "publishedAt": "2026-04-10",
  "ratingAverage": 4.3,
  "reviewCount": 8,
  "externalUrl": "#",
  "culturalContent": {
    "authors": ["Camille Martin"],
    "hasMultipleAuthors": false,
    "format": "practical_guide",
    "genre": "practical",
    "pointOfView": "practitioner",
    "mainTheme": "fatigue",
    "description": "Ce guide propose des repères simples autour de la fatigue persistante, de la gestion de l'énergie et de l'organisation des activités.",
    "proposerOpinion": "Une ressource claire pour commencer à mettre des mots sur la fatigue et discuter de stratégies concrètes.",
    "links": [
      {
        "label": "Consulter la ressource",
        "url": "#"
      }
    ]
  }
}
```

---

# 33. Recommended filter test scenarios

The prototype must make the following scenarios easy to test during a client meeting.

## Scenario A: professional search

1. Select `Professionnels`.
2. Professional-specific filters appear.
3. Select `Suisse`.
4. Select `Visio`.
5. Select `Troubles liés à la fatigue`.
6. Result set should clearly shrink.

## Scenario B: cultural content

1. Switch from `Professionnels` to `Contenus`.
2. Country/consultation-specific UI disappears or becomes irrelevant.
3. Media-format filters appear.
4. Choose `Podcast` or `Guide pratique`.

## Scenario C: cumulative values

Select:

- Switzerland;
- remote OR hybrid;
- fatigue OR vestibular disorders.

The result set should demonstrate OR within dimensions and AND across dimensions.

## Scenario D: relevance priority

Use relevance sorting and show that:

- an upcoming association event;
- or an association partner;

can cause a resource to appear earlier.

## Scenario E: no exact match

Either choose a deliberately incompatible set of filters, or type a disease name that no resource covers.

Display:

- no exact result message;
- "Proposer une ressource" CTA;
- "Signaler l'absence de ressource sur ma maladie" CTA and its confirmation;
- relaxed results.

## Scenario F: contribution

Navigate to "Proposer une ressource", select a type, fill minimal fields and submit.

Show a success state without persistence.

## Scenario G: candidate resource types

Show the "Outils pratiques" and "Programmes et formations" records, and discuss whether they should be top-level tabs, formats of cultural content, or support-space categories.

## Scenario H: trust signals

Compare a partner resource, a resource with an upcoming circle and a plain resource side by side, and confirm that the two badges read as two different things and that neither reads as a quality mark.

---

# 34. Suggested component structure

Keep the component tree straightforward.

Example:

```text
components/
  Header.tsx
  SearchBar.tsx
  ResourceTypeTabs.tsx
  FilterSidebar.tsx
  FilterGroup.tsx
  ActiveFilterChips.tsx
  SortSelect.tsx
  ResourceGrid.tsx
  ResourceCard.tsx
  EmptyState.tsx
  LoadMoreButton.tsx
  FeaturedResources.tsx
  ResourceDetail.tsx
  ProfessionalDetails.tsx
  CulturalContentDetails.tsx
  SupportSpaceDetails.tsx
  InstitutionDetails.tsx
  ContributionForm.tsx
```

Do not split every 10 lines into a component.

Optimize for comprehension.

---

# 35. Suggested utility structure

Keep behavior in a few easy-to-find functions.

Example:

```text
lib/
  filters.ts
  sorting.ts
  search.ts
```

Potential functions:

```ts
filterResources(resources, filters)
searchResources(resources, query)
sortResources(resources, sortMode, query)
getRelaxedSuggestions(resources, filters)
```

Avoid over-engineering.

---

# 36. State model

A simple prototype filter state is enough.

Example:

```ts
interface FilterState {
  resourceType: string | null;
  objectives: string[];
  disorderCategories: string[];
  pricing: string[];

  countries: string[];
  consultationModes: string[];
  professionalFamilies: string[];
  specialties: string[];

  mediaFormats: string[];
  mediaGenres: string[];
  pointsOfView: string[];

  supportCategories: string[];
  institutionCategories: string[];
}
```

Not every property must always be visible.

When changing resource type, prefer keeping compatible global filters and clearing only filters that no longer apply if that behavior is understandable.

This behavior should be easy to adjust after client feedback.

---

# 37. Visual direction

This is a wireframe-to-interactive-prototype phase, not final visual design.

The interface should nevertheless be clean enough for a client presentation.

Use:

- calm neutral palette;
- strong spacing hierarchy;
- accessible contrast;
- simple cards;
- rounded but restrained controls;
- readable typography;
- clear active states;
- visually distinct filter chips;
- subtle hover states;
- visible badges for partner/event/featured states.

Avoid:

- excessive gradients;
- decorative animation;
- complex glassmorphism;
- oversized marketing effects;
- unnecessary visual noise.

Do not spend large amounts of code on pixel-perfect branding.

The purpose is requirement validation.

---

# 38. Accessibility expectations for the prototype

This prototype is shown to a disability association, for a product the brief describes as "un outil numérique inclusif". Accessibility is part of the demonstration, not a later concern — a visibly inaccessible prototype sends the wrong signal in this workshop.

Required:

- real buttons for actions;
- labels for inputs;
- visible focus styles;
- keyboard-accessible filters, including the "Plus de filtres" disclosure;
- sufficient color contrast;
- do not encode all state through color only — badges carry text, not just color;
- use meaningful headings;
- use alt text or empty alt text appropriately for placeholder/decorative imagery;
- respect `prefers-reduced-motion`;
- keep the number of clicks and the reading load low: the brief explicitly targets "réduction de la charge mentale".

Do not perform a full production accessibility audit.

One open question worth raising: the brief lists "lieux de loisirs/culturels accessibles et inclusifs" as a resource category, but no accessibility attributes exist anywhere in the filters (step-free access, quiet space, seating, etc.). This may be a missing filter dimension for physical places.

---

# 39. Responsive behavior

Desktop is the primary workshop target.

Still make the prototype reasonably usable at narrow widths.

Suggested behavior:

- desktop: sidebar filters + result grid;
- tablet/mobile: filters collapse into a drawer/sheet or expandable section;
- cards become one column or two columns depending on width;
- resource details stack vertically.

Do not spend disproportionate effort on rare responsive edge cases.

---

# 40. Images

Do not introduce an image CMS or remote image pipeline.

Use:

- local placeholders;
- generated neutral placeholder assets;
- or simple CSS image placeholders.

Avoid using real professionals' photos for fictional records.

The prototype must remain legally and conceptually unambiguous.

---

# 41. URL/state behavior

Optional but recommended if it stays simple:

Represent useful search state in the URL.

Example:

```text
/search?type=professional&country=CH&mode=remote&disorder=troubles_fatigue
```

Benefits:

- developer can share a precise scenario with the client;
- page refresh can preserve the demonstrated search state;
- workshop comments can reference a specific URL.

Do not implement a complex query-state framework merely for this.

---

# 42. Validation / workshop mode

The prototype should support a client workshop where the developer can rapidly move through flows.

Therefore prioritize:

- predictable seeded results;
- clearly visible active filters;
- obvious state changes;
- easy reset;
- deterministic sorting;
- very fast navigation;
- no loading delays;
- no external dependency that can fail during the meeting.

---

# 43. Code-quality constraints

The code should be clean but intentionally modest.

Required:

- TypeScript types for resource shapes;
- clear naming;
- small number of dependencies;
- no unused infrastructure;
- comments only where business/prototype behavior is not obvious;
- readable filtering code;
- no duplicated hard-coded filter labels if they can trivially come from taxonomy data.

Not required:

- enterprise architecture;
- domain-driven design layers;
- unit tests for trivial UI;
- end-to-end suite;
- production error telemetry.

If tests are added, restrict them to the filtering logic and only if this takes little effort.

---

# 44. Important modeling principle

The prototype storage mechanism is intentionally primitive, but the **shape of the test data should remain conceptually close to the future domain**.

Do not confuse:

```text
DATA MODEL ≠ STORAGE TECHNOLOGY
```

The use of JSON does not mean that the data should be a flat collection of random UI strings.

The JSON should make it possible to discuss:

- common resource fields;
- resource-specific data;
- transversal taxonomy;
- contextual filters;
- future relational concerns.

This is one of the main learning outcomes of the prototype.

---

# 45. Behaviors that must be easy to change

Write the implementation so that the following can be changed quickly after a client meeting:

- resource type labels;
- **whether a candidate type is a tab, a format or a category**;
- taxonomy values;
- which filters are visible;
- quick filters vs advanced filters;
- filter placement (top bar vs sidebar);
- which trust badges are displayed;
- AND/OR semantics;
- card metadata;
- sorting options;
- priority bonuses;
- how highlighted resources are surfaced;
- no-results fallback;
- contribution fields.

Avoid encoding these decisions in many scattered components.

---

# 46. Acceptance criteria

The prototype is complete when all of the following are true.

## Home

- user sees the Invisithèque proposition;
- user can search;
- user can select resource type;
- user sees representative quick filters;
- user sees featured resources.

## Search

- user can filter static JSON resources;
- multiple filters can be combined;
- relevant contextual filters change based on resource type;
- active filters are visible;
- filters can be reset;
- search query affects results;
- result count updates;
- sorting changes order;
- primary filters are visible and secondary filters sit behind "Plus de filtres";
- cards display representative metadata, including partner/event/discount badges;
- load-more works;
- no-result state is demonstrable, with both the "proposer" and "signaler" CTAs;
- searching a precise disease name returns the matching broad category;
- user can reach contribution flow.

## Detail

- cards open the detail page in the same tab, and Back restores the search;
- every resource type has an understandable detail presentation;
- professional-specific information is shown;
- content-specific information is shown;
- support/institution information is shown;
- external CTA is visible;
- user can return to results.

## Contribution

- basic proposal form exists;
- type selection can change visible fields if useful;
- basic validation is simulated;
- submit shows success state;
- nothing is persisted.

## Technical

- static JSON only;
- no database;
- no backend dependency;
- deployable to Vercel;
- code remains small and easy to discard.

---

# 47. Recommended implementation order

Implement in this sequence:

1. project scaffold;
2. TypeScript resource types;
3. taxonomy JSON;
4. 18-resource seed dataset;
5. basic app shell/header;
6. result card and grid;
7. search results page;
8. filter state and filtering logic;
9. contextual filters;
10. sorting;
11. active-filter chips/reset;
12. resource detail pages;
13. home page;
14. no-results/relaxed-results state;
15. contribution form;
16. load-more;
17. optional Step 3 demo interactions;
18. responsive cleanup;
19. final pass focused on workshop clarity.

Do not begin by building infrastructure.

---

# 48. Final instruction to the coding agent

Before coding, summarize your understanding of:

1. what the prototype is meant to validate;
2. what is explicitly out of scope;
3. the proposed file/data structure;
4. the interaction scenarios you will support.

Then implement the prototype.

During implementation, prefer the simplest solution that convincingly demonstrates the behavior.

If a choice is ambiguous, favor **prototype clarity and editability** over production realism.

Do not add a database.

Do not add authentication.

Do not build a real backend.

Do not make the prototype more complex simply because the framework can support it.

The desired outcome is a **small, deterministic, interactive client-validation tool** that makes Invisithèque requirements concrete before the production application is built.

The production stack is not decided by this document and is not implied by the prototype's choice of Next.js.

---

# 49. Open questions for the client workshop

These are unresolved points where the prototype takes a position that the brief does not confirm. Bring them to the meeting explicitly.

1. **Resource types** — the brief's primary filter lists 6 types ("Professionnel, Contenu culturel, Outil pratique, Programmes/Formations, Lieu/association, Institution"), the catalog describes 4 families, and the fiches describe 3 structures. Which set drives the tabs?
2. **Practical tools and programs/trainings** — own type, format, or support-space category?
3. **Professional families vs specialties** — is the family level enough to filter on?
4. **Verification** — *closed in rev. 6*: the badge and the toggle filter were removed because the brief never asks for a per-resource verification label. Still open, upstream of the UI: what are the evaluation criteria, and who applies them?
5. **Filter placement** — top bar with expandable panel (as in the client's reference images) or left sidebar?
6. **Which filters are primary vs behind "Plus de filtres"?**
7. **Disease names** — filters use broad disorder types, but users search by disease name. Is a keyword mapping acceptable, and who maintains it?
8. **Signalling a missing resource** — separate from proposing one, or the same form?
9. **Reviews sorting** — the sort control is E2 but review data is E3. Ship the control in V1 or wait?
10. **Back-office fields** — objectives, disorder categories and pricing are required by the filters but absent from the brief's fiche field lists. Who fills them, and in which form?
11. **Accessibility attributes** for physical places — a missing filter dimension?
12. **New-tab opening** of resource pages — the brief asks for it, the prototype does the opposite and relies on URL state + Back (see 8.2). To confirm or overrule; outbound links keep the new tab either way.

