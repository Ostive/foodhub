import { Injectable } from '@nestjs/common';
import * as Docker from 'dockerode';

export interface PerformanceMetric {
  id: string;
  name: string;
  cpu: number;            // en pourcentage
  memoryUsageMB: number;  // en MB
  memoryLimitMB: number;  // en MB
  memoryPercent: number;  // en pourcentage
  netRxBytes: number;     // total RX bytes sur les interfaces réseau
  netTxBytes: number;     // total TX bytes
  blockReadBytes: number; // octets lus disque
  blockWriteBytes: number;// octets écrits disque
  pidsCurrent: number;    // nombre de processus
}

type DockerNetworkStats = {
  rx_bytes?: number;
  tx_bytes?: number;
  [key: string]: any;
};

@Injectable()
export class PerformanceServiceService {
  private docker = new Docker({ socketPath: '//./pipe/docker_engine' });

  async getPerformanceMetrics(): Promise<PerformanceMetric[]> {
    try {
      await this.docker.ping();

      const containers = await this.docker.listContainers();
      const results: PerformanceMetric[] = [];

      const metrics = await Promise.allSettled(
        containers.map(async (c) => {
          const container = this.docker.getContainer(c.Id);
          const statsStream = await container.stats({ stream: false });

          // CPU calculation
          const cpuDelta = (statsStream.cpu_stats?.cpu_usage?.total_usage ?? 0)
            - (statsStream.precpu_stats?.cpu_usage?.total_usage ?? 0);
          const systemCpuDelta = (statsStream.cpu_stats?.system_cpu_usage ?? 0)
            - (statsStream.precpu_stats?.system_cpu_usage ?? 0);
          const onlineCpus = statsStream.cpu_stats?.online_cpus ?? 1;

          const cpuPercent = systemCpuDelta > 0
            ? (cpuDelta / systemCpuDelta) * onlineCpus * 100
            : 0;

          // Memory
          const memoryUsage = statsStream.memory_stats?.usage ?? 0;
          const memoryLimit = statsStream.memory_stats?.limit ?? 1;
          const memoryPercent = memoryLimit > 0 ? (memoryUsage / memoryLimit) * 100 : 0;

          // Network I/O (sum over all interfaces)
          let netRx = 0;
          let netTx = 0;
          if (statsStream.networks) {
            const networks = statsStream.networks as Record<string, DockerNetworkStats>;
            netRx = Object.values(networks).reduce((acc, n) => acc + (n.rx_bytes ?? 0), 0);
            netTx = Object.values(networks).reduce((acc, n) => acc + (n.tx_bytes ?? 0), 0);
          }

          // Block I/O (sum read/write) — gestion plus complète
          let blockRead = 0;
          let blockWrite = 0;
          const blkio = statsStream.blkio_stats;
          
          if (blkio) {
            if (Array.isArray(blkio.io_service_bytes_recursive) && blkio.io_service_bytes_recursive.length > 0) {
              for (const entry of blkio.io_service_bytes_recursive) {
                  if (entry.op.toLowerCase() === 'read') blockRead += entry.value ?? 0;
                  else if (entry.op.toLowerCase() === 'write') blockWrite += entry.value ?? 0;
                }
            } else if (Array.isArray(blkio.io_service_bytes) && blkio.io_service_bytes.length > 0) {
              // fallback si io_service_bytes_recursive absent ou vide
              for (const entry of blkio.io_service_bytes) {
                if (entry.op === 'Read') blockRead += entry.value ?? 0;
                else if (entry.op === 'Write') blockWrite += entry.value ?? 0;
              }
            } else {
              // Debug: afficher contenu blkio_stats si rien n'est trouvé
              console.debug('blkio_stats:', JSON.stringify(blkio, null, 2));
            }
          }

          // Number of PIDs
          const pidsCurrent = statsStream.pids_stats?.current ?? 0;

          return {
            id: c.Id,
            name: c.Names[0]?.replace('/', '') ?? 'unknown',
            cpu: parseFloat(cpuPercent.toFixed(2)),
            memoryUsageMB: parseFloat((memoryUsage / 1024 / 1024).toFixed(2)),
            memoryLimitMB: parseFloat((memoryLimit / 1024 / 1024).toFixed(2)),
            memoryPercent: parseFloat(memoryPercent.toFixed(2)),
            netRxBytes: netRx,
            netTxBytes: netTx,
            blockReadBytes: blockRead,
            blockWriteBytes: blockWrite,
            pidsCurrent,
          };
        })
      );

      for (const result of metrics) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.warn('Failed to retrieve container stats:', result.reason);
        }
      }

      return results;
    } catch (err) {
      console.error('Error in getPerformanceMetrics:', err.stack || err.message || err);
      throw new Error('Unable to retrieve performance metrics');
      
    }
  }
}

