// import { Injectable } from '@nestjs/common';
// import { InfrastructureRepository } from './infrastructure.repository';
// import { InfrastructureNodeRepository } from './infrastructure-node/infrastructure-node.repository';

// interface TreeNode {
//   id: string;
//   taskName: string;
//   slug: string;
//   progress: number | null;
//   computedProgress: number;
//   weight: number;
//   isLeaf: boolean;
//   children: TreeNode[];
//   duration?: number;
//   startDate?: Date;
//   finishDate?: Date;
//   priority?: number;
//   actualHour?: number;
//   plannedHour?: number;
//   plannedCost?: number;
//   plannedResourceCost?: number;
//   [key: string]: any;
// }

// @Injectable()
// export class InfrastructureService {
//   constructor(
//     private readonly infrastructureRepo: InfrastructureRepository,
//     private readonly nodeRepo: InfrastructureNodeRepository,
//   ) {}

//   /**
//    * Recursively propagate progress upward from a given node to its ancestors
//    */
//   async propagateUp(nodeId: string | null | undefined): Promise<void> {
//     if (!nodeId) return;

//     const node = await this.infrastructureRepo.findNodeById(nodeId);
//     if (!node) return;

//     // Calculate weighted average of children's computed progress
//     const children = await this.nodeRepo.findChildren(nodeId);

//     if (children.length === 0) {
//       // No children - should be a leaf (but double-check)
//       return;
//     }

//     const totalWeight = children.reduce((sum, child) => sum + child.weight, 0);

//     if (totalWeight === 0) {
//       // Avoid division by zero
//       await this.nodeRepo.updateNode(nodeId, { computedProgress: 0 });
//       await this.propagateUp(node.parentId);
//       return;
//     }

//     const weightedSum = children.reduce(
//       (sum, child) => sum + child.computedProgress * child.weight,
//       0,
//     );

//     const newComputedProgress = weightedSum / totalWeight;

//     await this.nodeRepo.updateNode(nodeId, {
//       computedProgress: newComputedProgress,
//     });

//     // Continue propagating up
//     await this.propagateUp(node.parentId);
//   }

//   /**
//    * Update project's overall progress based on root nodes
//    */
//   async updateProjectProgress(projectId: string): Promise<void> {
//     const rootNodes = await this.nodeRepo.findRootNodes(projectId);

//     if (rootNodes.length === 0) {
//       await this.nodeRepo.updateProjectProgress(projectId, 0);
//       return;
//     }

//     const totalWeight = rootNodes.reduce((sum, node) => sum + node.weight, 0);

//     if (totalWeight === 0) {
//       await this.nodeRepo.updateProjectProgress(projectId, 0);
//       return;
//     }

//     const weightedSum = rootNodes.reduce(
//       (sum, node) => sum + node.computedProgress * node.weight,
//       0,
//     );

//     const projectProgress = weightedSum / totalWeight;

//     await this.nodeRepo.updateProjectProgress(
//       projectId,
//       Math.round(projectProgress * 100) / 100, // Round to 2 decimal places
//     );
//   }

//   /**
//    * Build a tree structure from a root node
//    */
//   async buildTree(node: any): Promise<TreeNode> {
//     const children = await this.nodeRepo.findChildren(node.id);

//     const childTrees = await Promise.all(
//       children.map((child) => this.buildTree(child)),
//     );

//     return {
//       id: node.id,
//       taskName: node.taskName,
//       slug: node.slug,
//       progress: node.progress, // [[1,2,3], []]
//       computedProgress: node.computedProgress,
//       weight: node.weight,
//       isLeaf: node.isLeaf,
//       duration: node.duration,
//       startDate: node.startDate,
//       finishDate: node.finishDate,
//       priority: node.priority,
//       actualHour: node.actualHour,
//       plannedHour: node.plannedHour,
//       plannedCost: node.plannedCost,
//       plannedResourceCost: node.plannedResourceCost,
//       children: childTrees,
//     };
//   }

//   /**
//    * Get full tree structure for a project
//    */
//   async getProjectTree<T>(projectId: string): Promise<T[]> {
//     const rootNodes = await this.nodeRepo.findRootNodes(projectId);

//     const trees = await Promise.all(
//       rootNodes.map((node: any) => this.buildTree(node)),
//     );

//     return trees as any;
//   }

//   /**
//    * Get tree structure from a specific node
//    */
//   async getNodeTree<T = any>(nodeId: string): Promise<T> {
//     const node = await this.infrastructureRepo.findNodeById(nodeId);

//     if (!node) {
//       throw new Error(`Node with ID ${nodeId} not found`);
//     }

//     return this.buildTree(node) as T;
//   }

//   /**
//    * Get flat list of all nodes in a project with their hierarchy level
//    */
//   async getProjectNodesFlat(projectId: string) {
//     const nodes = await this.nodeRepo.findAllNodesByProject(projectId);

//     // Add level information
//     const nodeMap = new Map(nodes.map((node) => [node.id, node]));

//     const getLevel = (nodeId: string): number => {
//       const node = nodeMap.get(nodeId);
//       if (!node || !node.parentId) return 0;
//       return 1 + getLevel(node.parentId);
//     };

//     return nodes.map((node) => ({
//       ...node,
//       level: getLevel(node.id),
//     }));
//   }
// }



import { Injectable } from '@nestjs/common';
import { InfrastructureRepository } from './infrastructure.repository';
import { InfrastructureNodeRepository } from './infrastructure-node/infrastructure-node.repository';
import { JsonValue } from '@prisma/client/runtime/library';

// Export this interface at the top of the file
export interface TableData {
  identifierKey: string;
  identifierLabel: string;
  xAxis: string[];
  yAxis: string[];
  data: number[][];
}

export interface TreeNode {
  id: string;
  taskName: string;
  slug: string;
  progress: any[];
  computedProgress: number;
  computedProgressArray: any[];
  computedProgressTable: TableData;
  weight: number;
  isLeaf: boolean;
  children: TreeNode[];
  duration?: number;
  startDate?: Date;
  finishDate?: Date;
  priority?: string;
  actualHour?: number;
  plannedHour?: number;
  plannedCost?: number;
  plannedResourceCost?: number;
  [key: string]: any;
}

@Injectable()
export class InfrastructureService {
  constructor(
    private readonly infrastructureRepo: InfrastructureRepository,
    private readonly nodeRepo: InfrastructureNodeRepository,
  ) {}

  /**
   * Parse JSON value to number
   */
  private parseJsonToNumber(jsonValue: JsonValue | null | undefined): number {
    if (jsonValue === null || jsonValue === undefined) return 0;
    
    // If it's already a number
    if (typeof jsonValue === 'number') return jsonValue;
    
    // If it's a string, try to parse it
    if (typeof jsonValue === 'string') {
      const parsed = parseFloat(jsonValue);
      return isNaN(parsed) ? 0 : parsed;
    }
    
    // For arrays or objects, calculate average or return 0
    if (Array.isArray(jsonValue)) {
      if (jsonValue.length === 0) return 0;
      // Try to get numeric values from array
      const numbers = jsonValue.filter(v => typeof v === 'number');
      return numbers.length > 0 ? numbers.reduce((a, b) => a + b, 0) / numbers.length : 0;
    }
    
    // For objects, try to extract numeric values
    if (typeof jsonValue === 'object') {
      const values = Object.values(jsonValue).filter(v => typeof v === 'number');
      return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    }
    
    return 0;
  }

  /**
   * Recursively propagate progress upward from a given node to its ancestors
   */
  async propagateUp(nodeId: string | null | undefined): Promise<void> {
    if (!nodeId) return;

    const node = await this.infrastructureRepo.findNodeById(nodeId);
    if (!node) return;

    // Calculate weighted average of children's computed progress
    const children = await this.nodeRepo.findChildren(nodeId);

    if (children.length === 0) {
      // No children - should be a leaf (but double-check)
      return;
    }

    const totalWeight = children.reduce((sum, child) => sum + (child.weight || 0), 0);

    if (totalWeight === 0) {
      // Avoid division by zero
      await this.nodeRepo.updateNode(nodeId, { computedProgress: 0 });
      await this.propagateUp(node.parentId);
      return;
    }

    const weightedSum = children.reduce(
      (sum, child) => {
        const childProgress = this.parseJsonToNumber(child.computedProgress);
        return sum + (childProgress * (child.weight || 0));
      },
      0,
    );

    const newComputedProgress = weightedSum / totalWeight;

    await this.nodeRepo.updateNode(nodeId, {
      computedProgress: newComputedProgress,
    });

    // Continue propagating up
    await this.propagateUp(node.parentId);
  }

  /**
   * Update project's overall progress based on root nodes
   */
  async updateProjectProgress(projectId: string): Promise<void> {
    const rootNodes = await this.nodeRepo.findRootNodes(projectId);

    if (rootNodes.length === 0) {
      await this.nodeRepo.updateProjectProgress(projectId, 0);
      return;
    }

    const totalWeight = rootNodes.reduce((sum, node) => sum + (node.weight || 0), 0);

    if (totalWeight === 0) {
      await this.nodeRepo.updateProjectProgress(projectId, 0);
      return;
    }

    const weightedSum = rootNodes.reduce(
      (sum, node) => {
        const nodeProgress = this.parseJsonToNumber(node.computedProgress);
        return sum + (nodeProgress * (node.weight || 0));
      },
      0,
    );

    const projectProgress = weightedSum / totalWeight;

    await this.nodeRepo.updateProjectProgress(
      projectId,
      Math.round(projectProgress * 100) / 100, // Round to 2 decimal places
    );
  }

  /**
   * Build a tree structure from a root node with progress aggregation
   */
  async buildTree(node: any): Promise<TreeNode> {
    const children = await this.nodeRepo.findChildren(node.id);

    const childTrees = await Promise.all(
      children.map((child) => this.buildTree(child)),
    );

    // Parse progress data from database (JSON or array)
    const parseProgress = (progressData: JsonValue | null | undefined): any[] => {
      if (!progressData) return [];
      if (Array.isArray(progressData)) return progressData;
      try {
        if (typeof progressData === 'string') {
          const parsed = JSON.parse(progressData);
          return Array.isArray(parsed) ? parsed : [];
        }
      } catch {
        return [];
      }
      return [];
    };

    // Get node's own progress
    const nodeProgress = parseProgress(node.progress);

    // Helper to find identifier key (day, employeeId, etc.)
    const findIdentifierKey = (rowData: any): string | null => {
      const possibleIds = ['day', 'date', 'id', 'employeeId', 'code', 'name', 'key', 'no'];
      for (const key of possibleIds) {
        if (rowData[key] !== undefined) return key;
      }
      for (const key of Object.keys(rowData)) {
        if (typeof rowData[key] !== 'number') return key;
      }
      return null;
    };

    // Merge progress arrays from all children
    const mergeProgress = (progressList: any[][]): any[] => {
      const mergedMap = new Map<string, Record<string, any>>();
      
      for (const progressArray of progressList) {
        if (!Array.isArray(progressArray)) continue;
        
        for (const rowData of progressArray) {
          const idKey = findIdentifierKey(rowData);
          if (!idKey || !rowData[idKey]) continue;
          
          const idValue = rowData[idKey].toString();
          
          if (!mergedMap.has(idValue)) {
            mergedMap.set(idValue, { ...rowData });
            continue;
          }
          
          const existing = mergedMap.get(idValue)!;
          
          Object.entries(rowData).forEach(([key, value]) => {
            if (key !== idKey && typeof value === 'number') {
              existing[key] = (existing[key] || 0) + value;
            }
          });
        }
      }
      
      return Array.from(mergedMap.values());
    };

    // Collect ALL progress arrays (parent + all children)
    const allProgressArrays: any[][] = [nodeProgress];
    
    childTrees.forEach(child => {
      if (child.computedProgressArray && child.computedProgressArray.length > 0) {
        allProgressArrays.push(child.computedProgressArray);
      }
    });

    // Merge all progress data
    const computedProgressArray = mergeProgress(allProgressArrays);
    
    // Calculate numeric progress for backward compatibility
    const calculateNumeric = (progressArray: any[]): number => {
      if (!progressArray || progressArray.length === 0) return 0;
      let total = 0, count = 0;
      progressArray.forEach(row => {
        Object.values(row).forEach(value => {
          if (typeof value === 'number') {
            total += value;
            count++;
          }
        });
      });
      return count > 0 ? Math.round((total / count) * 100) / 100 : 0;
    };
    
    const numericProgress = calculateNumeric(computedProgressArray);

    // Transform to table format
    const transformToTable = (progressArray: any[]): TableData => {
      if (!progressArray || progressArray.length === 0) {
        return { identifierKey: '', identifierLabel: '', xAxis: [], yAxis: [], data: [] };
      }

      const firstRow = progressArray[0];
      const idKey = findIdentifierKey(firstRow) || 'identifier';
      
      const xAxis = progressArray.map(item => item[idKey]?.toString() || '');
      
      const columns = new Set<string>();
      progressArray.forEach(row => {
        Object.keys(row).forEach(key => {
          if (key !== idKey) columns.add(key);
        });
      });

      const yAxis = Array.from(columns);
      const data: number[][] = [];
      
      progressArray.forEach(row => {
        const rowData: number[] = [];
        yAxis.forEach(col => {
          rowData.push(Number(row[col]) || 0);
        });
        data.push(rowData);
      });

      return {
        identifierKey: idKey,
        identifierLabel: idKey.charAt(0).toUpperCase() + idKey.slice(1),
        xAxis,
        yAxis,
        data
      };
    };

    const computedProgressTable = transformToTable(computedProgressArray);

    // Parse node's numeric computedProgress from JSON
    const nodeComputedProgress = this.parseJsonToNumber(node.computedProgress);

    return {
      id: node.id,
      taskName: node.taskName,
      slug: node.slug,
      progress: nodeProgress,
      computedProgress: nodeComputedProgress, // Use parsed value
      computedProgressArray,
      computedProgressTable,
      weight: node.weight || 0,
      isLeaf: node.isLeaf || false,
      duration: node.duration,
      startDate: node.startDate,
      finishDate: node.finishDate,
      priority: node.priority,
      actualHour: node.actualHour,
      plannedHour: node.plannedHour,
      plannedCost: node.plannedCost,
      plannedResourceCost: node.plannedResourceCost,
      children: childTrees,
    };
  }

  /**
   * Get full tree structure for a project
   */
  async getProjectTree(projectId: string): Promise<TreeNode[]> {
    const rootNodes = await this.nodeRepo.findRootNodes(projectId);

    const trees = await Promise.all(
      rootNodes.map((node: any) => this.buildTree(node)),
    );

    return trees;
  }

  /**
   * Get tree structure from a specific node
   */
  async getNodeTree(nodeId: string): Promise<TreeNode> {
    const node = await this.infrastructureRepo.findNodeById(nodeId);

    if (!node) {
      throw new Error(`Node with ID ${nodeId} not found`);
    }

    return this.buildTree(node);
  }

  /**
   * Get flat list of all nodes in a project with their hierarchy level
   */
  async getProjectNodesFlat(projectId: string) {
    const nodes = await this.nodeRepo.findAllNodesByProject(projectId);

    // Add level information
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));

    const getLevel = (nodeId: string): number => {
      const node = nodeMap.get(nodeId);
      if (!node || !node.parentId) return 0;
      return 1 + getLevel(node.parentId);
    };

    return nodes.map((node) => ({
      ...node,
      level: getLevel(node.id),
    }));
  }

  /**
   * Update node progress and propagate changes
   */
  async updateNodeProgress(
    nodeId: string,
    progress: any[],
    computedProgress?: number
  ): Promise<void> {
    const updateData: any = {
      progress: progress as any,
    };

    if (computedProgress !== undefined) {
      updateData.computedProgress = computedProgress;
    }

    await this.nodeRepo.updateNode(nodeId, updateData);
    await this.propagateUp(nodeId);
    
    // Update project progress
    const node = await this.infrastructureRepo.findNodeById(nodeId);
    if (node) {
      await this.updateProjectProgress(node.projectId);
    }
  }
}