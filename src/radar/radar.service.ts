import { EnemyTypes, PostScanRequest, Protocols, Scan, ScanResponse } from './radar.interface';

export class RadarService {
	constructor() { }
    
	public scan(data:PostScanRequest): ScanResponse {
		if(data.scan.length < 1) {
			throw new Error('No targets provided');
		}

		if(data.protocols.length < 1) {
			return data.scan[0].coordinates;
		}

		if(!this.checkProtocols(data.protocols)) {
			throw new Error('Invalid protocols');
		}		

		let orderedPoints:Scan[] = this.filterRestrictedPoints(data.scan, data.protocols);
		if(orderedPoints.length < 1) {
			throw new Error('No targets found');
		}
		if(data.protocols.includes(Protocols.CLOSEST_ENEMIES) || data.protocols.includes(Protocols.FURTHEST_ENEMIES)) {
			orderedPoints = this.orderByDistance(orderedPoints, data.protocols.includes(Protocols.CLOSEST_ENEMIES));
		}

		if(data.protocols.includes(Protocols.ASSIST_ALLIES) && data.protocols.includes(Protocols.PRIORITIZE_MECH)) {
			const next = orderedPoints.find((point:Scan) => point.enemies.type === EnemyTypes.MECH && point.allies && point.allies > 0);
			if(next){
				return next.coordinates;
			}
		}

		if(data.protocols.includes(Protocols.ASSIST_ALLIES)){
			const next = orderedPoints.find((point:Scan) => point.allies && point.allies > 0);
			if(next){
				return next.coordinates;
			}
		}

		if(data.protocols.includes(Protocols.PRIORITIZE_MECH)){
			const next = orderedPoints.find((point:Scan) => point.enemies.type === EnemyTypes.MECH);
			if(next){
				return next.coordinates;
			}
		}
		return orderedPoints[0].coordinates;
	}

	checkProtocols(protocols:Protocols[]): boolean {
		if((protocols.includes(Protocols.CLOSEST_ENEMIES) && protocols.includes(Protocols.FURTHEST_ENEMIES)) ||
        (protocols.includes(Protocols.AVOID_MECH) && protocols.includes(Protocols.PRIORITIZE_MECH)) ||
        (protocols.includes(Protocols.AVOID_CROSSFIRE) && protocols.includes(Protocols.ASSIST_ALLIES))
		) {
			return false;
		}

		return true;
	}

	filterRestrictedPoints(points:Scan[], protocols:Protocols[]): Scan[] {
		return points.filter((point:Scan) => this.distanceFromOrigin(point) <= 100 && point.enemies.number > 0)
			.filter((point:Scan) => {
				if((protocols.includes(Protocols.AVOID_CROSSFIRE) && point.allies && point?.allies > 0  ) ||
                (protocols.includes(Protocols.AVOID_MECH) && point.enemies.type === EnemyTypes.MECH)) {
					return false;
				}
				return true;
			});
	}

	orderByDistance(points:Scan[], nearFirst:boolean): Scan[] {
		return points.sort((a:Scan, b:Scan) => {
			if(nearFirst){
				return this.distanceFromOrigin(a) - this.distanceFromOrigin(b);
			}else{
				return this.distanceFromOrigin(b) - this.distanceFromOrigin(a);
			}
		});
	}

	distanceFromOrigin(point:Scan): number {
		return Math.sqrt(Math.pow((point.coordinates.x), 2) + Math.pow((point.coordinates.y), 2));
	}
}