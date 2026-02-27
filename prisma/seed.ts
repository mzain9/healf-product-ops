import { PrismaClient } from '@prisma/client'
import { slugify, uniqueProductSlug } from '../lib/slug'

const prisma = new PrismaClient()

const img = {
  serum: 'https://images.pexels.com/photos/30968097/pexels-photo-30968097.jpeg?auto=compress&cs=tinysrgb&w=500',
  serumAlt: 'https://images.pexels.com/photos/6847858/pexels-photo-6847858.jpeg?auto=compress&cs=tinysrgb&w=500',
  skincareSpray: 'https://images.pexels.com/photos/7321663/pexels-photo-7321663.jpeg?auto=compress&cs=tinysrgb&w=500',
  supplements: 'https://images.pexels.com/photos/13787561/pexels-photo-13787561.jpeg?auto=compress&cs=tinysrgb&w=500',
  pillsBowl: 'https://images.pexels.com/photos/3850681/pexels-photo-3850681.jpeg?auto=compress&cs=tinysrgb&w=500',
  vitaminsBottle: 'https://images.pexels.com/photos/13779107/pexels-photo-13779107.jpeg?auto=compress&cs=tinysrgb&w=500',
  yogaMat: 'https://images.pexels.com/photos/6740753/pexels-photo-6740753.jpeg?auto=compress&cs=tinysrgb&w=500',
  resistanceBand: 'https://images.pexels.com/photos/4397831/pexels-photo-4397831.jpeg?auto=compress&cs=tinysrgb&w=500',
  foamRoller: 'https://images.pexels.com/photos/6207527/pexels-photo-6207527.jpeg?auto=compress&cs=tinysrgb&w=500',
  kettlebell: 'https://images.pexels.com/photos/2836961/pexels-photo-2836961.jpeg?auto=compress&cs=tinysrgb&w=500',
  massageGun: 'https://images.pexels.com/photos/6628659/pexels-photo-6628659.jpeg?auto=compress&cs=tinysrgb&w=500',
  bpMonitor: 'https://images.pexels.com/photos/5721676/pexels-photo-5721676.jpeg?auto=compress&cs=tinysrgb&w=500',
  thermometer: 'https://images.pexels.com/photos/5858740/pexels-photo-5858740.jpeg?auto=compress&cs=tinysrgb&w=500',
  stethoscope: 'https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg?auto=compress&cs=tinysrgb&w=500',
  firstAidBox: 'https://images.pexels.com/photos/5673523/pexels-photo-5673523.jpeg?auto=compress&cs=tinysrgb&w=500',
  bandages: 'https://images.pexels.com/photos/7722865/pexels-photo-7722865.jpeg?auto=compress&cs=tinysrgb&w=500',
  toothbrush: 'https://images.pexels.com/photos/3654597/pexels-photo-3654597.jpeg?auto=compress&cs=tinysrgb&w=500',
  sanitizer: 'https://images.pexels.com/photos/4908438/pexels-photo-4908438.jpeg?auto=compress&cs=tinysrgb&w=500',
}

type OwnerKey = 'skin' | 'fit' | 'med' | 'well' | 'nutri' | 'care'

const PRODUCTS: Array<{
  sku: string
  name: string
  description: string
  price: number
  inventory: number
  status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED'
  ownerKey: OwnerKey
  imageUrl?: string
  createdAt?: Date
}> = [
  { sku: 'SKIN-001', name: 'Hydrating Face Moisturizer', description: 'Daily moisturizer with hyaluronic acid and SPF 30', price: 34.99, inventory: 120, status: 'ACTIVE', ownerKey: 'skin', imageUrl: img.skincareSpray },
  { sku: 'SKIN-002', name: 'Vitamin C Brightening Serum', description: 'Brightening serum with 20% vitamin C', price: 42.99, inventory: 85, status: 'ACTIVE', ownerKey: 'skin', imageUrl: img.serum },
  { sku: 'SKIN-003', name: 'Gentle Cleansing Foam', description: 'pH-balanced facial cleanser for all skin types', price: 18.99, inventory: 200, status: 'ACTIVE', ownerKey: 'skin', imageUrl: img.serumAlt },
  { sku: 'SKIN-004', name: 'Niacinamide Pore Refining Serum', description: '10% niacinamide + zinc to help reduce visible pores', price: 21.99, inventory: 14, status: 'ACTIVE', ownerKey: 'skin', imageUrl: img.serumAlt },
  { sku: 'SKIN-005', name: 'Ceramide Barrier Repair Cream', description: 'Rich cream to support skin barrier + reduce dryness', price: 27.5, inventory: 0, status: 'INACTIVE', ownerKey: 'skin', imageUrl: img.skincareSpray },
  { sku: 'SKIN-006', name: 'Retinol Night Treatment', description: '0.3% retinol for smoother-looking skin overnight', price: 39.0, inventory: 33, status: 'ACTIVE', ownerKey: 'skin', imageUrl: img.serum },
  { sku: 'SKIN-007', name: 'Mineral Sunscreen SPF 50', description: 'Broad spectrum zinc-based sunscreen, no white cast', price: 23.99, inventory: 9, status: 'ACTIVE', ownerKey: 'skin', imageUrl: img.skincareSpray },
  { sku: 'SKIN-008', name: 'Soothing Aloe Gel', description: 'Cooling gel for post-sun comfort and hydration', price: 12.49, inventory: 160, status: 'ACTIVE', ownerKey: 'skin', imageUrl: img.skincareSpray },
  { sku: 'SKIN-009', name: 'Exfoliating AHA Toner', description: '5% lactic acid toner to gently exfoliate and glow', price: 19.99, inventory: 44, status: 'INACTIVE', ownerKey: 'skin', imageUrl: img.serumAlt },
  { sku: 'SKIN-010', name: 'Charcoal Clay Mask', description: 'Deep-cleansing mask to help lift oil and impurities', price: 16.99, inventory: 2, status: 'DISCONTINUED', ownerKey: 'skin', imageUrl: img.serumAlt },

  { sku: 'FIT-001', name: 'Resistance Bands Set', description: 'Set of 5 resistance bands for strength training', price: 29.99, inventory: 95, status: 'ACTIVE', ownerKey: 'fit', imageUrl: img.resistanceBand },
  { sku: 'FIT-002', name: 'Foam Roller (High Density)', description: 'High-density roller for mobility and recovery', price: 24.99, inventory: 78, status: 'ACTIVE', ownerKey: 'fit', imageUrl: img.foamRoller },
  { sku: 'FIT-003', name: 'Yoga Mat (Non-Slip, 6mm)', description: 'Grip-friendly mat for yoga, pilates, and stretching', price: 32.99, inventory: 110, status: 'ACTIVE', ownerKey: 'fit', imageUrl: img.yogaMat },
  { sku: 'FIT-004', name: 'Adjustable Kettlebell', description: '12–32 kg adjustable kettlebell for home training', price: 129.99, inventory: 25, status: 'ACTIVE', ownerKey: 'fit', imageUrl: img.kettlebell },
  { sku: 'FIT-005', name: 'Massage Gun (Percussion)', description: 'Handheld percussion massager for recovery', price: 79.99, inventory: 38, status: 'ACTIVE', ownerKey: 'fit', imageUrl: img.massageGun },
  { sku: 'FIT-006', name: 'Jump Rope (Speed)', description: 'Lightweight rope for cardio and conditioning', price: 14.99, inventory: 6, status: 'ACTIVE', ownerKey: 'fit', imageUrl: img.kettlebell },
  { sku: 'FIT-007', name: 'Pull-Up Bar (Doorway)', description: 'No-screw doorway bar for upper body training', price: 34.99, inventory: 0, status: 'INACTIVE', ownerKey: 'fit', imageUrl: img.resistanceBand },
  { sku: 'FIT-008', name: 'Ankle Weights (2x2kg)', description: 'Adjustable ankle weights for walks and workouts', price: 19.99, inventory: 52, status: 'ACTIVE', ownerKey: 'fit', imageUrl: img.resistanceBand },
  { sku: 'FIT-009', name: 'Gym Gloves', description: 'Padded grip gloves for lifting and pull exercises', price: 12.99, inventory: 140, status: 'ACTIVE', ownerKey: 'fit', imageUrl: img.kettlebell },
  { sku: 'FIT-010', name: 'Balance Pad', description: 'Foam balance pad for stability and rehab drills', price: 21.99, inventory: 3, status: 'DISCONTINUED', ownerKey: 'fit', imageUrl: img.yogaMat },

  { sku: 'MED-001', name: 'Multivitamin Daily', description: 'Complete daily multivitamin and mineral formula', price: 19.99, inventory: 250, status: 'ACTIVE', ownerKey: 'med', imageUrl: img.supplements },
  { sku: 'MED-002', name: 'Omega-3 Fish Oil', description: '1000 mg omega-3 softgels, 90 count', price: 24.99, inventory: 180, status: 'ACTIVE', ownerKey: 'med', imageUrl: img.pillsBowl },
  { sku: 'MED-003', name: 'Vitamin D3 2000 IU', description: 'Vitamin D supplement for bone and immune health', price: 14.99, inventory: 220, status: 'ACTIVE', ownerKey: 'med', imageUrl: img.vitaminsBottle },
  { sku: 'MED-004', name: 'Pain Relief Gel', description: 'Topical gel for muscle and joint comfort', price: 12.99, inventory: 150, status: 'ACTIVE', ownerKey: 'med', imageUrl: img.firstAidBox },
  { sku: 'MED-005', name: 'Blood Pressure Monitor', description: 'Home BP monitor with easy-read display', price: 49.99, inventory: 22, status: 'ACTIVE', ownerKey: 'med', imageUrl: img.bpMonitor },
  { sku: 'MED-006', name: 'Digital Thermometer', description: 'Fast-read digital thermometer for home use', price: 9.99, inventory: 4, status: 'ACTIVE', ownerKey: 'med', imageUrl: img.thermometer },
  { sku: 'MED-007', name: 'Pulse Oximeter', description: 'Finger pulse oximeter for SpO2 and pulse rate', price: 18.99, inventory: 0, status: 'INACTIVE', ownerKey: 'med', imageUrl: img.stethoscope },
  { sku: 'MED-008', name: 'Allergy Relief Tablets', description: 'Non-drowsy daily allergy support', price: 11.99, inventory: 90, status: 'ACTIVE', ownerKey: 'med', imageUrl: img.pillsBowl },
  { sku: 'MED-009', name: 'Electrolyte Tablets', description: 'Hydration support tablets for workouts and travel', price: 16.99, inventory: 8, status: 'ACTIVE', ownerKey: 'med', imageUrl: img.vitaminsBottle },
  { sku: 'MED-010', name: 'Sleep Support Capsules', description: 'Melatonin + magnesium blend for sleep routine', price: 22.99, inventory: 1, status: 'DISCONTINUED', ownerKey: 'med', imageUrl: img.supplements },

  { sku: 'NUTRI-001', name: 'Whey Protein Powder', description: '24g protein per serving, chocolate flavour', price: 49.99, inventory: 60, status: 'ACTIVE', ownerKey: 'nutri', imageUrl: img.supplements },
  { sku: 'NUTRI-002', name: 'Plant Protein Blend', description: 'Pea + rice protein, vanilla flavour', price: 44.99, inventory: 18, status: 'ACTIVE', ownerKey: 'nutri', imageUrl: img.supplements },
  { sku: 'NUTRI-003', name: 'Creatine Monohydrate', description: 'Unflavoured creatine for strength performance', price: 29.99, inventory: 5, status: 'ACTIVE', ownerKey: 'nutri', imageUrl: img.supplements },
  { sku: 'NUTRI-004', name: 'Pre-Workout Powder', description: 'Caffeine + beta-alanine blend, fruit punch', price: 34.99, inventory: 0, status: 'INACTIVE', ownerKey: 'nutri', imageUrl: img.supplements },
  { sku: 'NUTRI-005', name: 'Collagen Peptides', description: 'Hydrolyzed collagen peptides for daily routine', price: 31.99, inventory: 42, status: 'ACTIVE', ownerKey: 'nutri', imageUrl: img.vitaminsBottle },
  { sku: 'NUTRI-006', name: 'Greens Powder', description: 'Daily greens blend with probiotics', price: 39.99, inventory: 12, status: 'ACTIVE', ownerKey: 'nutri', imageUrl: img.supplements },
  { sku: 'NUTRI-007', name: 'Electrolyte Drink Mix', description: 'Hydration drink mix, lemon lime', price: 19.99, inventory: 75, status: 'ACTIVE', ownerKey: 'nutri', imageUrl: img.pillsBowl },
  { sku: 'NUTRI-008', name: 'Meal Replacement Shake', description: 'Balanced macros, easy on-the-go nutrition', price: 54.99, inventory: 2, status: 'DISCONTINUED', ownerKey: 'nutri', imageUrl: img.pillsBowl },

  { sku: 'CARE-001', name: 'First Aid Kit (Home)', description: 'Compact kit with essentials for minor injuries', price: 27.99, inventory: 40, status: 'ACTIVE', ownerKey: 'care', imageUrl: img.firstAidBox },
  { sku: 'CARE-002', name: 'Adhesive Bandage Pack', description: 'Assorted bandages for daily first aid needs', price: 6.99, inventory: 210, status: 'ACTIVE', ownerKey: 'care', imageUrl: img.bandages },
  { sku: 'CARE-003', name: 'Antiseptic Wipes', description: 'Individually wrapped antiseptic wipes', price: 8.49, inventory: 11, status: 'ACTIVE', ownerKey: 'care', imageUrl: img.bandages },
  { sku: 'CARE-004', name: 'Hand Sanitizer (Pump)', description: '70% alcohol hand sanitizer pump bottle', price: 5.99, inventory: 95, status: 'ACTIVE', ownerKey: 'care', imageUrl: img.sanitizer },
  { sku: 'CARE-005', name: 'Oral Care Starter Set', description: 'Electric toothbrush + fluoride toothpaste', price: 39.99, inventory: 0, status: 'INACTIVE', ownerKey: 'care', imageUrl: img.toothbrush },
  { sku: 'CARE-006', name: 'Cold Pack (Reusable)', description: 'Reusable gel cold pack for minor aches', price: 10.99, inventory: 3, status: 'DISCONTINUED', ownerKey: 'care', imageUrl: img.firstAidBox },

  { sku: 'WELL-001', name: 'Smart Wellness Tracker', description: 'Wearable for activity, sleep, and heart rate', price: 89.99, inventory: 45, status: 'ACTIVE', ownerKey: 'well', imageUrl: img.bpMonitor },
  { sku: 'WELL-002', name: 'Posture Support Brace', description: 'Lightweight brace for posture awareness', price: 24.99, inventory: 19, status: 'ACTIVE', ownerKey: 'well', imageUrl: img.stethoscope },
  { sku: 'WELL-003', name: 'Aromatherapy Diffuser', description: 'Ultrasonic diffuser with timer and auto-off', price: 29.99, inventory: 80, status: 'ACTIVE', ownerKey: 'well', imageUrl: img.serumAlt },
  { sku: 'WELL-004', name: 'Mindfulness Journal', description: 'Guided prompts for stress management routines', price: 14.99, inventory: 7, status: 'ACTIVE', ownerKey: 'well', imageUrl: img.yogaMat },
  { sku: 'WELL-005', name: 'Weighted Sleep Blanket', description: 'Even pressure blanket for bedtime comfort', price: 69.99, inventory: 0, status: 'INACTIVE', ownerKey: 'well', imageUrl: img.yogaMat },
  { sku: 'WELL-006', name: 'Joint Care Supplement', description: 'Glucosamine + chondroitin for joint support', price: 28.99, inventory: 65, status: 'DISCONTINUED', ownerKey: 'well', imageUrl: img.vitaminsBottle },
]

PRODUCTS.push(
  { sku: 'SKIN-011', name: 'Eye Cream (Caffeine)', description: 'Cooling eye cream to reduce the look of puffiness', price: 17.99, inventory: 58, status: 'ACTIVE', ownerKey: 'skin', imageUrl: img.serumAlt },
  { sku: 'SKIN-012', name: 'Lip Balm (Ceramide)', description: 'Barrier-support lip balm for daily use', price: 5.49, inventory: 1, status: 'ACTIVE', ownerKey: 'skin', imageUrl: img.skincareSpray },

  { sku: 'FIT-011', name: 'Ab Wheel', description: 'Core trainer wheel with comfortable grips', price: 15.99, inventory: 26, status: 'ACTIVE', ownerKey: 'fit', imageUrl: img.kettlebell },
  { sku: 'FIT-012', name: 'Stretch Strap', description: 'Multi-loop strap for flexibility training', price: 9.99, inventory: 0, status: 'INACTIVE', ownerKey: 'fit', imageUrl: img.yogaMat },

  { sku: 'NUTRI-009', name: 'Fiber Gummies', description: 'Daily fiber gummies to support digestion', price: 18.49, inventory: 130, status: 'ACTIVE', ownerKey: 'nutri', imageUrl: img.supplements },

  { sku: 'CARE-007', name: 'Medical Tape Roll', description: 'Breathable tape for securing gauze and bandages', price: 4.99, inventory: 16, status: 'ACTIVE', ownerKey: 'care', imageUrl: img.bandages }
)

function assignCreatedAt() {
  const now = Date.now()
  const oneDay = 24 * 60 * 60 * 1000
  PRODUCTS.forEach((p, i) => {
    const daysAgo = 180 - Math.floor((i * 180) / PRODUCTS.length) + (i % 11) - 5
    const d = new Date(now - Math.max(0, daysAgo) * oneDay)
    d.setHours((i * 13) % 24, (i * 17) % 60, (i * 23) % 60, 0)
    p.createdAt = d
  })
}
assignCreatedAt()

async function main() {
  await prisma.product.deleteMany()
  await prisma.productOwner.deleteMany()

  const [skin, fit, med, well, nutri, care] = await Promise.all([
    prisma.productOwner.create({ data: { name: 'Sarah Chen', slug: slugify('Sarah Chen'), email: 'sarah.chen@healf.com' } }),
    prisma.productOwner.create({ data: { name: 'Marcus Johnson', slug: slugify('Marcus Johnson'), email: 'marcus.johnson@healf.com' } }),
    prisma.productOwner.create({ data: { name: 'Priya Sharma', slug: slugify('Priya Sharma'), email: 'priya.sharma@healf.com' } }),
    prisma.productOwner.create({ data: { name: 'James Okonkwo', slug: slugify('James Okonkwo'), email: 'james.okonkwo@healf.com' } }),
    prisma.productOwner.create({ data: { name: 'Elena Rodriguez', slug: slugify('Elena Rodriguez'), email: 'elena.rodriguez@healf.com' } }),
    prisma.productOwner.create({ data: { name: 'David Kim', slug: slugify('David Kim'), email: 'david.kim@healf.com' } }),
  ])

  const ownerMap: Record<OwnerKey, { id: number }> = { skin, fit, med, well, nutri, care }

  for (const p of PRODUCTS) {
    const slug = await uniqueProductSlug(prisma, slugify(p.name))
    await prisma.product.create({
      data: {
        sku: p.sku,
        name: p.name,
        slug,
        description: p.description,
        price: p.price,
        inventory: p.inventory,
        status: p.status,
        ownerId: ownerMap[p.ownerKey].id,
        ...(p.imageUrl && { imageUrl: p.imageUrl }),
        ...(p.createdAt && { createdAt: p.createdAt }),
      },
    })
  }

  console.log(`Database seeding completed successfully! Seeded ${PRODUCTS.length} products and 6 owners.`)
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })