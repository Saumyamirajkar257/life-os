# SearchResults Composite Component

## Purpose
The `SearchResults` component displays search output lists grouped by categories with query counters, skeleton loaders, and empty states.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `query` | `string` | Required | Active search query string |
| `results` | `SearchResultItem[]` | Required | List of search items |
| `isLoading` | `boolean` | `false` | Shows loading skeleton |

## Usage Example
```tsx
import { SearchResults } from '@/components/composite/search-results';

<SearchResults
  query="Theme Engine"
  results={[
    { id: '1', title: 'Theme Switcher', category: 'Components', onClick: () => {} }
  ]}
/>
```
