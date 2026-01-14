import type { CallNote } from "./data"

// Sample call notes data - in production this would come from a database
const initialCallNotes: CallNote[] = [
  // Dr. Brenden Edwin Quintin Van Der Westhuizen (d1)
  {
    id: "cn1",
    doctorId: "d1",
    date: "2025-01-10",
    notes:
      "Discussed the new ATTUNE Knee System. Dr. Van Der Westhuizen is interested in trialing it for his next primary TKA case. Will follow up with product samples.",
    createdBy: "Paul M.",
  },
  {
    id: "cn2",
    doctorId: "d1",
    date: "2024-12-15",
    notes:
      "Reviewed surgical technique for revision knee procedures. Provided updated instrumentation guide. He prefers the older tray setup - will check if we can accommodate.",
    createdBy: "Paul M.",
  },
  {
    id: "cn3",
    doctorId: "d1",
    date: "2024-11-20",
    notes:
      "Quick check-in before his scheduled hip replacement surgery. Confirmed all instruments are available. He mentioned interest in the VELYS robotic system demo.",
    createdBy: "Paul M.",
  },
  {
    id: "cn4",
    doctorId: "d1",
    date: "2024-10-05",
    notes:
      "Introduced new PINNACLE cup sizing options. He was receptive and requested literature to review. Scheduled follow-up for next month.",
    createdBy: "Paul M.",
  },
  {
    id: "cn5",
    doctorId: "d1",
    date: "2024-09-12",
    notes:
      "Initial meeting to discuss product portfolio. Dr. Van Der Westhuizen primarily uses competitor products but is open to evaluating our hip and knee systems.",
    createdBy: "Paul M.",
  },

  // Dr. Gareth Aiden Eeson (d2)
  {
    id: "cn6",
    doctorId: "d2",
    date: "2025-01-08",
    notes:
      "Supported a complex trauma case - tibial plateau fracture. LCP plating system performed well. Dr. Eeson was satisfied with the outcome.",
    createdBy: "Paul M.",
  },
  {
    id: "cn7",
    doctorId: "d2",
    date: "2024-12-20",
    notes:
      "Discussed upcoming trauma conference. He's interested in presenting a case study using our TFN-ADVANCED system. Will coordinate with marketing.",
    createdBy: "Paul M.",
  },

  // Dr. David Paul Beattie (d3)
  {
    id: "cn8",
    doctorId: "d3",
    date: "2025-01-05",
    notes:
      "Pre-op planning for bilateral knee replacement. Reviewed patient imaging and sizing. Dr. Beattie confirmed ATTUNE S+ for both knees.",
    createdBy: "Paul M.",
  },
  {
    id: "cn9",
    doctorId: "d3",
    date: "2024-11-30",
    notes:
      "Dropped off updated product catalogs and pricing sheets. Brief discussion about Q1 procedure schedule - expecting 15-20 joint replacements.",
    createdBy: "Paul M.",
  },

  // Dr. Rachel Kim (d4)
  {
    id: "cn10",
    doctorId: "d4",
    date: "2025-01-12",
    notes:
      "Observed spine fusion procedure using EXPEDIUM system. Dr. Kim provided positive feedback on screw placement accuracy. Discussed potential for additional training.",
    createdBy: "Paul M.",
  },

  // Dr. Alan Edward Beaulieu (d5)
  {
    id: "cn11",
    doctorId: "d5",
    date: "2025-01-09",
    notes:
      "Consultation regarding complex acetabular revision. Recommended PINNACLE Revision Shell with augments. Case scheduled for next week.",
    createdBy: "Paul M.",
  },
  {
    id: "cn12",
    doctorId: "d5",
    date: "2024-12-10",
    notes:
      "Annual product review meeting. Dr. Beaulieu renewed commitment to DePuy Synthes for hip replacements. Discussed potential volume agreement.",
    createdBy: "Paul M.",
  },
  {
    id: "cn13",
    doctorId: "d5",
    date: "2024-11-15",
    notes:
      "In-service training for new OR staff on ACTIS stem instrumentation. Dr. Beaulieu attended and provided his surgical pearls to the team.",
    createdBy: "Paul M.",
  },

  // Dr. Larry Wayne Price (d6)
  {
    id: "cn14",
    doctorId: "d6",
    date: "2024-12-28",
    notes:
      "Assisted with revision TKA case. Previous implant was competitor product with early failure. Dr. Price impressed with TC3 revision options.",
    createdBy: "Paul M.",
  },

  // Dr. Kilian Gaye Gichuhi (d9)
  {
    id: "cn15",
    doctorId: "d9",
    date: "2025-01-11",
    notes:
      "New surgeon introduction meeting. Dr. Gichuhi recently joined Kelowna General from Vancouver. Interested in our trauma portfolio for his practice.",
    createdBy: "Paul M.",
  },

  // Dr. Carl Alexander Fehr - Kamloops (d13)
  {
    id: "cn16",
    doctorId: "d13",
    date: "2025-01-07",
    notes:
      "Quarterly business review at Royal Inland Hospital. Dr. Fehr's team performed 45 procedures last quarter using our products. Discussed case coverage schedule.",
    createdBy: "Paul M.",
  },
  {
    id: "cn17",
    doctorId: "d13",
    date: "2024-11-22",
    notes:
      "Product complaint follow-up - instrument tray had missing retractor. Issue resolved with replacement set. Dr. Fehr appreciated quick response.",
    createdBy: "Paul M.",
  },

  // Dr. James David Cruickshank - Vernon (d24)
  {
    id: "cn18",
    doctorId: "d24",
    date: "2025-01-06",
    notes:
      "Site visit to Vernon Jubilee Hospital. Reviewed inventory levels and upcoming case schedule. Dr. Cruickshank requested additional CORAIL stem sizes.",
    createdBy: "Paul M.",
  },

  // Dr. Lee Ronald Faulds - Penticton (d33)
  {
    id: "cn19",
    doctorId: "d33",
    date: "2024-12-18",
    notes:
      "End of year meeting to discuss 2025 goals. Dr. Faulds plans to increase joint replacement volume. Agreed to conduct staff training in January.",
    createdBy: "Paul M.",
  },

  // Dr. Derryck Hirsche Smith - Trail (d38)
  {
    id: "cn20",
    doctorId: "d38",
    date: "2025-01-03",
    notes:
      "First call of the new year. Discussed challenging revision case coming up. Will bring specialized instrumentation from the regional depot.",
    createdBy: "Paul M.",
  },
]

export let callNotes: CallNote[] = [...initialCallNotes]

export function addCallNote(note: Omit<CallNote, "id">): CallNote {
  const newNote: CallNote = {
    ...note,
    id: `cn${Date.now()}`,
  }
  callNotes = [newNote, ...callNotes]

  // Persist to localStorage for client-side persistence
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("addedCallNotes")
    const addedNotes = stored ? JSON.parse(stored) : []
    addedNotes.push(newNote)
    localStorage.setItem("addedCallNotes", JSON.stringify(addedNotes))
  }

  return newNote
}

export function loadPersistedCallNotes(): void {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("addedCallNotes")
    if (stored) {
      const addedNotes: CallNote[] = JSON.parse(stored)
      // Merge with initial notes, avoiding duplicates
      const existingIds = new Set(callNotes.map((n) => n.id))
      addedNotes.forEach((note) => {
        if (!existingIds.has(note.id)) {
          callNotes.push(note)
        }
      })
    }
  }
}

// Helper function to get call notes for a specific doctor
export function getCallNotesForDoctor(doctorId: string): CallNote[] {
  return callNotes
    .filter((note) => note.doctorId === doctorId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Helper function to get the most recent call notes for a doctor (limited)
export function getRecentCallNotes(doctorId: string, limit = 3): CallNote[] {
  return getCallNotesForDoctor(doctorId).slice(0, limit)
}
