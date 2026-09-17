# Invisithèque — Data Model (production, E1 + E2)

PostgreSQL / Django schema for the full **E1 + E2** scope, mirroring the prototype's
`BaseResource` + detail shape (`prototype/lib/types.ts`). Étape 3 is shown separately,
as an extension that attaches without migrating anything.

Renders natively on GitHub; paste into [mermaid.live](https://mermaid.live) to export PNG/SVG.

## V1 schema (E1 + E2)

```mermaid
erDiagram
    resource {
        int id PK
        varchar slug UK
        enum resource_type "professional | cultural_content | support_space | institution_partner"
        varchar title
        text short_description
        varchar image
        enum pricing "free | paid | mixed"
        bool is_verified_by_association
        bool is_association_partner
        bool is_featured
        bool is_published
        datetime published_at
        varchar external_url
    }

    taxonomy_term {
        int id PK
        enum kind "objective | disorder | media_format | media_genre | point_of_view | place_category | professional_family"
        varchar slug "UNIQUE(kind, slug)"
        varchar label "French, inclusive writing"
        varchar short_label
        int parent_id FK "self, nullable"
    }

    professional_details {
        int resource_id PK, FK "1:1 with resource"
        varchar first_name
        varchar last_name
        int family_id FK "taxonomy_term (3 familles)"
        enum country "CH | FR | BE | CA"
        varchar city
        enum_array consultation_modes "in_person | remote | hybrid"
        varchar presentation "max 400 chars"
        varchar website
        varchar booking_url
        varchar phone
        varchar email
        json social_links "display-only"
        int discount_pct "nullable, macaron"
        varchar discount_text "1 short sentence"
        int upcoming_circle_id FK "agenda.Event, nullable (E2 boost)"
    }

    specialty {
        int id PK
        int professional_id FK
        varchar label
        varchar description "max 400 chars"
        int position "1..3"
    }

    cultural_content_details {
        int resource_id PK, FK "1:1 with resource"
        text_array authors "front renders 'et cie' if 3+"
        int format_id FK "taxonomy_term"
        int genre_id FK "taxonomy_term, nullable"
        int point_of_view_id FK "taxonomy_term, nullable"
        varchar main_theme
        varchar description "max 400 chars"
        varchar proposer_opinion "max 400 chars"
        json links "display-only, list of label+url"
    }

    place_details {
        int resource_id PK, FK "1:1 with resource; dispositifs AND institutions"
        int category_id FK "taxonomy_term"
        enum delivery_mode "in_person | digital | hybrid"
        enum country "nullable"
        varchar city
        varchar presentation "max 400 chars"
        varchar why_it_helps "max 400 chars"
        varchar website
        json social_links "display-only"
    }

    search_keyword {
        int id PK
        int resource_id FK
        varchar term "precise disease name - searched, never filtered"
    }

    resource_proposal {
        int id PK
        enum resource_type
        json payload "free-form until Verification"
        enum status "proposed | in_review | published | rejected"
        datetime created_at
    }

    missing_resource_signal {
        int id PK
        varchar text "max 300 - health data, anonymous: no user FK, no IP"
        json search_context "query + active filters at signal time"
        datetime created_at
    }

    agenda_event {
        int id PK "existing agenda app, not part of this schema"
    }

    resource ||--o| professional_details : "if type = professional"
    resource ||--o| cultural_content_details : "if type = cultural_content"
    resource ||--o| place_details : "if type = support_space / institution"
    resource ||--o{ search_keyword : "has"
    professional_details ||--o{ specialty : "max 3"
    resource }o--o{ taxonomy_term : "objectives (M2M)"
    resource }o--o{ taxonomy_term : "disorder_categories (M2M)"
    professional_details }o--|| taxonomy_term : "family"
    cultural_content_details }o--|| taxonomy_term : "format"
    cultural_content_details }o--o| taxonomy_term : "genre"
    cultural_content_details }o--o| taxonomy_term : "point_of_view"
    place_details }o--|| taxonomy_term : "category"
    taxonomy_term |o--o{ taxonomy_term : "parent"
    professional_details }o--o| agenda_event : "upcoming cercle (nullable FK)"
    resource_proposal }o..o| resource : "on Publication, creates"
```

`missing_resource_signal` is deliberately unlinked: anonymous by design.

## Étape 3 extension (planned, not built)

Each E3 feature arrives as a new table with FKs to `resource` — nothing in the V1
schema needs migrating.

```mermaid
erDiagram
    user_account {
        int id PK
    }
    review {
        int id PK
        int user_id FK
        int resource_id FK
        int rating
        text comment
    }
    favorite {
        int user_id FK
        int resource_id FK
    }
    saved_search {
        int id PK
        int user_id FK
        json filters "search history"
    }
    consultation_log {
        int user_id FK "deja vu / lu / consulte"
        int resource_id FK
    }
    resource {
        int id PK "existing V1 table"
    }

    user_account ||--o{ review : ""
    resource ||--o{ review : ""
    user_account ||--o{ favorite : ""
    resource ||--o{ favorite : ""
    user_account ||--o{ saved_search : ""
    user_account ||--o{ consultation_log : ""
    resource ||--o{ consultation_log : ""
```

## Design decisions this schema encodes

1. **OneToOne detail tables** (not Django multi-table inheritance, not one wide table):
   per-type required fields stay enforceable, admin stays per-fiche, the search view is
   one query with three `select_related`.
2. **Fixed semantics = ENUM, client-editable wording = `taxonomy_term` row**: pricing,
   country, consultation/delivery modes are code; everything the workshop may rename
   (objectives, troubles, formats, genres, points de vue, familles, categories) is data,
   edited in the admin — no migration to change a label.
3. **JSON only where nothing filters**: social links and content links are display-only;
   every faceted dimension is a real column or M2M.
4. **No relevance score column**: E2 sorting is `ORDER BY` on the flags
   (`upcoming_circle_id IS NOT NULL`, `is_association_partner`, `is_featured`) then
   `published_at`; a scored model can be added later without touching the schema.
5. **E3-ready, not E3-built**: accounts, avis, favoris and « déjà vu » each land as new
   tables pointing at `resource`.
