# Faheem Project Tools & Features Guide

## 1. Project Structure
The project is built using **Next.js App Router**. Key directories include:
- **`/app`**: Contains pages and routes. Any folder here represents a URL path (e.g., `app/dashboard` = `your-site.com/dashboard`).
- **`/components`**: Contains all UI elements (Buttons, Navbar, Sidebar...).
- **`/lib`**: Contains utilities and contexts (Auth, Language, API helpers) like `auth-context` and `language-context`.
- **`/docs`**: Contains documentation and guides.

---

## 2. How to Add New Features

### Adding a New Page
1. Go to the `/app` folder.
2. Create a new folder with the page name (e.g., `analytics`).
3. Inside it, create a `page.tsx` file.
4. Write your component (e.g., `export default function AnalyticsPage() {...}`).

### Adding a New Component
1. Go to the `/components` folder.
2. Create a new file (e.g., `MyChart.tsx`).
3. Use it in any page via import: `import { MyChart } from '@/components/MyChart'`.

---

## 3. Translation Guide
The project fully supports Arabic & English using `LanguageContext`.

### Where is the translation file?
The file managing all texts is:
**`lib/language-context.tsx`**

### Adding New Translations:
1. Open `lib/language-context.tsx`.
2. Find the `translations` object containing `en` and `ar`.
3. Add your new key to **BOTH sections**.
   *   Example: Adding a "Download" button.
   *   In `en`: `'action.download': 'Download',`
   *   In `ar`: `'action.download': 'تنزيل',`

### Usage in Code:
Inside any `.tsx` file:
```tsx
import { useLanguage } from '@/lib/language-context'

export function MyComponent() {
  const { t } = useLanguage()
  
  return <button>{t('action.download')}</button>
}
```

---

## 4. UI Component Library
The project uses **Shadcn UI**, located in `components/ui`.
 It includes pre-styled buttons, inputs, dialogs, etc.
*   Button: `import { Button } from '@/components/ui/button'`
*   Input: `import { Input } from '@/components/ui/input'`

---

## 5. Important Notes
*   **RTL/LTR Support**: Handled automatically based on the selected language. Components like `navbar` and `sidebar` adjust their direction automatically.
*   **State Management**:
    *   User Data: `useAuth()`
    *   Bot Data: `useBotContext()`
    *   Language: `useLanguage()`
