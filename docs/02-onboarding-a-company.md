# 02 — Company Onboarding (Setup করা)

কোম্পানি payment করেছে এবং information দিয়েছে। এখন **Super Admin হিসেবে আপনি login করে** তাদের জন্য সব setup করবেন।

> 🕐 **সময় লাগবে:** ছোট কোম্পানি — ৩০-৪৫ মিনিট। বড় কোম্পানি (multi-branch, অনেক role) — ১.৫-২ ঘন্টা।

---

## Step 0: Login

```
URL     : /login
Email   : (আপনার super admin email)
Password: (আপনার super admin password)
```

Login-এর পর `/dashboard`-এ চলে যাবেন। সব কিছু এখান থেকে control করবেন।

---

## Step 1: Branch তৈরি করুন

**Path:** `/branches`

কোম্পানির main office-টা প্রথম branch হিসেবে create করুন।

| Field | কী দিবেন |
| --- | --- |
| Branch Name | কোম্পানির নাম + "Main" (যেমন `ABC Trading — Main`) |
| Address | কোম্পানির ঠিকানা |
| Industry | কোন industry (পেলে) |
| Status | **Active** (toggle ON রাখবেন) |

### Sub-branch (যদি থাকে)

**Path:** `/branches/sub`

প্রতি sub-branch-এর জন্য আলাদা entry — parent branch select করতে হবে।

```
Main Branch (ABC Trading — Main)
  ├── Sub-Branch 1 (Dhaka Office)
  └── Sub-Branch 2 (Chittagong Office)
```

✅ **Checkpoint:** Branch list-এ ঢুকে দেখুন সব branch active দেখাচ্ছে।

---

## Step 2: Departments তৈরি করুন

**Path:** `/employees/departments`

সাধারণ departments যেগুলো প্রায় সব কোম্পানিতে লাগে:

```
[ ] Administration
[ ] Sales & Marketing
[ ] Accounts & Finance
[ ] Human Resources
[ ] IT / Technical
[ ] Operations
[ ] Customer Service
```

কোম্পানির information form থেকে actual department list নিয়ে create করবেন।

---

## Step 3: Designations তৈরি করুন

**Path:** `/employees/designations`

কোম্পানির পদ-নাম (job title) যেগুলো লাগবে:

```
[ ] Managing Director (MD)
[ ] General Manager (GM)
[ ] Manager
[ ] Assistant Manager
[ ] Senior Officer
[ ] Officer / Executive
[ ] Junior Executive
```

> Designation আর Role আলাদা জিনিস: **Designation** = job title (HR-এর জন্য), **Role** = কী permission আছে (system-এর জন্য)।

---

## Step 4: Roles + Permissions তৈরি করুন ⭐ (সবচেয়ে important step)

**Path:** `/employees/roles`

প্রতি কোম্পানির জন্য কমপক্ষে এই ৩টা role থাকা উচিত:

### Role 1: Company Admin

- **নাম:** `Company Admin`
- **Description:** কোম্পানির সর্বোচ্চ user — সব কিছু দেখতে ও edit করতে পারবে।
- **Permissions:** সব module-এ **Read + Create + Update + Delete**

> 💡 এই role-টা শুধু কোম্পানির মালিক / MD-কে দিবেন।

### Role 2: Manager

- **নাম:** `Manager`
- **Permissions:**
  - Dashboard, Employees, Customers, Products, Invoices → Read + Create + Update
  - Roles, Settings → ❌ (দেওয়া যাবে না)
  - Delete permissions → সাধারণত দিবেন না

### Role 3: Staff / Officer

- **নাম:** `Staff`
- **Permissions:**
  - নিজের কাজের সাথে related module-এ শুধু **Read + Create**
  - কিছুই delete করতে পারবে না

### Permission কীভাবে set করবেন

```
Roles list  →  Role-এর পাশে [Permissions] button  →  Modal খুলবে
  ↓
প্রতি module-এর জন্য চেক করুন:
  ☑ Read    ☑ Create    ☑ Update    ☐ Delete
  ↓
Save করে modal বন্ধ করুন।
```

✅ **Checkpoint:** কমপক্ষে ৩টা role create হয়েছে এবং প্রতিটাতে permission set আছে।

---

## Step 5: Company Admin Employee তৈরি করুন

**Path:** `/employees/new`

কোম্পানিকে যে login দিবেন তার জন্য employee record তৈরি করুন।

| Field | কী দিবেন |
| --- | --- |
| Full Name | Information form থেকে |
| Email | Information form থেকে (এটাই login email হবে) |
| Phone | Information form থেকে |
| Branch | Step 1-এ create করা main branch |
| Department | Administration |
| Designation | Managing Director / Owner |
| Role | **Company Admin** (Step 4-এ create করা) |
| Password | একটা strong password set করুন — handover-এ দিবেন |
| Status | **Active** |

✅ **Checkpoint:** `/employees`-এ গেলে এই new employee active অবস্থায় দেখাবে।

---

## Step 6: Subscription activate করুন

**Path:** `/subscriptions`

| Field | কী দিবেন |
| --- | --- |
| Company / Customer | যে কোম্পানিকে sell করছেন |
| Plan | কোন plan (Basic / Pro / Enterprise) |
| Start Date | আজকের তারিখ |
| End Date | Plan অনুযায়ী (১ মাস / ৬ মাস / ১ বছর) |
| Status | **Active** |

> ⚠️ Subscription expire হলে কোম্পানির login automatically restricted হবে।

---

## Step 7: Initial Master Data setup (Optional, কিন্তু recommended)

কোম্পানি যেন handover-এর পরই কাজ শুরু করতে পারে — সেজন্য কিছু base data আপনি আগেই দিয়ে রাখতে পারেন।

| Module | Path | কী দিবেন |
| --- | ---- | --- |
| Categories | `/categories` | তাদের product line অনুযায়ী category |
| Sub-Categories | `/categories/sub` | প্রতিটা category-র child |
| Work Types | `/work-types` | যদি service কোম্পানি হয় — service type list |

> এগুলো না দিলেও সমস্যা নেই — কোম্পানি নিজেই add করতে পারবে।

---

## Step 8: Final QA — Setup ঠিক আছে কিনা check

Handover-এর আগে নিজেই login করে check করুন:

- [ ] `/branches` — branch দেখাচ্ছে ও active
- [ ] `/employees/departments` — সব department আছে
- [ ] `/employees/designations` — সব designation আছে
- [ ] `/employees/roles` — সব role আছে এবং permission সঠিক
- [ ] `/employees` — company admin employee active
- [ ] `/subscriptions` — subscription active এবং expiry সঠিক

### Test login দিন

নতুন তৈরি করা Company Admin credentials দিয়ে **incognito window**-এ login করুন:

- [ ] Login হচ্ছে
- [ ] Dashboard দেখাচ্ছে
- [ ] সব module accessible (Company Admin role-এ যা permission দিয়েছেন সেই অনুযায়ী)
- [ ] Logout করে আবার Super Admin login-এ ফিরে যান

✅ সব tick হলে → পরবর্তী: [03-handover.md](./03-handover.md)

---

## যা **এড়িয়ে চলবেন**

| ভুল | কেন এড়াবেন |
| --- | --- |
| Company Admin-কে Super Admin role দেওয়া | তারা আপনার অন্য client-এর data দেখে ফেলবে |
| Password mail-এ plain text পাঠানো | Security risk — handover meeting-এ মুখে বা SMS-এ দিন |
| Subscription expiry না set করা | বিনামূল্যে চিরকাল ব্যবহার করতে পারবে |
| Permission না দিয়ে role create করা | User login করলেও কিছু দেখবে না — confused হয়ে যাবে |
| Branch তৈরি না করে employee create করার চেষ্টা | Form-এ branch dropdown empty থাকবে |
