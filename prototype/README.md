# L'Invisithèque — Next.js app

The interactive prototype itself. See the [root README](../README.md) for context and scope,
and [`SPECS.md`](../SPECS.md) for the implementation brief.

Stack: Next.js (App Router, static data only), TypeScript, Tailwind CSS 4, shadcn/ui.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint    # ESLint
```

Or use the Makefile at the repository root (`make run`, `make check`…).

## Structure

| Path | Contents |
|---|---|
| `app/` | Routes: home, `/search`, `/resources/[slug]`, `/contribute`, `/about` |
| `components/` | App components; `search/` and `detail/` sub-trees, `ui/` is shadcn/ui |
| `lib/` | Domain logic: `config.ts` (workshop knobs), `filters.ts`, `search.ts`, `sorting.ts`, `url.ts`, `data.ts`, `types.ts` |
| `data/` | The demo dataset: `resources.json` (33 records) and `taxonomy.json` (French labels) |

## Conventions

- The interface is in French; code, identifiers and comments are in English.
- All demo decisions likely to be challenged in the workshop live in `lib/config.ts`
  (visible filters, primary vs "Plus de filtres", ranking bonuses, page size).
- Phase E3 features (accounts, favorites, reviews) are visual simulation only,
  labelled `démo` in the UI — nothing is persisted or sent.
