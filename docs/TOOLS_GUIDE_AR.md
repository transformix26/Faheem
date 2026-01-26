# دليل أدوات وخصائص مشروع "فهيم"

## 1. هيكلية المشروع (Project Structure)
المشروع مبني باستخدام **Next.js App Router**. إليك أهم المجلدات:
- **`/app`**: يحتوي على الصفحات والـ Routes. أي مجلد هنا يمثل رابطاً في الموقع (مثال: `app/dashboard` = `your-site.com/dashboard`).
- **`/components`**: يحتوي على جميع عناصر الواجهة (Buttons, Navbar, Sidebar...).
- **`/lib`**: يحتوي على الأدوات المساعدة (Contexts, API Clients) مثل `auth-context` و `language-context`.
- **`/docs`**: يحتوي على ملفات التوثيق والشرح.

---

## 2. كيفية إضافة أدوات وخصائص جديدة (Features)

### إضافة صفحة جديدة (New Page)
1. اذهب لمجلد `/app`.
2. أنشئ مجلداً جديداً باسم الصفحة (مثال: `analytics`).
3. بداخل المجلد، أنشئ ملف `page.tsx`.
4. اكتب الـ Component الخاص بك (مثل `export default function AnalyticsPage() {...}`).

### إضافة مكون جديد (New Component)
1. اذهب لمجلد `/components`.
2. أنشئ ملفاً جديداً (مثال: `MyChart.tsx`).
3. استخدمه داخل أي صفحة عن طريق الاستيراد: `import { MyChart } from '@/components/MyChart'`.

---

## 3. دليل الترجمة (Translation Guide)
المشروع يدعم العربية والإنجليزية بالكامل باستخدام `LanguageContext`.

### أين ملف الترجمة؟
الملف المسؤول عن جميع النصوص هو:
**`lib/language-context.tsx`**

### كيفية إضافة ترجمة جديدة (Adding Translations):
1. افتح الملف `lib/language-context.tsx`.
2. ستجد كائناً (Object) اسمه `translations` يحتوي على `en` و `ar`.
3. أضف المفتاح الجديد في **كلا القسمين**.
   *   مثال: تريد إضافة زر "تنزيل".
   *   أضف في `en`: `'action.download': 'Download',`
   *   أضف في `ar`: `'action.download': 'تنزيل',`

### كيفية استخدامه في الكود (Usage):
داخل أي ملف `.tsx`:
```tsx
import { useLanguage } from '@/lib/language-context'

export function MyComponent() {
  const { t } = useLanguage()
  
  return <button>{t('action.download')}</button>
}
```

---

## 4. المكونات الجاهزة (UI Library)
المشروع يستخدم مكتبة **Shadcn UI** وموجودة في مجلد `components/ui`.
تحتوي على أزرار جاهزة، حقول إدخال، نوافذ منبثقة (Dialogs)، وغيرها.
*   للزر: `import { Button } from '@/components/ui/button'`
*   للحقل النصي: `import { Input } from '@/components/ui/input'`

---

## 5. ملاحظات هامة
*   **اتجاه النص (RTL/LTR)**: يتم التعامل معه تلقائياً بناءً على اللغة المختارة. الـ `navbar` و `footer` وأي مكون يستخدم `isRTL` سيعكس اتجاهه تلقائياً.
*   **إدارة الحالة (State)**:
    *   بيانات المستخدم: `useAuth()`
    *   بيانات البوت: `useBotContext()`
    *   اللغة: `useLanguage()`
