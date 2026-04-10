# Data Model

## Entities

### `LearningTheatreState`
- `status`: `'loading' | 'error' | 'empty' | 'playing'`
- `error`: `string | null`

### `DocumentControllerState`
State interface for managing VS Code style tabs and split views.
- `openDocuments`: `Array<{ id: string, title: string, url: string }>`  (List of active PDFs)
- `activeDocumentId`: `string | null`  (Main view identifier)
- `splitMode`: `boolean`  (Is split screen active?)
- `secondaryDocumentId`: `string | null`  (Secondary view identifier)

## Relationships

- `StudentDashboard` manages `LearningTheatre` and passes dynamic dimension props if needed.
- `LearningTheatre` hosts `LearningTheatreState`, containing the central `VideoPlayer` and the `DocumentControllerState`.
- `DocumentController` manages tabs, split pane toggling, and rendering the `<object>` PDF viewers.
