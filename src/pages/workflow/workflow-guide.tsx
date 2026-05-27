import { useState } from "react"
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  CreditCard,
  KeyRound,
  LogIn,
  Sparkles,
  UserCog,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Lang = "en" | "bn"

type Step = {
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
  path?: string
}

type Copy = {
  pageTitle: string
  pageSubtitle: string
  langEnglish: string
  langBangla: string

  hierarchy: {
    heading: string
    platform: { title: string; desc: string }
    branch: { title: string; desc: string }
    admin: { title: string; desc: string }
    employees: { title: string; desc: string }
  }

  platformFlow: {
    heading: string
    subtitle: string
    steps: Step[]
  }

  branchFlow: {
    heading: string
    subtitle: string
    steps: Step[]
  }

  permission: {
    heading: string
    rows: { who: string; sees: string }[]
  }

  tip: { title: string; lines: string[] }
}

const EN: Copy = {
  pageTitle: "Workflow Guide",
  pageSubtitle:
    "How the platform is sold, set up, and operated — from Platform Super Admin to Company employees.",
  langEnglish: "English",
  langBangla: "বাংলা",

  hierarchy: {
    heading: "The Hierarchy",
    platform: {
      title: "Platform Super Admin",
      desc: "You — the owner of Muster ERP. Sees and controls every company on the platform.",
    },
    branch: {
      title: "Company (= 1 Branch)",
      desc: "Each customer company is represented as a Branch with its own subscription.",
    },
    admin: {
      title: "Company Super Admin",
      desc: "One admin user you create under the branch. Full access — but only within their own branch.",
    },
    employees: {
      title: "Company Employees",
      desc: "Created and managed by the Company Super Admin. Access depends on the role assigned.",
    },
  },

  platformFlow: {
    heading: "Your job — Selling a new company",
    subtitle:
      "When a new customer comes in, you do these 4 steps. After that, you hand over the keys.",
    steps: [
      {
        icon: Building2,
        title: "1. Create a Branch",
        desc: "The company itself is created as a Branch (main office). Optionally add sub-branches later.",
        path: "/branches",
      },
      {
        icon: CreditCard,
        title: "2. Create a Subscription",
        desc: "Set the plan, start date, and expiry. When it expires, access is automatically restricted.",
        path: "/subscriptions",
      },
      {
        icon: UserCog,
        title: "3. Create the Company Super Admin",
        desc: "One employee under that branch with a 'Company Admin' role and full permissions inside their branch.",
        path: "/employees/new",
      },
      {
        icon: LogIn,
        title: "4. Hand over the login",
        desc: "Give the credentials to the customer. From this point, the Company Super Admin runs the show.",
      },
    ],
  },

  branchFlow: {
    heading: "Their job — After handover",
    subtitle:
      "Once handed over, the Company Super Admin builds their own org chart and starts operations. You no longer touch their data day-to-day.",
    steps: [
      {
        icon: LogIn,
        title: "1. Login",
        desc: "Logs in with the credentials you gave. Lands on Dashboard.",
        path: "/login",
      },
      {
        icon: Building2,
        title: "2. Departments",
        desc: "Creates departments — Sales, HR, Accounts, IT, etc.",
        path: "/employees/departments",
      },
      {
        icon: Sparkles,
        title: "3. Designations",
        desc: "Adds job titles — Manager, Officer, Executive, etc.",
        path: "/employees/designations",
      },
      {
        icon: KeyRound,
        title: "4. Roles + Permissions",
        desc: "Defines roles and decides exactly what each role can see and do across modules.",
        path: "/employees/roles",
      },
      {
        icon: Users,
        title: "5. Employees",
        desc: "Adds team members and assigns them a branch, department, designation, and role.",
        path: "/employees",
      },
      {
        icon: CheckCircle2,
        title: "6. Operations",
        desc: "From here on — Categories, Products, Inventory, Customers, Invoices. Daily business runs.",
      },
    ],
  },

  permission: {
    heading: "Who sees what",
    rows: [
      {
        who: "Platform Super Admin (you)",
        sees: "Every branch, every subscription, every employee — across all customer companies.",
      },
      {
        who: "Company Super Admin",
        sees: "Only their own branch — employees, customers, products, invoices belonging to that branch.",
      },
      {
        who: "Company Employee",
        sees: "Only the modules and actions allowed by their assigned role.",
      },
    ],
  },

  tip: {
    title: "Things you should not forget",
    lines: [
      "Each company = its own Branch. Don't mix companies into one branch.",
      "Never give the Platform Super Admin role to a customer — they'd see every other client's data.",
      "Subscription expiry is real — set it correctly or they get free lifetime access.",
      "The Company Super Admin handles their own permissions. You don't manage their employees day-to-day.",
    ],
  },
}

const BN: Copy = {
  pageTitle: "ওয়ার্কফ্লো গাইড",
  pageSubtitle:
    "প্ল্যাটফর্ম কীভাবে বিক্রি হয়, setup হয়, এবং চলে — Platform Super Admin থেকে শুরু করে কোম্পানির কর্মচারী পর্যন্ত।",
  langEnglish: "English",
  langBangla: "বাংলা",

  hierarchy: {
    heading: "হায়ারার্কি (কে কোথায়)",
    platform: {
      title: "Platform Super Admin",
      desc: "আপনি — Muster ERP-এর মালিক। সব কোম্পানি এবং সব data আপনার নিয়ন্ত্রণে।",
    },
    branch: {
      title: "কোম্পানি (= ১টা Branch)",
      desc: "প্রতিটা customer কোম্পানিকে আপনি একটা Branch হিসেবে তৈরি করবেন। Branch-এর নিজস্ব subscription থাকবে।",
    },
    admin: {
      title: "Company Super Admin",
      desc: "ওই Branch-এর নিচে একজন admin user — আপনি create করে দিবেন। তার নিজের branch-এর ভেতরে full access থাকবে।",
    },
    employees: {
      title: "কোম্পানির কর্মচারী",
      desc: "Company Super Admin নিজেই তাদের create ও manage করবে। Role অনুযায়ী access পাবে।",
    },
  },

  platformFlow: {
    heading: "আপনার কাজ — নতুন কোম্পানি sell করা",
    subtitle:
      "নতুন customer এলে আপনি এই ৪টা step করবেন। এর পরে চাবি customer-এর হাতে।",
    steps: [
      {
        icon: Building2,
        title: "১. Branch তৈরি করুন",
        desc: "কোম্পানির নামে একটা Branch (main office) create করুন। দরকার হলে পরে sub-branch add করতে পারবেন।",
        path: "/branches",
      },
      {
        icon: CreditCard,
        title: "২. Subscription তৈরি করুন",
        desc: "Plan, শুরুর তারিখ এবং expiry set করুন। Expire হলে customer-এর access automatically বন্ধ হবে।",
        path: "/subscriptions",
      },
      {
        icon: UserCog,
        title: "৩. Company Super Admin তৈরি করুন",
        desc: "ওই branch-এর under-এ একজন employee — 'Company Admin' role এবং পুরো branch-এর জন্য full permission দিন।",
        path: "/employees/new",
      },
      {
        icon: LogIn,
        title: "৪. Login handover করুন",
        desc: "Credentials customer-কে দিয়ে দিন। এর পর থেকে Company Super Admin নিজেই সব handle করবে।",
      },
    ],
  },

  branchFlow: {
    heading: "তাদের কাজ — Handover-এর পর",
    subtitle:
      "Handover-এর পর Company Super Admin নিজে নিজের org chart বানাবে এবং operation শুরু করবে। আপনি প্রতিদিন তাদের data-তে হাত দিবেন না।",
    steps: [
      {
        icon: LogIn,
        title: "১. Login",
        desc: "আপনার দেওয়া credentials দিয়ে login করবে। Dashboard দেখাবে।",
        path: "/login",
      },
      {
        icon: Building2,
        title: "২. Departments",
        desc: "Department create করবে — Sales, HR, Accounts, IT ইত্যাদি।",
        path: "/employees/departments",
      },
      {
        icon: Sparkles,
        title: "৩. Designations",
        desc: "Job title set করবে — Manager, Officer, Executive ইত্যাদি।",
        path: "/employees/designations",
      },
      {
        icon: KeyRound,
        title: "৪. Roles + Permissions",
        desc: "Role তৈরি করে ঠিক করবে — কোন role কোন module-এ কী করতে পারবে।",
        path: "/employees/roles",
      },
      {
        icon: Users,
        title: "৫. Employees",
        desc: "Team member add করবে এবং branch / department / designation / role assign করবে।",
        path: "/employees",
      },
      {
        icon: CheckCircle2,
        title: "৬. Operations",
        desc: "এখান থেকে — Categories, Products, Inventory, Customers, Invoices। দৈনিক ব্যবসা চলবে।",
      },
    ],
  },

  permission: {
    heading: "কে কী দেখবে",
    rows: [
      {
        who: "Platform Super Admin (আপনি)",
        sees: "সব Branch, সব Subscription, সব employee — সব customer-এর সব কিছু।",
      },
      {
        who: "Company Super Admin",
        sees: "শুধু নিজের Branch — তার নিজের employees, customers, products, invoices।",
      },
      {
        who: "কোম্পানির Employee",
        sees: "তার Role-এ যেসব module এবং action allow করা হয়েছে শুধু সেগুলো।",
      },
    ],
  },

  tip: {
    title: "যা ভুলবেন না",
    lines: [
      "প্রতিটা কোম্পানি = আলাদা Branch। এক branch-এ দুই কোম্পানি মেশাবেন না।",
      "Platform Super Admin role কোনো customer-কে দিবেন না — অন্য client-এর data দেখে ফেলবে।",
      "Subscription expiry সঠিকভাবে set করুন — না হলে বিনামূল্যে চিরকাল ব্যবহার করবে।",
      "Company Super Admin নিজেই তার permission সামলাবে। আপনি প্রতিদিন তাদের employee manage করবেন না।",
    ],
  },
}

const COPY: Record<Lang, Copy> = { en: EN, bn: BN }

export function WorkflowGuide() {
  const [lang, setLang] = useState<Lang>("en")
  const t = COPY[lang]

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">{t.pageTitle}</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">{t.pageSubtitle}</p>
        </div>
        <div className="inline-flex shrink-0 rounded-lg border bg-card p-1 shadow-xs">
          <LangButton active={lang === "en"} onClick={() => setLang("en")}>
            {EN.langEnglish}
          </LangButton>
          <LangButton active={lang === "bn"} onClick={() => setLang("bn")}>
            {EN.langBangla}
          </LangButton>
        </div>
      </header>

      <Section heading={t.hierarchy.heading}>
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-stretch">
          <HierarchyCard
            tone="primary"
            icon={Sparkles}
            title={t.hierarchy.platform.title}
            desc={t.hierarchy.platform.desc}
          />
          <Arrow />
          <HierarchyCard
            tone="indigo"
            icon={Building2}
            title={t.hierarchy.branch.title}
            desc={t.hierarchy.branch.desc}
          />
          <Arrow />
          <HierarchyCard
            tone="emerald"
            icon={UserCog}
            title={t.hierarchy.admin.title}
            desc={t.hierarchy.admin.desc}
          />
          <Arrow />
          <HierarchyCard
            tone="muted"
            icon={Users}
            title={t.hierarchy.employees.title}
            desc={t.hierarchy.employees.desc}
          />
        </div>
      </Section>

      <FlowSection
        heading={t.platformFlow.heading}
        subtitle={t.platformFlow.subtitle}
        steps={t.platformFlow.steps}
        accent="primary"
      />

      <FlowSection
        heading={t.branchFlow.heading}
        subtitle={t.branchFlow.subtitle}
        steps={t.branchFlow.steps}
        accent="emerald"
      />

      <Section heading={t.permission.heading}>
        <div className="overflow-hidden rounded-lg border bg-card">
          {t.permission.rows.map((row, i) => (
            <div
              key={row.who}
              className={cn(
                "grid gap-2 px-4 py-3 sm:grid-cols-[220px_1fr] sm:gap-6 sm:px-6 sm:py-4",
                i !== t.permission.rows.length - 1 && "border-b",
              )}
            >
              <div className="font-medium">{row.who}</div>
              <div className="text-sm text-muted-foreground">{row.sees}</div>
            </div>
          ))}
        </div>
      </Section>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/40 dark:bg-amber-950/30">
        <h3 className="mb-3 text-sm font-semibold text-amber-900 dark:text-amber-200">
          {t.tip.title}
        </h3>
        <ul className="space-y-2">
          {t.tip.lines.map((line) => (
            <li key={line} className="flex gap-2 text-sm text-amber-900/90 dark:text-amber-100/90">
              <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function LangButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}

function Section({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold tracking-tight">{heading}</h3>
      {children}
    </section>
  )
}

const toneClass: Record<string, string> = {
  primary: "border-primary/30 bg-primary/5",
  indigo: "border-indigo-200 bg-indigo-50 dark:border-indigo-900/40 dark:bg-indigo-950/20",
  emerald: "border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-950/20",
  muted: "border-border bg-muted/40",
}

const iconToneClass: Record<string, string> = {
  primary: "bg-primary/15 text-primary",
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  muted: "bg-muted text-muted-foreground",
}

function HierarchyCard({
  tone,
  icon: Icon,
  title,
  desc,
}: {
  tone: keyof typeof toneClass
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border p-4 shadow-xs",
        toneClass[tone],
      )}
    >
      <div className={cn("flex size-8 items-center justify-center rounded-md", iconToneClass[tone])}>
        <Icon className="size-4" />
      </div>
      <div className="font-semibold leading-tight">{title}</div>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  )
}

function Arrow() {
  return (
    <div className="hidden items-center justify-center text-muted-foreground lg:flex">
      <ArrowRight className="size-4" />
    </div>
  )
}

function FlowSection({
  heading,
  subtitle,
  steps,
  accent,
}: {
  heading: string
  subtitle: string
  steps: Step[]
  accent: "primary" | "emerald"
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-base font-semibold tracking-tight">{heading}</h3>
        <p className="max-w-3xl text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {steps.map((step, i) => (
          <StepCard key={step.title} step={step} index={i + 1} accent={accent} />
        ))}
      </ol>
    </section>
  )
}

const accentBadgeClass: Record<string, string> = {
  primary: "bg-primary text-primary-foreground",
  emerald: "bg-emerald-600 text-white",
}

const accentIconClass: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
}

function StepCard({
  step,
  index,
  accent,
}: {
  step: Step
  index: number
  accent: "primary" | "emerald"
}) {
  const Icon = step.icon
  return (
    <li className="relative flex gap-3 rounded-lg border bg-card p-4 shadow-xs transition-colors hover:bg-muted/30">
      <div className="flex flex-col items-center gap-2">
        <span
          className={cn(
            "flex size-7 items-center justify-center rounded-full text-xs font-bold",
            accentBadgeClass[accent],
          )}
        >
          {index}
        </span>
        <div className={cn("flex size-9 items-center justify-center rounded-md", accentIconClass[accent])}>
          <Icon className="size-4" />
        </div>
      </div>
      <div className="min-w-0 space-y-1">
        <div className="font-semibold leading-tight">{step.title}</div>
        <p className="text-xs text-muted-foreground">{step.desc}</p>
        {step.path && (
          <code className="inline-block rounded bg-muted px-1.5 py-0.5 text-[11px] font-mono text-muted-foreground">
            {step.path}
          </code>
        )}
      </div>
    </li>
  )
}
