jest.mock('d3-force-3d', () => ({
  forceSimulation: (nodes: { x: number; y: number; z: number }[]) => ({
    force: jest.fn().mockReturnThis(),
    stop: jest.fn().mockReturnValue({
      tick: jest.fn(() => {
        nodes.forEach((n, i) => {
          n.x = Math.cos(i) * 10
          n.y = Math.sin(i) * 10
          n.z = i * 0.5
        })
      }),
    }),
  }),
  forceLink: jest.fn(() => ({
    id: jest.fn().mockReturnThis(),
    distance: jest.fn().mockReturnThis(),
    strength: jest.fn().mockReturnThis(),
  })),
  forceManyBody: jest.fn(() => ({
    strength: jest.fn().mockReturnThis(),
  })),
  forceCenter: jest.fn(),
}))

import { getSampleGraphPayload } from '@/lib/marketing/fixtures/dcc-crm-graph-sample'
import {
  buildGraph3D,
  filterGraphForImmersive3D,
  getEgoNetwork,
  nextLayoutMode,
} from '@/lib/marketing/network-graph-3d-layout'

describe('network-graph-3d-layout', () => {
  it('builds graph with positioned nodes and edges from fixture', () => {
    const payload = getSampleGraphPayload('explorer')
    const graph = buildGraph3D(payload, 'organic', 'kind')
    expect(graph.nodes.length).toBeGreaterThan(0)
    expect(graph.edges.length).toBeGreaterThan(0)
    for (const n of graph.nodes) {
      expect(Number.isFinite(n.x)).toBe(true)
      expect(Number.isFinite(n.y)).toBe(true)
      expect(Number.isFinite(n.z)).toBe(true)
      expect(n.color).toMatch(/^#/)
    }
  })

  it('caps immersive graph size', () => {
    const payload = getSampleGraphPayload('explorer')
    const { nodes } = filterGraphForImmersive3D(payload, 10)
    expect(nodes.length).toBeLessThanOrEqual(10)
  })

  it('returns ego network with neighbors', () => {
    const payload = getSampleGraphPayload('explorer')
    const graph = buildGraph3D(payload, 'organic', 'kind')
    const person = graph.nodes.find((n) => n.data.kind === 'person')
    expect(person).toBeDefined()
    const ego = getEgoNetwork(person!.id, graph.adjacency)
    expect(ego.has(person!.id)).toBe(true)
    expect(ego.size).toBeGreaterThanOrEqual(1)
  })

  it('cycles layout modes', () => {
    expect(nextLayoutMode('organic')).toBe('institutionHubs')
    expect(nextLayoutMode('institutionHubs')).toBe('recencyRings')
    expect(nextLayoutMode('recencyRings')).toBe('organic')
  })
})
