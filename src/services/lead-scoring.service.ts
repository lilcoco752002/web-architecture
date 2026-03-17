import { prisma } from '@/lib/prisma'

// Lead scoring interface
interface LeadScore {
  score: number
  grade: 'A' | 'B' | 'C' | 'D'
  priority: 1 | 2 | 3 | 4
  factors: {
    budget: number
    timeline: number
    scope: number
    source: number
    engagement: number
  }
}

// Enhanced Lead Service with scoring and automation
export class LeadScoringService {
  /**
   * Calculate comprehensive lead score (0-100)
   */
  static calculateLeadScore(lead: any): LeadScore {
    const factors = {
      budget: this.scoreBudget(lead.budget),
      timeline: this.scoreTimeline(lead.timeline),
      scope: this.scoreScope(lead.projectType, lead.scope),
      source: this.scoreSource(lead.source),
      engagement: this.scoreEngagement(lead),
    }

    const score = Object.values(factors).reduce((sum, val) => sum + val, 0)
    const grade = this.getGrade(score)
    const priority = this.getPriority(grade)

    return {
      score,
      grade,
      priority,
      factors,
    }
  }

  /**
   * Budget scoring (40 points max)
   */
  private static scoreBudget(budget: string | null): number {
    if (!budget) return 5

    const budgetNum = this.parseBudget(budget)
    
    if (budgetNum >= 250000) return 40 // Premium
    if (budgetNum >= 100000) return 30 // High-value
    if (budgetNum >= 50000) return 20  // Mid-tier
    if (budgetNum >= 25000) return 10  // Entry-level
    if (budgetNum > 0) return 5        // Low-priority
    
    return 5 // Unknown
  }

  /**
   * Timeline scoring (20 points max)
   */
  private static scoreTimeline(timeline: string | null): number {
    if (!timeline) return 0

    const lower = timeline.toLowerCase()
    
    if (lower.includes('immediate') || lower.includes('0-1')) return 20
    if (lower.includes('1-3 month')) return 15
    if (lower.includes('3-6 month')) return 10
    if (lower.includes('6-12 month')) return 5
    
    return 0
  }

  /**
   * Project scope scoring (15 points max)
   */
  private static scoreScope(projectType: string, scope: string | null): number {
    let score = 0

    // Project type scoring
    if (projectType === 'COMMERCIAL') score += 15
    else if (projectType === 'RESIDENTIAL') score += 12
    else if (projectType === 'HOSPITALITY') score += 15
    else score += 5

    // Scope modifier
    if (scope) {
      const lower = scope.toLowerCase()
      if (lower.includes('full') || lower.includes('entire')) score *= 1.2
      else if (lower.includes('renovation')) score *= 1.0
      else if (lower.includes('single') || lower.includes('one room')) score *= 0.5
    }

    return Math.min(Math.round(score), 15)
  }

  /**
   * Lead source scoring (15 points max)
   */
  private static scoreSource(source: string): number {
    const sourceScores: Record<string, number> = {
      REFERRAL: 15,
      PAST_CLIENT: 15,
      PROFESSIONAL_REFERRAL: 12,
      WEBSITE: 10,
      SOCIAL_MEDIA: 7,
      ADVERTISEMENT: 5,
      EVENT: 5,
      OTHER: 3,
    }

    return sourceScores[source] || 5
  }

  /**
   * Engagement scoring (10 points max)
   */
  private static scoreEngagement(lead: any): number {
    let score = 0

    // Fast response (within 1 hour)
    if (lead.responseTime && lead.responseTime < 3600) score += 5
    else if (lead.responseTime && lead.responseTime < 86400) score += 3

    // Detailed information provided
    if (lead.projectType && lead.budget && lead.timeline) score += 3

    // Portfolio views
    if (lead.portfolioViews && lead.portfolioViews > 0) score += 2

    // Downloaded materials
    if (lead.downloadsCount && lead.downloadsCount > 0) score += 2

    // Multiple touchpoints
    if (lead.touchpoints && lead.touchpoints > 2) score += 3

    return Math.min(score, 10)
  }

  /**
   * Convert score to grade
   */
  private static getGrade(score: number): 'A' | 'B' | 'C' | 'D' {
    if (score >= 80) return 'A'
    if (score >= 60) return 'B'
    if (score >= 40) return 'C'
    return 'D'
  }

  /**
   * Convert grade to priority
   */
  private static getPriority(grade: 'A' | 'B' | 'C' | 'D'): 1 | 2 | 3 | 4 {
    const priorities = { A: 1, B: 2, C: 3, D: 4 }
    return priorities[grade] as 1 | 2 | 3 | 4
  }

  /**
   * Parse budget string to number
   */
  private static parseBudget(budget: string): number {
    const lower = budget.toLowerCase().replace(/[,$]/g, '')
    
    if (lower.includes('250k+') || lower.includes('>250')) return 300000
    if (lower.includes('100k-250k')) return 175000
    if (lower.includes('50k-100k')) return 75000
    if (lower.includes('25k-50k')) return 37500
    if (lower.includes('<25k') || lower.includes('< 25k')) return 20000
    
    // Try to extract number
    const match = lower.match(/\d+/)
    if (match) {
      const num = parseInt(match[0])
      if (lower.includes('k')) return num * 1000
      return num
    }
    
    return 0
  }

  /**
   * Update lead with score
   * Note: Score/grade fields need to be added to Lead model in schema.prisma
   */
  static async updateLeadScore(leadId: string): Promise<void> {
    const lead = await prisma.lead.findUnique({ where: { id: leadId } })
    if (!lead) throw new Error('Lead not found')

    const scoreData = this.calculateLeadScore(lead)

    // TODO: Add score, grade, priority fields to Lead model
    // await prisma.lead.update({
    //   where: { id: leadId },
    //   data: {
    //     score: scoreData.score,
    //     grade: scoreData.grade,
    //     priority: scoreData.priority,
    //   },
    // })
    
    console.log(`Lead ${leadId} scored: ${scoreData.score} (Grade ${scoreData.grade})`)
  }

  /**
   * Get leads by grade
   * Note: This is a placeholder until grade field is added to schema
   */
  static async getLeadsByGrade(grade: 'A' | 'B' | 'C' | 'D') {
    // Get all leads and filter in memory until schema is updated
    const leads = await prisma.lead.findMany({
      where: { 
        status: { in: ['NEW', 'CONTACTED', 'QUALIFIED'] }
      },
      orderBy: { createdAt: 'desc' },
    })
    
    return leads.filter(lead => {
      const scoreData = this.calculateLeadScore(lead)
      return scoreData.grade === grade
    })
  }

  /**
   * Get hot leads (A-grade, immediate attention)
   */
  static async getHotLeads() {
    const leads = await prisma.lead.findMany({
      where: {
        status: { in: ['NEW', 'CONTACTED'] },
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      orderBy: { createdAt: 'desc' },
    })
    
    return leads.filter(lead => {
      const scoreData = this.calculateLeadScore(lead)
      return scoreData.grade === 'A'
    })
  }

  /**
   * Get stale leads (no activity in 48+ hours)
   */
  static async getStaleLeads() {
    return prisma.lead.findMany({
      where: {
        status: { in: ['NEW', 'CONTACTED'] },
        updatedAt: {
          lte: new Date(Date.now() - 48 * 60 * 60 * 1000) // 48 hours ago
        }
      },
      orderBy: { priority: 'asc' },
    })
  }

  /**
   * Recommend next action based on lead score
   */
  static getRecommendedActions(_lead: any, scoreData: LeadScore): string[] {
    const actions: string[] = []

    if (scoreData.grade === 'A') {
      actions.push('🚨 URGENT: Contact within 15 minutes')
      actions.push('Assign to senior designer immediately')
      actions.push('Schedule consultation within 48 hours')
      actions.push('Send premium welcome package')
    } else if (scoreData.grade === 'B') {
      actions.push('Contact within 1 hour')
      actions.push('Assign to mid-level designer')
      actions.push('Schedule consultation within 5 days')
      actions.push('Send standard welcome email')
    } else if (scoreData.grade === 'C') {
      actions.push('Contact within 4 hours')
      actions.push('Assign to junior designer')
      actions.push('Offer virtual consultation')
      actions.push('Send educational content')
    } else {
      actions.push('Send automated response')
      actions.push('Add to nurture campaign')
      actions.push('Re-qualify in 90 days')
      actions.push('Send monthly newsletter')
    }

    // Add specific recommendations based on weak factors
    if (scoreData.factors.budget < 15) {
      actions.push('⚠️ Discuss budget expectations')
      actions.push('Offer phased approach or package options')
    }

    if (scoreData.factors.timeline < 10) {
      actions.push('⚠️ Clarify project timeline')
      actions.push('Add to long-term nurture if >6 months')
    }

    if (scoreData.factors.engagement < 5) {
      actions.push('⚠️ Increase engagement with content')
      actions.push('Send portfolio examples relevant to project')
    }

    return actions
  }
}

// Automation rules implementation
export class AutomationService {
  /**
   * Auto-response when new lead is created
   */
  static async handleNewLead(leadId: string): Promise<void> {
    const lead = await prisma.lead.findUnique({ where: { id: leadId } })
    if (!lead) return

    // 1. Calculate lead score
    const scoreData = LeadScoringService.calculateLeadScore(lead)
    // TODO: Store score when fields are added to schema
    // await prisma.lead.update({
    //   where: { id: leadId },
    //   data: {
    //     score: scoreData.score,
    //     grade: scoreData.grade,
    //     priority: scoreData.priority,
    //   },
    // })
    console.log(`Lead ${leadId} scored: ${scoreData.score} (Grade ${scoreData.grade})`)

    // 2. Send welcome email (implement email service)
    // await EmailService.sendWelcomeEmail(lead)

    // 3. Assign to designer based on grade
    const designer = await this.assignDesigner(scoreData.grade)
    if (designer) {
      // Assignment logic here - implement when needed
      console.log(`Assigned lead ${leadId} to designer ${designer.id}`)
    }

    // 4. Create follow-up task
    // Task creation commented out until task system implemented
    // const followUpDelay = scoreData.grade === 'A' || scoreData.grade === 'B' 
    //   ? 1 * 60 * 60 * 1000 // 1 hour
    //   : 4 * 60 * 60 * 1000 // 4 hours

    // await TaskService.createTask({
    //   leadId,
    //   type: 'FOLLOW_UP',
    //   dueDate: new Date(Date.now() + followUpDelay),
    //   assignedToId: designer?.id,
    // })
  }

  /**
   * Assign designer based on lead grade (round-robin)
   */
  private static async assignDesigner(_grade: 'A' | 'B' | 'C' | 'D') {
    // Get available designers (simplified for now)
    const designers = await prisma.user.findMany({
      where: { 
        role: 'STAFF',
        status: 'ACTIVE',
      },
      orderBy: {
        createdAt: 'asc'
      },
      take: 1
    })

    return designers[0] || null
  }

  /**
   * Check for stale leads and send reminders
   */
  static async checkStaleLeads(): Promise<void> {
    const staleLeads = await LeadScoringService.getStaleLeads()

    for (const lead of staleLeads) {
      // Send alert to assigned designer
      // await NotificationService.sendAlert(lead.assignedToId, {
      //   type: 'STALE_LEAD',
      //   leadId: lead.id,
      //   message: `Lead ${lead.name} has no activity for 48+ hours`
      // })

      // Send automated follow-up email
      // await EmailService.sendFollowUp(lead)

      // Escalate if >72 hours
      if (lead.updatedAt < new Date(Date.now() - 72 * 60 * 60 * 1000)) {
        // await NotificationService.sendManagerAlert(...)
      }
    }
  }

  /**
   * Handle consultation scheduled
   */
  static async handleConsultationScheduled(bookingId: string): Promise<void> {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { client: true }
    })
    if (!booking) return

    // Send confirmation email
    // await EmailService.sendConsultationConfirmation(booking)

    // Schedule reminders based on booking date
    // const consultationDate = booking.startTime
    
    // 48 hours before
    // await ScheduleService.scheduleEmail({
    //   to: booking.client.email,
    //   template: 'CONSULTATION_REMINDER_48H',
    //   sendAt: new Date(consultationDate.getTime() - 48 * 60 * 60 * 1000)
    // })

    // 24 hours before
    // await ScheduleService.scheduleEmail({
    //   to: booking.client.email,
    //   template: 'CONSULTATION_REMINDER_24H',
    //   sendAt: new Date(consultationDate.getTime() - 24 * 60 * 60 * 1000)
    // })

    // 2 hours before (SMS)
    // await ScheduleService.scheduleSMS({
    //   to: booking.client.phone,
    //   message: 'Reminder: Your design consultation is in 2 hours...',
    //   sendAt: new Date(consultationDate.getTime() - 2 * 60 * 60 * 1000)
    // })
  }

  /**
   * Quotation follow-up sequence
   */
  static async startQuotationFollowUp(quotationId: string): Promise<void> {
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { client: true }
    })
    if (!quotation) return

    // Day 2: Check-in email
    // await ScheduleService.scheduleEmail({
    //   sendAt: addDays(new Date(), 2),
    //   template: 'QUOTATION_CHECKIN',
    //   data: { quotation }
    // })

    // Day 5: Schedule follow-up call
    // await TaskService.createTask({
    //   type: 'FOLLOW_UP_CALL',
    //   dueDate: addDays(new Date(), 5),
    //   quotationId
    // })

    // Day 10: Send case study
    // await ScheduleService.scheduleEmail({
    //   sendAt: addDays(new Date(), 10),
    //   template: 'CASE_STUDY',
    // })

    // Day 15: Urgency email (early-bird expiring)
    // Day 21: Final follow-up
    // Day 30: Archive or nurture
  }
}

// Helper function (commented out until needed)
// function addDays(date: Date, days: number): Date {
//   const result = new Date(date)
//   result.setDate(result.getDate() + days)
//   return result
// }
