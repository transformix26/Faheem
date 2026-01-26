# دليل مشروع "فهيم" (Faheem Project Guide)

## 1. نظرة عامة على المشروع (Project Overview)
هذا المشروع عبارة عن **لوحة تحكم (Dashboard)** لإدارة مساعد ذكي (Chatbot) يسمى **"فهيم"**. 
المشروع مبني باستخدام أحدث التقنيات:
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS v4 + Shadcn UI
- **Language**: TypeScript

### محتويات المشروع الحالية:
1. **واجهة المستخدم (UI/UX)**:
   - نظام تسجيل الدخول وإنشاء الحساب (`login`, `register`).
   - لوحة تحكم تعرض الإحصائيات (الرسائل، المستخدمين، الأداء).
   - دعم للغتين (العربية والإنجليزية) عبر `LanguageContext`.
2. **إدارة الحالة (State Management)**:
   - `AuthContext`: لإدارة حالة المستخدم وتسجيل الدخول.
   - `BotContext`: لإدارة بيانات البوت النشط.

---

## 2. النواقص وما يحتاجه المشروع (Missing Parts)
المشروع حالياً يمثل **الواجهة الأمامية (Frontend)** فقط. لكي يعمل بشكل كامل، يحتاج إلى:

1. **سيرفر Backend (Node.js)**:
   - لمعالجة تسجيل الدخول وتخزين البيانات في قاعدة بيانات (مثل MongoDB أو PostgreSQL).
   - حالياً، المشروع يتوقع وجود API على المسار `/api`.

2. **ربط الـ API**:
   - جميع الطلبات (Requests) تخرج من `lib/api-client.ts` وتنتظر استجابة حقيقية.

---

## 3. الربط مع الـ Backend (Node.js Integration)
عندما تقوم ببناء السيرفر الخاص بك (Node.js)، هناك طريقتان للربط:

### الخيار الأفضل: استخدام Next.js Rewrites (Proxy)
لتجنب مشاكل الـ CORS، يمكنك إعداد Next.js ليعمل كجسر (Proxy) يمرر الطلبات إلى سيرفر الـ Node.js الخاص بك.

**الخطوات:**
1. افتح ملف `next.config.mjs`.
2. أضف إعدادات الـ `rewrites` لتوجيه أي طلب يبدأ بـ `/api` إلى سيرفرك (مثلاً الذي يعمل على المنفذ 3001).

```javascript
// next.config.mjs
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*', // رابط السيرفر الخاص بك
      },
    ]
  },
};
export default nextConfig;
```

بهذا الشكل، عندما يطلب الـ Frontend الرابط `/api/auth/login`، سيقوم Next.js بتحويله داخلياً إلى `http://localhost:3001/api/auth/login`.

---

## 4. نظام تسجيل الدخول والتوكن (Login & Token Strategy)
هذا الجزء مهم جداً وتم تصميمه في الملف `lib/auth-context.ts` و `lib/api-client.ts` ليتبع أفضل معايير الأمان.

### أين يتم تخزين التوكن؟ (Token Storage)

المشروع يستخدم استراتيجية **Dual Token** (توكن الوصول وتوكن التجديد):

1. **Access Token (توكن الوصول):**
   - **أين يُحفظ؟**: في **الذاكرة فقط (React State)** داخل المتغير `accessToken` في `AuthContext`.
   - **لماذا؟**: لزيادة الأمان. إذا تم اختراق المتصفح (XSS)، لا يمكن للمهاجم سرقة التوكن من LocalStorage لأنه غير موجود هناك.
   - **أمانه**: يضيع عند تحديث الصفحة (Refresh)، لذلك نعتمد على الـ Refresh Token لاستعادته.

2. **Refresh Token (توكن التجديد):**
   - **أين يُحفظ؟**: يجب أن يُرسل من الـ Backend داخل **HttpOnly Cookie**.
   - **لماذا؟**: الـ Cookie من نوع HttpOnly لا يمكن قراءته بواسطة كود JavaScript في المتصفح، مما يحميه من السرقة.
   - **وظيفته**: عند تحديث الصفحة أو انتهاء صلاحية الـ Access Token، يقوم الفرونت إند بطلب `/api/auth/refresh`، ويقوم المتصفح بإرسال الـ Cookie تلقائياً للسيرفر ليتحقق منه ويرسل Access Token جديد.

3. **User Data (بيانات المستخدم):**
   - **أين تُحفظ؟**: في **LocalStorage** تحت اسم `faheem_user`.
   - **المحتوى**: الاسم، الإيميل، الحالة (غير حساسة). تستخدم فقط لعرض البيانات بسرعة عند فتح الموقع.

### ملخص لكيفية عمل الـ Backend المطلوب:

يجب أن يوفر السيرفر (Node.js) الروابط التالية (Endpoints):

| الـ Endpoint | الطريقة | الوظيفة المتوقعة |
| --- | --- | --- |
| `/api/auth/login` | POST | يستقبل `email` و `password`. يرجع `accessToken` (JSON) و `refreshToken` (Cookie). |
| `/api/auth/register` | POST | إنشاء حساب جديد. يرجع نفس ما يرجعه الـ Login. |
| `/api/auth/refresh` | POST | يتحقق من الـ Cookie ويرجع `accessToken` جديد. |
| `/api/auth/logout` | POST | يقوم بمسح الـ Refresh Token Cookie. |
| `/api/auth/onboarding` | POST | لحفظ تفضيلات المستخدم الجديد. |

### كود مقترح للـ Backend (Express.js Example) لإرسال الكوكيز:

```javascript
// مثال لكيفية إرسال التوكن من الباك إند
app.post('/api/auth/login', (req, res) => {
  // ... التحقق من المستخدم ...

  // 1. إنشاء التوكنات
  const accessToken = jwt.sign({ id: user.id }, 'access_secret', { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id }, 'refresh_secret', { expiresIn: '7d' });

  // 2. إرسال Refresh Token في HttpOnly Cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  // 3. إرسال Access Token في الـ JSON Response
  res.json({
    accessToken,
    user: { id: user.id, email: user.email, ... }
  });
});
```
