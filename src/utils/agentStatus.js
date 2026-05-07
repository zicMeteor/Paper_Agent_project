export function getAgentStatus(agent) {
  if (!agent.isConfigured || agent.keywords.length === 0 || agent.sources.length === 0) return 'unset'

  const hasNotification =
    agent.notifications.discord.connected ||
    agent.notifications.slack.connected

  if (!agent.isActive || !hasNotification) return 'paused'
  return 'active'
}

export const STATUS_CONFIG = {
  unset: {
    label: '미설정',
    bg: 'bg-gray-100',
    text: 'text-gray-500',
    dot: 'bg-gray-300',
  },
  active: {
    label: '활성화',
    bg: 'bg-green-50',
    text: 'text-green-600',
    dot: 'bg-green-500',
  },
  paused: {
    label: '일시정지',
    bg: 'bg-red-50',
    text: 'text-red-600',
    dot: 'bg-red-500',
  },
}
