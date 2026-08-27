# L'Invisithèque — prototype

Throwaway interactive UI prototype for **L'Invisithèque**, a curated directory of trustworthy
resources for people living with invisible illnesses and disabilities (association *Les Invisibles*).

Built to validate information architecture, filters and detail pages in a client workshop.
Not the production app: static JSON only, no database, no accounts, no backend.
The interface is in French; the code is in English.

## Run

```bash
make run      # dev server on http://localhost:3000
make build    # production build
make check    # TypeScript + ESLint
make help     # all targets
```

Requires Node and npm; `make` installs dependencies on first run.

## Layout

| Path | Contents |
|---|---|
| `prototype/` | The Next.js app — see [`prototype/README.md`](prototype/README.md) |
| `SPECS.md` | Implementation brief the prototype was built from |
| `root_data/` | Source documents from the association (git-ignored) |
| `Makefile` | Dev shortcuts |

## Where to change what

Everything the workshop is likely to challenge lives in a few files:

| Need | File |
|---|---|
| Visible French labels (types, objectives, disorders, formats…) | `prototype/data/taxonomy.json` |
| Demo dataset (26 resources) | `prototype/data/resources.json` |
| Visible filters, primary vs "Plus de filtres", tabs, ranking bonuses, page size | `prototype/lib/config.ts` |
| AND / OR semantics, relaxed suggestions | `prototype/lib/filters.ts` |
| Theme colors and badge tones | `prototype/app/globals.css` |

## Scope

Phases **E1** (type tabs, result grid, detail pages, no-result answers, load more) and **E2**
(cumulative and contextual filters, advanced disclosure, sorting, priority boosts) are fully
demonstrated. **E3** (accounts, reviews, favorites, saved searches) is visual simulation only and
labelled `démo` in the UI.

Open questions for the workshop are listed in `SPECS.md` section 49 and surfaced in the app at `/about`.
