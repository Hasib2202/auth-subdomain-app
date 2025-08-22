// server/src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
    @Get()
    getHealth(): { status: string; timestamp: string } {
        return {
            status: 'OK',
            timestamp: new Date().toISOString(),
        };
    }

    @Get('health')
    getHealthCheck(): { status: string; service: string; timestamp: string } {
        return {
            status: 'healthy',
            service: 'auth-server',
            timestamp: new Date().toISOString(),
        };
    }
}
