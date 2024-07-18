import * as k8s from '@kubernetes/client-node';
import {PostgreSQLDeploymentConfig, k8sCoreApi, k8sAppsApi} from "@cloud-wave/common";



export async function createPostgreSQLDeploymentAndServiceWithIngress(config: PostgreSQLDeploymentConfig) {
    const pvcManifest: k8s.V1PersistentVolumeClaim = {
        apiVersion: 'v1',
        kind: 'PersistentVolumeClaim',
        metadata: { name: config.pvcName },
        spec: {
            accessModes: ['ReadWriteOnce'],
            resources: { requests: { storage: config.storageSize } },
        },
    };

    const deploymentManifest: k8s.V1Deployment = {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: { name: config.deploymentName },
        spec: {
            replicas: 1,
            selector: { matchLabels: { app: config.deploymentName } },
            template: {
                metadata: { labels: { app: config.deploymentName } },
                spec: {
                    containers: [{
                        name: config.deploymentName,
                        image: 'postgres:latest',
                        ports: [{ containerPort: 5432 }],
                        env: [{
                            name: 'POSTGRES_PASSWORD',
                            value: config.rootPassword
                        }, {
                            name: 'POSTGRES_DB',
                            value: config.databaseName
                        }, {
                            name: 'POSTGRES_USER',
                            value: config.userName
                        }, {
                            name: 'POSTGRES_PASSWORD',
                            value: config.userPassword
                        }],
                        resources: {
                            requests: { memory: config.memoryRequest, cpu: config.cpuRequest },
                            limits: { memory: config.memoryLimit, cpu: config.cpuLimit }
                        },
                        volumeMounts: [{ mountPath: '/var/lib/postgresql/data', name: 'postgres-storage' }]
                    }],
                    volumes: [{
                        name: 'postgres-storage',
                        persistentVolumeClaim: { claimName: config.pvcName }
                    }]
                }
            }
        }
    };

    const serviceManifest: k8s.V1Service = {
        apiVersion: 'v1',
        kind: 'Service',
        metadata: { name: config.serviceName },
        spec: {
            selector: { app: config.deploymentName },
            ports: [{ protocol: 'TCP', port: 5432, targetPort: 5432 }],
            type: 'NodePort'
        }
    };

    try {
        await k8sCoreApi.createNamespacedPersistentVolumeClaim(config.namespace, pvcManifest);
        console.log('Persistent Volume Claim created:', config.pvcName);

        await k8sAppsApi.createNamespacedDeployment(config.namespace, deploymentManifest);
        console.log('Deployment created:', config.deploymentName);

        await k8sCoreApi.createNamespacedService(config.namespace, serviceManifest);
        console.log('Service created:', config.serviceName);
    } catch (err) {
        console.error('Error creating PVC, deployment, service, or ingress:', err);
    }
}