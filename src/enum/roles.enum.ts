export const Role = {
    1: "JDAdmin",
    2: "Admin",
    3: "Dev",
    4: "QA",
    5: "ScrumMaster",
    6: "DevOps",
    7: "UX_UI",
    8: "DBA",
    9: "Owner"
} as const;

export type Role = typeof Role[keyof typeof Role];