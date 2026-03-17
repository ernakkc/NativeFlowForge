import { Terminal } from './terminal';
import type { INodePlugin } from '../shared/types';

export type NodePluginFactory = () => INodePlugin;
export type NodePluginRegistry = Map<string, INodePlugin>;

export function createDefaultNodePluginRegistry(
  extraFactories: Record<string, NodePluginFactory> = {},
): NodePluginRegistry {
  const factories: Record<string, NodePluginFactory> = {
    terminal: () => new Terminal(),
    ...extraFactories,
  };

  const registry: NodePluginRegistry = new Map();

  for (const [nodeType, createPlugin] of Object.entries(factories)) {
    registry.set(nodeType, createPlugin());
  }

  return registry;
}
