import { Controller, Get, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Health')
@Controller('api/health')
export class HealthController {
    @Get()
    @ApiOperation({ summary: 'Obtém a saúde do sistema' })
    health(@Res() res: Response): any {
        const healthcheck: any = {
            uptime: process.uptime(),
            status: 'Online',
            timestamp: Date.now()
        };

        try {
            res.set('Cache-Control', 'no-cache').send(healthcheck);
        } catch (error) {
            healthcheck.status = error;
            res.status(503).send();
        }
    }
}
