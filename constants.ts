
import { Declaration, RiskLevel, CustomsEvent, TrafficSegment } from './types';

export const HS_CODE_REGISTRY: Record<string, string> = {
  "8542.31": "Electronic integrated circuits: Processors and controllers, whether or not combined with memories, converters, logic circuits, amplifiers, clock and timing circuits, or other circuits.",
  "8433.90": "Parts of harvesting or threshing machinery, including combined harvester-threshers; grass or hay mowers; machines for cleaning, sorting or grading eggs, fruit or other agricultural produce.",
  "2710.19": "Petroleum oils and oils obtained from bituminous minerals (other than crude) and preparations not elsewhere specified or included, containing by weight 70% or more of these oils, other than light oils and preparations.",
  "8517.62": "Machines for the reception, conversion and transmission or regeneration of voice, images or other data, including switching and routing apparatus.",
  "9013.80": "Other optical appliances and instruments, not specified or included elsewhere in this chapter; lasers, other than laser diodes; other appliances and instruments.",
  "8542.90": "Parts of electronic integrated circuits and microassemblies."
};

export const BQS_VOLUME_DATA: TrafficSegment[] = [
  {
    category: "Empty Trucks",
    volume: 3229,
    riskAnalysis: "High volume, low complexity.",
    context: "Allows for 'Green Lane' optimization to prioritize loaded assets."
  },
  {
    category: "Standard Loaded Cargo",
    volume: 1700,
    riskAnalysis: "Standard risk profile.",
    context: "Requires standard documentary and physical checks."
  },
  {
    category: "AEO (Authorized Economic Operator)",
    volume: 2896,
    riskAnalysis: "Low-risk/High-trust.",
    context: "Represents 34% of total traffic. BQS allows these 'Green Lane' partners to bypass standard congestion, rewarding compliance."
  },
  {
    category: "International Transit",
    volume: 590,
    riskAnalysis: "High risk for 'leakage'.",
    context: "Requires strict monitoring of entry/exit timestamps to prevent domestic market infusion."
  }
];

export const MOCK_DECLARATIONS: Declaration[] = [
  {
    id: "DEC-882190",
    exporter: "Global Dynamics Ltd, Shenzen",
    importer: "Tech-West Solutions, USA",
    itemDescription: "Microelectronic sub-assemblies for consumer electronics",
    declaredValue: 45000,
    currency: "USD",
    originCountry: "China",
    hsCode: "8542.31",
    riskScore: 12,
    riskLevel: RiskLevel.LOW,
    timestamp: "2024-05-20T10:30:00Z",
    status: "PENDING",
    documentRefs: ["BOL-CN-882", "INV-2024-001"],
    documentStatus: [
      { name: "Bill of Lading", status: "PRESENT" },
      { name: "Commercial Invoice", status: "PRESENT" }
    ]
  },
  {
    id: "DEC-910234",
    exporter: "Artemis Logistics, Colombia",
    importer: "Import-Export Corp, UK",
    itemDescription: "Agricultural equipment spare parts",
    declaredValue: 2100,
    currency: "USD",
    originCountry: "Colombia",
    hsCode: "8433.90",
    riskScore: 68,
    riskLevel: RiskLevel.HIGH,
    timestamp: "2024-05-20T11:15:00Z",
    status: "FLAGGED",
    documentRefs: ["INV-UK-910"],
    documentStatus: [
      { name: "Bill of Lading", status: "MISSING" },
      { name: "Commercial Invoice", status: "PRESENT" }
    ]
  },
  {
    id: "DEC-774412",
    exporter: "Naphtha Energy Trading",
    importer: "Local Refineries Inc.",
    itemDescription: "Industrial Lubricants and Compounds",
    declaredValue: 850000,
    currency: "USD",
    originCountry: "Russia",
    hsCode: "2710.19",
    riskScore: 92,
    riskLevel: RiskLevel.CRITICAL,
    timestamp: "2024-05-20T09:00:00Z",
    status: "INSPECTING",
    documentRefs: ["BOL-RU-774"],
    documentStatus: [
      { name: "Bill of Lading", status: "PRESENT" },
      { name: "Commercial Invoice", status: "INCONSISTENT" },
      { name: "Certificate of Origin", status: "MISSING" }
    ]
  }
];

export const MOCK_EVENTS: CustomsEvent[] = [
  {
    id: "EVT-001",
    date: "2023-12-15",
    type: "SEIZURE",
    description: "Undisclosed high-capacity batteries found in crates marked as 'Office Furniture'",
    entities: ["B-Logistics Group", "Furniture Direct Co"],
    severity: RiskLevel.CRITICAL,
    outcome: "Goods seized, $50k fine issued"
  },
  {
    id: "EVT-002",
    date: "2024-01-22",
    type: "FRAUD",
    description: "Systematic undervaluation of silk textiles from Vietnam",
    entities: ["SilkRoad Imports"],
    severity: RiskLevel.HIGH,
    outcome: "Audit triggered, 3-year monitoring"
  },
  {
    id: "EVT-003",
    date: "2024-03-05",
    type: "SANCTION_HIT",
    description: "Dual-use hardware components linked to prohibited end-user",
    entities: ["Precision Parts SA", "Undisclosed Buyer"],
    severity: RiskLevel.CRITICAL,
    outcome: "Blocked entry, reported to intelligence"
  }
];
