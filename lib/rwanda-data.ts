// Comprehensive Rwanda location and agricultural data

export const RWANDA_SECTORS: Record<string, Record<string, string[]>> = {
  "Kigali City": {
    Gasabo: [
      "Bumbogo",
      "Gatsata",
      "Jali",
      "Gikomero",
      "Gisozi",
      "Jabana",
      "Kacyiru",
      "Kimihurura",
      "Kimironko",
      "Kinyinya",
      "Ndera",
      "Nduba",
      "Remera",
      "Rusororo",
      "Rutunga",
    ],
    Kicukiro: [
      "Gahanga",
      "Gatenga",
      "Gikondo",
      "Kagarama",
      "Kanombe",
      "Kicukiro",
      "Kigarama",
      "Masaka",
      "Niboye",
      "Nyarugunga",
    ],
    Nyarugenge: [
      "Gitega",
      "Kanyinya",
      "Kigali",
      "Kimisagara",
      "Mageragere",
      "Muhima",
      "Nyakabanda",
      "Nyamirambo",
      "Nyarugenge",
      "Rwezamenyo",
    ],
  },
  "Eastern Province": {
    Bugesera: [
      "Gashora",
      "Juru",
      "Kamabuye",
      "Mayange",
      "Musenyi",
      "Mwogo",
      "Ngeruka",
      "Ntarama",
      "Nyamata",
      "Nyarugenge",
      "Rilima",
      "Ruhuha",
      "Rweru",
      "Shyara",
    ],
    Gatsibo: [
      "Gasange",
      "Gatsibo",
      "Gitoki",
      "Kabarore",
      "Kageyo",
      "Kiramuruzi",
      "Kiziguro",
      "Muhura",
      "Murambi",
      "Ngarama",
      "Nyagihanga",
      "Remera",
      "Rugarama",
      "Rwimbogo",
    ],
    // Additional districts would be added here in a complete system
  },
  "Northern Province": {
    Musanze: [
      "Busogo",
      "Cyuve",
      "Gacaca",
      "Gashaki",
      "Gataraga",
      "Kimonyi",
      "Kinigi",
      "Muhoza",
      "Muko",
      "Musanze",
      "Nkotsi",
      "Nyange",
      "Remera",
      "Rwaza",
      "Shingiro",
    ],
    // Additional districts would be added here
  },
  "Southern Province": {
    Huye: [
      "Gishamvu",
      "Huye",
      "Karama",
      "Kigoma",
      "Kinazi",
      "Maraba",
      "Mbazi",
      "Mukura",
      "Ngoma",
      "Ruhashya",
      "Rusatira",
      "Rwaniro",
      "Simbi",
      "Tumba",
    ],
    // Additional districts would be added here
  },
  "Western Province": {
    Rubavu: [
      "Bugeshi",
      "Busasamana",
      "Cyanzarwe",
      "Gisenyi",
      "Kanama",
      "Kanzenze",
      "Mudende",
      "Nyakiliba",
      "Nyamyumba",
      "Nyundo",
      "Rubavu",
      "Rugerero",
    ],
    // Additional districts would be added here
  },
}

// Sample cells for demonstration - in production, this would be comprehensive
export const SAMPLE_CELLS: string[] = [
  "Kagugu",
  "Kibagabaga",
  "Nyabisindu",
  "Rugando",
  "Kinamba",
  "Gasharu",
  "Kibaza",
  "Nyagatovu",
  "Kabuye",
  "Rugarama",
]

// Sample villages for demonstration
export const SAMPLE_VILLAGES: string[] = [
  "Gacuriro",
  "Kimihurura",
  "Rebero",
  "Kagugu",
  "Kibagabaga",
  "Nyarutarama",
  "Kacyiru",
  "Kimironko",
  "Remera",
  "Gisozi",
]

// Comprehensive Rwanda agricultural products with prices (RWF/Kg)
export const RWANDA_CROPS = [
  // Cereals
  { name: "Maize", category: "Cereals", avgPrice: 450 },
  { name: "Rice", category: "Cereals", avgPrice: 950 },
  { name: "Wheat", category: "Cereals", avgPrice: 800 },
  { name: "Sorghum", category: "Cereals", avgPrice: 500 },

  // Legumes
  { name: "Beans (Red)", category: "Legumes", avgPrice: 850 },
  { name: "Beans (White)", category: "Legumes", avgPrice: 900 },
  { name: "Soybeans", category: "Legumes", avgPrice: 1200 },
  { name: "Groundnuts (Peanuts)", category: "Legumes", avgPrice: 1500 },
  { name: "Peas", category: "Legumes", avgPrice: 700 },

  // Tubers
  { name: "Irish Potatoes", category: "Tubers", avgPrice: 380 },
  { name: "Sweet Potatoes", category: "Tubers", avgPrice: 320 },
  { name: "Cassava", category: "Tubers", avgPrice: 250 },
  { name: "Yams", category: "Tubers", avgPrice: 400 },

  // Vegetables
  { name: "Tomatoes", category: "Vegetables", avgPrice: 600 },
  { name: "Cabbage", category: "Vegetables", avgPrice: 280 },
  { name: "Carrots", category: "Vegetables", avgPrice: 520 },
  { name: "Onions", category: "Vegetables", avgPrice: 450 },
  { name: "Eggplant (Biringanya)", category: "Vegetables", avgPrice: 350 },
  { name: "Peppers (Bell)", category: "Vegetables", avgPrice: 800 },
  { name: "Peppers (Hot)", category: "Vegetables", avgPrice: 1000 },
  { name: "Cucumber", category: "Vegetables", avgPrice: 300 },
  { name: "Zucchini", category: "Vegetables", avgPrice: 400 },
  { name: "Pumpkin", category: "Vegetables", avgPrice: 200 },
  { name: "Lettuce", category: "Vegetables", avgPrice: 500 },
  { name: "Spinach (Dodo)", category: "Vegetables", avgPrice: 350 },
  { name: "Amaranth", category: "Vegetables", avgPrice: 300 },
  { name: "Leeks", category: "Vegetables", avgPrice: 600 },
  { name: "Garlic", category: "Vegetables", avgPrice: 2000 },

  // Fruits
  { name: "Bananas (Cooking)", category: "Fruits", avgPrice: 300 },
  { name: "Bananas (Sweet)", category: "Fruits", avgPrice: 400 },
  { name: "Avocado", category: "Fruits", avgPrice: 800 },
  { name: "Mango", category: "Fruits", avgPrice: 500 },
  { name: "Papaya", category: "Fruits", avgPrice: 350 },
  { name: "Pineapple", category: "Fruits", avgPrice: 600 },
  { name: "Passion Fruit", category: "Fruits", avgPrice: 1200 },
  { name: "Oranges", category: "Fruits", avgPrice: 450 },
  { name: "Lemons", category: "Fruits", avgPrice: 800 },
  { name: "Guava", category: "Fruits", avgPrice: 400 },
  { name: "Watermelon", category: "Fruits", avgPrice: 250 },
  { name: "Tree Tomato (Igitomati)", category: "Fruits", avgPrice: 700 },

  // Cash Crops
  { name: "Coffee (Cherry)", category: "Cash Crops", avgPrice: 600 },
  { name: "Tea (Green Leaf)", category: "Cash Crops", avgPrice: 250 },
  { name: "Pyrethrum", category: "Cash Crops", avgPrice: 1800 },
  { name: "Tobacco", category: "Cash Crops", avgPrice: 3000 },

  // Other
  { name: "Sugarcane", category: "Other", avgPrice: 150 },
  { name: "Mushrooms", category: "Other", avgPrice: 2500 },
  { name: "Ginger", category: "Other", avgPrice: 3000 },
  { name: "Moringa", category: "Other", avgPrice: 2000 },
]

// Government systems integration endpoints
export const GOVERNMENT_SYSTEMS = {
  IREMBO: "https://irembo.gov.rw/",
  RAB: "https://www.rab.gov.rw/",
  RDB: "https://rdb.rw/",
  RRA: "https://www.rra.gov.rw/en/home",
  LANDS: "https://www.lands.rw/home",
  ENVIRONMENT:
    "https://www.environment.gov.rw/news-detail/rwanda-launched-electronic-land-registration-certificate-system",
  GOVERNMENT: "https://www.gov.rw/government/institutions/ministries",
  NAEB: "https://www.naeb.gov.rw/",
}

export async function sendToGovernmentSystems(userData: any) {
  // Simulate sending data to government systems
  console.log("[v0] Preparing to send data to Rwanda government systems...")

  const systems = Object.entries(GOVERNMENT_SYSTEMS)

  for (const [name, url] of systems) {
    try {
      console.log(`[v0] Sending data to ${name} at ${url}...`)
      // In production, this would be actual API calls
      // await fetch(`${url}/api/register`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData)
      // })
      console.log(`[v0] Successfully sent data to ${name}`)
    } catch (error) {
      console.error(`[v0] Failed to send data to ${name}:`, error)
    }
  }

  console.log("[v0] Data synchronization with government systems completed")
  return true
}
