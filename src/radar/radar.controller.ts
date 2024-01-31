import { Request, Response } from 'express';
import { RadarService } from './radar.service';

const getNextPoint = async (req: Request, res: Response) => {
	try {
		const radarService = new RadarService();
		const nextPoint = radarService.scan(req.body);
		res.status(200);
		res.send({x: nextPoint.x, y: nextPoint.y});
	} catch (e: any) {
		res.status(400);
		res.send(e.message);
	}
};

export { getNextPoint};