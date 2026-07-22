// Demo data used when Supabase is not configured (preview mode).
// Mirrors the exact data shown in the approved template designs.

export const demoCandidates = [
  {
    id: 'c1',
    name: 'AMINA ALI KAKAWA',
    position: 'DOMESTIC WORKER',
    company: 'No company',
    salary: 'KWD 1,100.000',
    email: '1793949273605@temp.com',
    phone: '+000 000 0000',
    stage: 'Onboarding',
    status: 'Onboarding',
    country_applying_to: 'Kuwait',
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-01-10T08:00:00Z',
    deleted_at: null,
  },
  {
    id: 'c2',
    name: 'AMINA ALI KAKAWA',
    position: 'DOMESTIC WORKER',
    company: 'No company',
    salary: 'KWD 1,100.000',
    email: '1793949141350@temp.com',
    phone: '+000 000 0000',
    stage: 'Onboarding',
    status: 'Onboarding',
    country_applying_to: 'Kuwait',
    created_at: '2024-01-09T08:00:00Z',
    updated_at: '2024-01-09T08:00:00Z',
    deleted_at: null,
  },
  {
    id: 'c3',
    name: 'AMINA ALI KAKAWA',
    position: 'DOMESTIC WORKER',
    company: 'No company',
    salary: 'KWD 1,100.000',
    email: '1793949037105@temp.com',
    phone: '+000 000 0000',
    stage: 'Onboarding',
    status: 'Onboarding',
    country_applying_to: 'Kuwait',
    created_at: '2024-01-08T08:00:00Z',
    updated_at: '2024-01-08T08:00:00Z',
    deleted_at: null,
  },
  {
    id: 'c4',
    name: 'LYDIA MAPENZI KITSAO',
    position: 'DOMESTIC WORKER',
    company: 'No company',
    salary: 'KWD 1,100.000',
    email: '1793940210890@temp.com',
    phone: '+000 000 0000',
    stage: 'Onboarding',
    status: 'Onboarding',
    country_applying_to: 'Kuwait',
    created_at: '2024-01-07T08:00:00Z',
    updated_at: '2024-01-07T08:00:00Z',
    deleted_at: null,
  },
  {
    id: 'c5',
    name: 'LYDIA MAPENZI KITSAO',
    position: 'DOMESTIC WORKER',
    company: 'No company',
    salary: 'KWD 1,100.000',
    email: '1793940145034@temp.com',
    phone: '+000 000 0000',
    stage: 'Onboarding',
    status: 'Onboarding',
    country_applying_to: 'Kuwait',
    created_at: '2024-01-06T08:00:00Z',
    updated_at: '2024-01-06T08:00:00Z',
    deleted_at: null,
  },
]

export const demoTotalCandidates = 165

export const demoJobs = [
  {
    id: 'j1',
    title: 'Cleaners',
    company: 'Naim Investments',
    location: 'Dammam, Saudi Arabia',
    country: 'Saudi Arabia',
    type: 'full-time',
    salary_min: 0,
    salary_max: 0,
    currency: 'SAR',
    status: 'Active',
    posted_date: '2025-09-22',
    created_at: '2025-09-22T08:00:00Z',
    deleted_at: null,
  },
  {
    id: 'j2',
    title: 'Personal Driver (Female)',
    company: 'Elite Chauffeur Services',
    location: 'Kuwait City, Kuwait',
    country: 'Kuwait',
    type: 'Full-time',
    salary_min: 350,
    salary_max: 450,
    currency: 'KWD',
    status: 'Closed',
    posted_date: '2024-01-07',
    created_at: '2024-01-07T08:00:00Z',
    deleted_at: null,
  },
]

export const demoTasks = [
  {
    id: 't1',
    title: 'Follow up with Qatar Medical Center',
    assignee: 'John Recruiter',
    category: 'Follow-up',
    priority: 'HIGH',
    due_date: '2024-01-23',
    created_by: 'Admin',
    status: 'Completed',
  },
  {
    id: 't2',
    title: 'Schedule Medical Exam for James Omondi',
    assignee: 'Sarah Coordinator',
    category: 'Medical',
    priority: 'MEDIUM',
    due_date: '2024-01-24',
    created_by: 'Admin',
    status: 'In Progress',
  },
]

// ── Full candidate list for the Candidates page (demo mode) ──
// Page 1 mirrors the approved template image exactly; remaining
// records are generated so pagination (Page 1 of 17) works.

const page1Candidates = [
  {
    name: 'AMINA ALI KAKAWA', phone: '+000-000-0000', email: '1793949273605@temp.com',
    emergency_contact: 'N/A', stage: 'Onboarding', salary: 'Ksh 1,100.00',
    position: 'DOMESTIC WORKER', departure: 'Not set', company: 'N/A',
    city: 'N/A', country: 'SAUDI ARABIA', added: 'Invalid Date',
    notes: 'COOPERATIVE / HIGHLY DISCIPLINE / HARDWORKING & EXPERIENCED, WORKED IN IRAQ FOR 8 YEARS AS A DOMESTIC WORKER',
  },
  {
    name: 'AMINA ALI KAKAWA', phone: '+000-000-0000', email: '1793949141550@temp.com',
    emergency_contact: 'N/A', stage: 'Onboarding', salary: 'Ksh 1,100.00',
    position: 'DOMESTIC WORKER', departure: 'Not set', company: 'N/A',
    city: 'N/A', country: 'SAUDI ARABIA', added: 'Invalid Date', notes: '',
  },
  {
    name: 'AMINA ALI KAKAWA', phone: '+000-000-0000', email: '1793949037169@temp.com',
    emergency_contact: 'N/A', stage: 'Onboarding', salary: 'Ksh 1,100.00',
    position: 'DOMESTIC WORKER', departure: 'Not set', company: 'N/A',
    city: 'N/A', country: 'SAUDI ARABIA', added: 'Invalid Date', notes: '',
  },
  {
    name: 'LYDIA MAPENZI KITSAO', phone: '+000-000-0000', email: '1793940210090@temp.com',
    emergency_contact: 'N/A', stage: 'Onboarding', salary: 'Ksh 1,100.00',
    position: 'DOMESTIC WORKER', departure: 'Not set', company: 'N/A',
    city: 'N/A', country: 'SAUDI ARABIA', added: 'Invalid Date', notes: '',
  },
  {
    name: 'LYDIA MAPENZI KITSAO', phone: '+000-000-0000', email: '1793940145654@temp.com',
    emergency_contact: 'N/A', stage: 'Onboarding', salary: 'Ksh 1,100.00',
    position: 'DOMESTIC WORKER', departure: 'Not set', company: 'N/A',
    city: 'N/A', country: 'SAUDI ARABIA', added: 'Invalid Date', notes: '',
  },
  {
    name: 'MWATSENZE MESAIDI BAKARI', phone: '+000-000-0000', email: '1783358405525@temp.com',
    emergency_contact: 'N/A', stage: 'Onboarding', salary: 'N/A',
    position: 'NONE', departure: 'Not set', company: 'N/A',
    city: 'N/A', country: 'N/A', added: 'Invalid Date', notes: '',
  },
  {
    name: 'JOLINE CHELIMO KENTEYIA', phone: '+000-000-0000', email: '1783354451942@temp.com',
    emergency_contact: 'N/A', stage: 'Onboarding', salary: 'N/A',
    position: 'DOMESTIC WORKER', departure: 'Not set', company: 'N/A',
    city: 'N/A', country: 'N/A', added: 'Invalid Date', notes: '',
  },
  {
    name: 'JOLINE CHELIMO KENTEYIA', phone: '+000-000-0000', email: '1783354454560@temp.com',
    emergency_contact: 'N/A', stage: 'Onboarding', salary: 'N/A',
    position: 'DOMESTIC WORKER', departure: 'Not set', company: 'N/A',
    city: 'N/A', country: 'N/A', added: 'Invalid Date', notes: '',
  },
  {
    name: 'ALICE DAMA KITSAO', phone: '+000-000-0000', email: '1783081405111@temp.com',
    emergency_contact: 'N/A', stage: 'Onboarding', salary: 'Ksh 1,100.00',
    position: 'DOMESTIC WORKER', departure: 'Not set', company: 'N/A',
    city: 'N/A', country: 'SAUDI ARABIA', added: 'Invalid Date', notes: '',
  },
  {
    name: 'ALICE DAMA KITSAO', phone: '+000-000-0000', email: '1783081385728@temp.com',
    emergency_contact: 'N/A', stage: 'Onboarding', salary: 'Ksh 1,100.00',
    position: 'DOMESTIC WORKER', departure: 'Not set', company: 'N/A',
    city: 'N/A', country: 'SAUDI ARABIA', added: 'Invalid Date', notes: '',
  },
]

const fillerNames = [
  'GRACE WANJIKU MWANGI', 'FAITH AKINYI OTIENO', 'MERCY NJERI KAMAU', 'ESTHER MORAA NYABUTO',
  'JANE WAIRIMU NDUNGU', 'SARAH ACHIENG OUMA', 'ROSE CHEPKOECH KIRUI', 'MARY WAMBUI GITAU',
  'AGNES NEKESA WAFULA', 'BEATRICE ATIENO OKELLO', 'CATHERINE MUTHONI KARIUKI', 'DOROTHY KADZO CHARO',
  'EUNICE JEPKORIR ROTICH', 'FLORENCE NYAMBURA MAINA', 'GLADYS AWINO ODHIAMBO', 'HELLEN CHEBET LANGAT',
  'IRENE WANGARI MACHARIA', 'JOYCE KEMUNTO MOMANYI', 'LUCY WAYUA MUTUA', 'MARGARET SIDI KAZUNGU',
  'NANCY JELIMO KOSGEI', 'PAULINE ADHIAMBO ONYANGO', 'PURITY GATHONI KIMANI', 'RUTH KAVUTHA MUSYOKA',
  'SUSAN NASIMIYU BARASA', 'TABITHA NYOKABI WAWERU', 'VIOLET AUMA OCHIENG', 'WINNIE CHEMUTAI TOWETT',
  'ZAINAB MWANAISHA JUMA', 'PRISCILLA MBEYU MWERO', 'REBECCA NALIAKA SIMIYU',
]

function buildDemoCandidatesList() {
  const list = page1Candidates.map((c, i) => ({
    id: `dc${i + 1}`,
    ...c,
    status: c.stage,
    country_applying_to: c.country === 'SAUDI ARABIA' ? 'Saudi Arabia' : 'Kuwait',
    created_at: new Date(Date.UTC(2024, 0, 20 - i, 8)).toISOString(),
    updated_at: new Date(Date.UTC(2024, 0, 20 - i, 8)).toISOString(),
    deleted_at: null,
  }))
  for (let i = 10; i < 165; i++) {
    const name = fillerNames[(i - 10) % fillerNames.length]
    list.push({
      id: `dc${i + 1}`,
      name,
      phone: '+000-000-0000',
      email: `${1783000000000 + i * 7919}@temp.com`,
      emergency_contact: 'N/A',
      stage: 'Onboarding',
      status: 'Onboarding',
      salary: i % 3 === 0 ? 'N/A' : 'Ksh 1,100.00',
      position: i % 5 === 0 ? 'NONE' : 'DOMESTIC WORKER',
      departure: 'Not set',
      company: 'N/A',
      city: 'N/A',
      country: i % 3 === 0 ? 'N/A' : 'SAUDI ARABIA',
      country_applying_to: 'Saudi Arabia',
      added: 'Invalid Date',
      notes: '',
      created_at: new Date(Date.UTC(2024, 0, 10, 8) - i * 3600000).toISOString(),
      updated_at: new Date(Date.UTC(2024, 0, 10, 8) - i * 3600000).toISOString(),
      deleted_at: null,
    })
  }
  return list
}

export const demoCandidatesList = buildDemoCandidatesList()

export const demoNotifications = [
  {
    id: 'n1',
    title: 'Follow up with Qatar Medical Center due tomorrow',
    time: '2 hours ago',
    tags: [
      { label: 'high', color: 'bg-red-100 text-red-600' },
      { label: 'task', color: 'bg-blue-100 text-blue-600' },
    ],
    read: false,
  },
  {
    id: 'n2',
    title: 'James Omondi has updated his profile',
    time: '1 day ago',
    tags: [
      { label: 'medium', color: 'bg-yellow-100 text-yellow-700' },
      { label: 'candidate', color: 'bg-green-100 text-green-600' },
    ],
    read: false,
  },
  {
    id: 'n3',
    title: 'Interview with Jane Mwangi scheduled for tomorrow at 10:00 AM',
    time: '3 hours ago',
    tags: [
      { label: 'high', color: 'bg-red-100 text-red-600' },
      { label: 'appointment', color: 'bg-purple-100 text-purple-600' },
    ],
    read: false,
  },
]
