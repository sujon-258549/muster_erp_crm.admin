# Super Admin Playbook

এই ফোল্ডারে Muster ERP/CRM এর **Super Admin** হিসেবে একটা নতুন কোম্পানিকে কীভাবে sell করবেন, onboard করবেন এবং handover করবেন — তার পুরো প্রক্রিয়া step-by-step লেখা আছে।

---

## কীভাবে পড়বেন

ফাইলগুলো **ক্রম অনুযায়ী** সাজানো — উপর থেকে নিচে পড়লেই হবে।

| # | File | কী আছে |
| - | ---- | ------ |
| 01 | [pre-sale.md](./01-pre-sale.md) | Sale-এর আগে কী prepare করতে হবে |
| 02 | [onboarding-a-company.md](./02-onboarding-a-company.md) | কোম্পানি যখন রাজি হয়ে গেছে — তখন platform-এ কীভাবে setup দিবেন |
| 03 | [handover.md](./03-handover.md) | কোম্পানিকে কী কী হাতে তুলে দিতে হবে |
| 04 | [post-sale.md](./04-post-sale.md) | বিক্রির পর support এবং follow-up |

---

## এক নজরে পুরো ফ্লো

```
Pre-Sale          →   Onboarding         →   Handover         →   Post-Sale
─────────             ──────────              ────────             ─────────
Demo দেখানো           Branch তৈরি             Login তুলে দেওয়া     Support
Plan বলা              Roles + Permission     Training            Renewal
Price quote          Departments             Documents           Upgrade
Agreement            Designations
                     Admin Employee
                     Subscription
```

---

## যা মাথায় রাখবেন

1. **প্রতিটা কোম্পানি = আলাদা setup।** এক কোম্পানির branch, employee, customer অন্য কোম্পানি দেখতে পাবে না।
2. **Super Admin শুধু আপনি।** কোম্পানিকে যে user দিবেন সেটা হবে **Company Admin** — তারা শুধু নিজেদের data দেখবে।
3. **Permission ঠিকমতো না দিলে module দেখাবে না।** Routes guard করা আছে `RequirePermission` দিয়ে।
4. **Subscription expire হলে access বন্ধ।** Plan এবং duration আগে থেকে confirm করে নিতে হবে।

---

## Quick links — অ্যাডমিন প্যানেলের routes

| কাজ | URL |
| --- | --- |
| Login | `/login` |
| Dashboard | `/dashboard` |
| Branches | `/branches` |
| Roles | `/employees/roles` |
| Designations | `/employees/designations` |
| Departments | `/employees/departments` |
| Employees | `/employees` |
| Subscriptions | `/subscriptions` |
| Settings | `/settings` |

পূর্ণ workflow এর জন্য root-এর [`WORKFLOW.md`](../../WORKFLOW.md) দেখুন।
