export function computeAgentPerformance(tickets, users) {
  const agentUsers = users.filter((u) => u.role === 'agent' || u.role === 'admin');
  const map = new Map(
    agentUsers.map((u) => [u.id, { agentId: u.id, agentName: u.name, completed: 0 }]),
  );

  for (const ticket of tickets) {
    if (ticket.status !== 'Closed' || !ticket.closedBy?.agentId) continue;

    const existing = map.get(ticket.closedBy.agentId);
    if (existing) {
      existing.completed += 1;
    } else {
      map.set(ticket.closedBy.agentId, {
        agentId: ticket.closedBy.agentId,
        agentName: ticket.closedBy.agentName || 'Unknown agent',
        completed: 1,
      });
    }
  }

  return [...map.values()].sort((a, b) => b.completed - a.completed);
}
