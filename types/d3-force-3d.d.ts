/**
 * Narrow, local type surface for d3-force-3d 3.x.
 * The package ships JavaScript without TypeScript declarations.  This models only
 * the force/simulation methods used by our 3D graph and preserves typed nodes/links.
 * Do not replace with an untyped catch-all declaration.
 */
declare module 'd3-force-3d' {
  export interface SimulationNodeDatum3D {
    index?: number
    x?: number
    y?: number
    z?: number
    vx?: number
    vy?: number
    vz?: number
  }

  export interface Force3D<NodeDatum extends SimulationNodeDatum3D> {
    (alpha: number): void
  }

  export interface Simulation3D<NodeDatum extends SimulationNodeDatum3D> {
    force(name: string, force: Force3D<NodeDatum>): this
    stop(): this
    tick(iterations?: number): this
  }

  export interface LinkForce3D<NodeDatum extends SimulationNodeDatum3D, LinkDatum> extends Force3D<NodeDatum> {
    id(getId: (node: NodeDatum) => string): this
    distance(value: number | ((link: LinkDatum) => number)): this
    strength(value: number | ((link: LinkDatum) => number)): this
  }

  export interface ManyBodyForce3D<NodeDatum extends SimulationNodeDatum3D> extends Force3D<NodeDatum> {
    strength(value: number): this
  }

  export function forceSimulation<NodeDatum extends SimulationNodeDatum3D>(
    nodes: NodeDatum[],
    dimensions?: number
  ): Simulation3D<NodeDatum>

  export function forceLink<
    NodeDatum extends SimulationNodeDatum3D,
    LinkDatum extends { source: string | NodeDatum; target: string | NodeDatum }
  >(links: LinkDatum[]): LinkForce3D<NodeDatum, LinkDatum>

  export function forceManyBody<NodeDatum extends SimulationNodeDatum3D>(): ManyBodyForce3D<NodeDatum>

  export function forceCenter<NodeDatum extends SimulationNodeDatum3D>(
    x?: number,
    y?: number,
    z?: number
  ): Force3D<NodeDatum>
}
