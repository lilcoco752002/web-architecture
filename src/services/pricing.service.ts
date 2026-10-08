// Pricing calculation interfaces
interface PricingParams {
  projectType: 'RESIDENTIAL' | 'COMMERCIAL' | 'HOSPITALITY'
  rooms: RoomSpec[]
  sqft: number
  qualityLevel: 'BASIC' | 'MID' | 'LUXURY'
  services: string[]
  timeline: number // weeks
  location: string // zip code
  rush?: boolean
}

interface RoomSpec {
  name: string
  type: 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'other'
  sqft: number
  condition: 'good' | 'fair' | 'poor'
}

interface PricingBreakdown {
  designFee: number
  designFeeBreakdown: {
    consultation: number
    conceptDevelopment: number
    documentation: number
    projectManagement: number
  }
  implementationCost: number
  implementationBreakdown: {
    labor: number
    materials: number
    furniture: number
    fixtures: number
  }
  contingency: number
  subtotal: number
  discount: number
  total: number
  roomBreakdown: RoomPricing[]
  paymentSchedule: PaymentSchedule
}

interface RoomPricing {
  room: string
  sqft: number
  cost: number
  breakdown: {
    design: number
    labor: number
    materials: number
    furniture: number
  }
}

interface PaymentSchedule {
  deposit: { amount: number; percentage: number; due: string }
  progress: { amount: number; percentage: number; due: string }
  midpoint: { amount: number; percentage: number; due: string }
  final: { amount: number; percentage: number; due: string }
}

export class PricingService {
  /**
   * Generate comprehensive quotation
   */
  static generateQuotation(params: PricingParams): PricingBreakdown {
    if (!Number.isFinite(params.sqft) || params.sqft <= 0 ||
        params.rooms.some(room => !Number.isFinite(room.sqft) || room.sqft <= 0) ||
        params.rooms.reduce((sum, room) => sum + room.sqft, 0) > params.sqft) {
      throw new Error('Invalid project or room area')
    }
    // Calculate design fees
    const designFee = this.calculateDesignFees(params)
    
    // Calculate implementation costs
    const implementation = this.calculateImplementationCosts(params)
    
    // Calculate room-by-room breakdown
    const roomBreakdown = this.calculateRoomBreakdown(params)
    
    // Calculate totals
    const subtotal = designFee.total + implementation.total
    const contingency = Math.round(subtotal * 0.10) // 10% contingency
    const discount = this.calculateDiscount(subtotal, params)
    const total = subtotal + contingency - discount
    
    // Generate payment schedule
    const paymentSchedule = this.generatePaymentSchedule(total)
    
    return {
      designFee: designFee.total,
      designFeeBreakdown: designFee.breakdown,
      implementationCost: implementation.total,
      implementationBreakdown: implementation.breakdown,
      contingency,
      subtotal,
      discount,
      total,
      roomBreakdown,
      paymentSchedule,
    }
  }

  /**
   * Calculate design fees (15-30% of project)
   */
  private static calculateDesignFees(params: PricingParams) {
    const baseRates = {
      RESIDENTIAL: {
        BASIC: 15,   // $/sqft
        MID: 25,
        LUXURY: 40,
      },
      COMMERCIAL: {
        BASIC: 12,
        MID: 20,
        LUXURY: 35,
      },
      HOSPITALITY: {
        BASIC: 18,
        MID: 28,
        LUXURY: 45,
      },
    }

    const rate = baseRates[params.projectType][params.qualityLevel]
    let baseFee = params.sqft * rate

    // Service multipliers
    const serviceMultipliers: Record<string, number> = {
      '3d-rendering': 1.15,
      'custom-furniture': 1.20,
      'art-curation': 1.10,
      'ff-e-procurement': 1.12,
      'full-project-management': 1.25,
    }

    params.services.forEach(service => {
      if (serviceMultipliers[service]) {
        baseFee *= serviceMultipliers[service]
      }
    })

    // Rush fee
    if (params.rush || params.timeline < 12) {
      baseFee *= 1.15
    }

    // Minimum design fee
    const total = Math.max(Math.round(baseFee), 15000)

    // Breakdown (typical split)
    const breakdown = {
      consultation: Math.round(total * 0.10),      // 10%
      conceptDevelopment: Math.round(total * 0.40), // 40%
      documentation: Math.round(total * 0.25),      // 25%
      projectManagement: Math.round(total * 0.25),  // 25%
    }

    return { total, breakdown }
  }

  /**
   * Calculate implementation costs
   */
  private static calculateImplementationCosts(params: PricingParams) {
    const baseRates = {
      RESIDENTIAL: {
        BASIC: { labor: 50, materials: 75 },
        MID: { labor: 80, materials: 120 },
        LUXURY: { labor: 125, materials: 225 },
      },
      COMMERCIAL: {
        BASIC: { labor: 45, materials: 55 },
        MID: { labor: 70, materials: 105 },
        LUXURY: { labor: 110, materials: 190 },
      },
      HOSPITALITY: {
        BASIC: { labor: 55, materials: 85 },
        MID: { labor: 90, materials: 135 },
        LUXURY: { labor: 140, materials: 250 },
      },
    }

    const rates = baseRates[params.projectType][params.qualityLevel]
    
    let labor = params.sqft * rates.labor
    let materials = params.sqft * rates.materials

    // Adjust each room's base area once; preserve base rates for unspecified area.
    const roomMultipliers = { kitchen: 1.25, bathroom: 1.20, living: 1, bedroom: 0.9, other: 1 }
    const conditionMultipliers = { good: 1, fair: 1.15, poor: 1.35 }
    for (const room of params.rooms) {
      const adjustment = roomMultipliers[room.type] * conditionMultipliers[room.condition] - 1
      labor += room.sqft * rates.labor * adjustment
      materials += room.sqft * rates.materials * adjustment
    }

    // Location cost index
    const locationMultiplier = this.getLocationMultiplier(params.location)
    labor *= locationMultiplier
    materials *= locationMultiplier

    // Furniture estimate (30-40% of materials for residential)
    const furniture = params.projectType === 'RESIDENTIAL' 
      ? Math.round(materials * 0.35)
      : Math.round(materials * 0.20)

    // Fixtures estimate (10-15% of materials)
    const fixtures = Math.round(materials * 0.12)

    const total = Math.round(labor + materials + furniture + fixtures)

    return {
      total,
      breakdown: {
        labor: Math.round(labor),
        materials: Math.round(materials),
        furniture,
        fixtures,
      },
    }
  }

  /**
   * Room-by-room breakdown
   */
  private static calculateRoomBreakdown(params: PricingParams): RoomPricing[] {
    const basePricing = {
      living: { basic: 15000, mid: 35000, luxury: 75000 },
      bedroom: { basic: 10000, mid: 25000, luxury: 50000 },
      kitchen: { basic: 30000, mid: 55000, luxury: 125000 },
      bathroom: { basic: 18000, mid: 35000, luxury: 75000 },
      other: { basic: 8000, mid: 15000, luxury: 35000 },
    }

    return params.rooms.map(room => {
      const quality = params.qualityLevel.toLowerCase() as 'basic' | 'mid' | 'luxury'
      const basePrice = basePricing[room.type]?.[quality] || 10000
      
      // Adjust for sqft (typical room sizes)
      const typicalSqft: Record<string, number> = {
        living: 400,
        bedroom: 300,
        kitchen: 200,
        bathroom: 80,
        other: 250,
      }
      
      const sqftMultiplier = room.sqft / (typicalSqft[room.type] || 250)
      const adjustedCost = Math.round(basePrice * sqftMultiplier)

      // Breakdown percentages
      const design = Math.round(adjustedCost * 0.20)
      const labor = Math.round(adjustedCost * 0.30)
      const materials = Math.round(adjustedCost * 0.25)
      const furniture = Math.round(adjustedCost * 0.25)

      return {
        room: room.name,
        sqft: room.sqft,
        cost: adjustedCost,
        breakdown: { design, labor, materials, furniture },
      }
    })
  }

  /**
   * Calculate discount
   */
  private static calculateDiscount(subtotal: number, params: PricingParams): number {
    let discount = 0

    // Early-bird discount (5% if signed within 7 days)
    // This would be applied after quotation is sent
    
    // Package discount for multiple rooms
    if (params.rooms.length >= 5) {
      discount += Math.round(subtotal * 0.05) // 5% off
    } else if (params.rooms.length >= 3) {
      discount += Math.round(subtotal * 0.03) // 3% off
    }

    // Referral discount
    // if (params.referral) discount += Math.round(subtotal * 0.05)

    return discount
  }

  /**
   * Location cost multiplier
   */
  private static getLocationMultiplier(zipCode: string): number {
    // NYC zip codes (high cost)
    const nycZips = ['10001', '10002', '10003', '10004', '10005']
    if (nycZips.some(zip => zipCode.startsWith(zip.substring(0, 3)))) {
      return 1.25
    }

    // Suburban areas (medium cost)
    return 1.0
  }

  /**
   * Generate payment schedule
   */
  private static generatePaymentSchedule(total: number): PaymentSchedule {
    return {
      deposit: {
        amount: Math.round(total * 0.30),
        percentage: 30,
        due: 'At contract signing',
      },
      progress: {
        amount: Math.round(total * 0.30),
        percentage: 30,
        due: 'At design completion',
      },
      midpoint: {
        amount: Math.round(total * 0.30),
        percentage: 30,
        due: 'At 50% construction completion',
      },
      final: {
        amount: total - 3 * Math.round(total * 0.30),
        percentage: 10,
        due: 'At project completion',
      },
    }
  }

  /**
   * Generate package options (Bronze, Silver, Gold)
   */
  static generatePackageOptions(baseParams: PricingParams) {
    const bronze: PricingParams = {
      ...baseParams,
      qualityLevel: 'BASIC',
      services: ['consultation', 'concept-boards'],
    }

    const silver: PricingParams = {
      ...baseParams,
      qualityLevel: 'MID',
      services: ['consultation', 'design-documentation', '3d-rendering', 'vendor-coordination'],
    }

    const gold: PricingParams = {
      ...baseParams,
      qualityLevel: 'LUXURY',
      services: ['consultation', 'design-documentation', '3d-rendering', 'full-project-management', 'custom-furniture', 'art-curation'],
    }

    return {
      bronze: this.generateQuotation(bronze),
      silver: this.generateQuotation(silver),
      gold: this.generateQuotation(gold),
    }
  }

  /**
   * Quick estimate (simplified, for initial conversation)
   */
  static quickEstimate(params: {
    projectType: string
    rooms: number
    qualityLevel: string
  }): { min: number; max: number; typical: number } {
    const ranges = {
      RESIDENTIAL: {
        BASIC: { perRoom: 15000 },
        MID: { perRoom: 35000 },
        LUXURY: { perRoom: 75000 },
      },
      COMMERCIAL: {
        BASIC: { perRoom: 12000 },
        MID: { perRoom: 28000 },
        LUXURY: { perRoom: 65000 },
      },
    }

    const type = params.projectType as 'RESIDENTIAL' | 'COMMERCIAL'
    const level = params.qualityLevel as 'BASIC' | 'MID' | 'LUXURY'
    const perRoom = ranges[type]?.[level]?.perRoom || 25000

    const typical = perRoom * params.rooms
    const min = Math.round(typical * 0.75)
    const max = Math.round(typical * 1.35)

    return { min, max, typical }
  }
}
