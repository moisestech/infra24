import type { MemoryAgentBranding } from '@/lib/memory-agent/org-branding'

/** Rotating kiosk greetings — client-only; not sent to the model. */
function welcomeTemplates(agentName: string, orgName: string): string[] {
  return [
    `Hi, I'm ${agentName}. Welcome to ${orgName}'s institutional memory—ask out loud or type whenever you're ready.`,
    `Hello! ${agentName} here. I can help you explore our network, programs, and people. What would you like to discover?`,
    `Good to see you. I'm ${agentName}, your guide to ${orgName}'s artist and program knowledge. Try a question about a medium, a place, or what's on.`,
    `Welcome in. I'm ${agentName}—whether you're planning a visit, a partnership, or just curious, ask about artists, alumni, or programs.`,
    `Hi there. I'm ${agentName}. Glad you're here—I'll point you toward people and stories that fit what you're looking for.`,
  ]
}

export function pickMemoryAgentWelcomeMessage(branding: MemoryAgentBranding): string {
  const pool = welcomeTemplates(branding.agentName, branding.orgName)
  const index = Math.floor(Math.random() * pool.length)
  return pool[index] ?? pool[0]
}
