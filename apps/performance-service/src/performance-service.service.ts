import { Injectable } from '@nestjs/common';
import * as Docker from 'dockerode'; // <-- Modifié ici

export interface PerformanceMetric {
  id: string;
  name: string;
  cpu: number;
  memoryUsage: number;
  memoryLimit: number;
}

@Injectable()
export class PerformanceServiceService {
  // Adapté pour Windows docker avec TCP (exemple)
  private docker = new Docker({ host: 'localhost', port: 2375 });

  async getPerformanceMetrics(): Promise<PerformanceMetric[]> {
    const containers = await this.docker.listContainers();

    const results: PerformanceMetric[] = [];

    for (const c of containers) {
      const container = this.docker.getContainer(c.Id);
      const statsStream = await container.stats({ stream: false });

      const cpuDelta = statsStream.cpu_stats.cpu_usage.total_usage - statsStream.precpu_stats.cpu_usage.total_usage;
      const systemCpuDelta = statsStream.cpu_stats.system_cpu_usage - statsStream.precpu_stats.system_cpu_usage;
      const cpuPercent = systemCpuDelta > 0 ? (cpuDelta / systemCpuDelta) * statsStream.cpu_stats.online_cpus * 100 : 0;

      const memoryUsage = statsStream.memory_stats.usage / 1024 / 1024;
      const memoryLimit = statsStream.memory_stats.limit / 1024 / 1024;

      results.push({
        id: c.Id,
        name: c.Names[0].replace('/', ''),
        cpu: parseFloat(cpuPercent.toFixed(2)),
        memoryUsage: parseFloat(memoryUsage.toFixed(2)),
        memoryLimit: parseFloat(memoryLimit.toFixed(2)),
      });
    }

    return results;
  }
}
