import { EnemyTypes, PostScanRequest, Protocols } from './radar.interface';
import { RadarService } from './radar.service';

let radarService: RadarService;

beforeAll( () => {
	radarService = new RadarService();
});

describe('RadarService: scan', () => {

	describe('single protocols', () => {
		it('closest-enemies: should return the closest enemy',  () => {
			const data:PostScanRequest = {
				protocols: [Protocols.CLOSEST_ENEMIES],
				scan: [{
					coordinates: {
						x: 10,
						y: 10
					},
					enemies: {
						type: EnemyTypes.SOLDIER,
						number: 1
					}
				},
				{
					coordinates: {
						x: 40,
						y: 40
					},
					enemies: {
						type: EnemyTypes.SOLDIER,
						number: 1
					}
				}]
			};
			const point = radarService.scan(data);
			expect(point.x).toBe(10);
			expect(point.y).toBe(10);
		});
		it('furthest-enemies: should return the furthest enemy', () => {
			const data:PostScanRequest = {
				protocols: [Protocols.FURTHEST_ENEMIES],
				scan: [{
					coordinates: {
						x: 10,
						y: 10
					},
					enemies: {
						type: EnemyTypes.SOLDIER,
						number: 1
					}
				},
				{
					coordinates: {
						x: 40,
						y: 40
					},
					enemies: {
						type: EnemyTypes.SOLDIER,
						number: 1
					}
				}]
			};
			const point = radarService.scan(data);
			expect(point.x).toBe(40);
			expect(point.y).toBe(40);
		});
		it('furthest-enemies: should return the furthest enemy under 100m', () => {
			const data:PostScanRequest = {
				protocols: [Protocols.FURTHEST_ENEMIES],
				scan: [{
					coordinates: {
						x: 20,
						y: 20
					},
					enemies: {
						type: EnemyTypes.SOLDIER,
						number: 1
					}
				},
				{
					coordinates: {
						x: 100,
						y: 100
					},
					enemies: {
						type: EnemyTypes.SOLDIER,
						number: 1
					}
				}]
			};
			const point = radarService.scan(data);
			expect(point.x).toBe(20);
			expect(point.y).toBe(20);
		});
		it('assist-allies: should return a point with some allies', () => {
			const data:PostScanRequest = {
				protocols: [Protocols.ASSIST_ALLIES],
				scan: [{
					coordinates: {
						x: 10,
						y: 10
					},
					enemies: {
						type: EnemyTypes.SOLDIER,
						number: 1
					}
				},
				{
					coordinates: {
						x: 30,
						y: 30
					},
					enemies: {
						type: EnemyTypes.SOLDIER,
						number: 1
					},
					allies: 1
				}]
			};
			const point = radarService.scan(data);
			expect(point.x).toBe(30);
			expect(point.y).toBe(30);
		});
		it('avoid-crossfire: should return some point with no allies', () => {
			const data:PostScanRequest = {
				protocols: [Protocols.AVOID_CROSSFIRE],
				scan: [{
					coordinates: {
						x: 10,
						y: 10
					},
					enemies: {
						type: EnemyTypes.SOLDIER,
						number: 1
					}
				},
				{
					coordinates: {
						x: 40,
						y: 40
					},
					enemies: {
						type: EnemyTypes.SOLDIER,
						number: 1
					},
					allies: 1
				}]
			};
			const point = radarService.scan(data);
			expect(point.x).toBe(10);
			expect(point.y).toBe(10);
		});
		it('avoid-crossfire: should not return any point if all points have allies', () => {
			const data:PostScanRequest = {
				protocols: [Protocols.AVOID_CROSSFIRE],
				scan: [{
					coordinates: {
						x: 10,
						y: 10
					},
					enemies: {
						type: EnemyTypes.SOLDIER,
						number: 1
					},
					allies: 1
				},
				{
					coordinates: {
						x: 40,
						y: 40
					},
					enemies: {
						type: EnemyTypes.SOLDIER,
						number: 1
					},
					allies: 1
				}]
			};
			expect(() => radarService.scan(data)).toThrow();
		});
		it('prioritize-mech: should return a point with a mech',  () => {
			const data:PostScanRequest = {
				protocols: [Protocols.PRIORITIZE_MECH],
				scan: [{
					coordinates: {
						x: 10,
						y: 10
					},
					enemies: {
						type: EnemyTypes.SOLDIER,
						number: 1
					}
				},
				{
					coordinates: {
						x: 40,
						y: 40
					},
					enemies: {
						type: EnemyTypes.MECH,
						number: 1
					},
					allies: 1
				}]
			};
			const point = radarService.scan(data);
			expect(point.x).toBe(40);
			expect(point.y).toBe(40);
		});
		it('prioritize-mech: should return the first point if no exists any mech',  () => {
			const data:PostScanRequest = {
				protocols: [Protocols.PRIORITIZE_MECH],
				scan: [{
					coordinates: {
						x: 10,
						y: 10
					},
					enemies: {
						type: EnemyTypes.SOLDIER,
						number: 1
					}
				},
				{
					coordinates: {
						x: 40,
						y: 40
					},
					enemies: {
						type: EnemyTypes.SOLDIER,
						number: 1
					},
					allies: 1
				}]
			};
			const point = radarService.scan(data);
			expect(point.x).toBe(10);
			expect(point.y).toBe(10);
		});
		it('avoid-mech: should return a point without a mech',  () => {
			const data:PostScanRequest = {
				protocols: [Protocols.AVOID_MECH],
				scan: [{
					coordinates: {
						x: 10,
						y: 10
					},
					enemies: {
						type: EnemyTypes.SOLDIER,
						number: 1
					}
				},
				{
					coordinates: {
						x: 40,
						y: 40
					},
					enemies: {
						type: EnemyTypes.MECH,
						number: 1
					},
					allies: 1
				}]
			};
			const point = radarService.scan(data);
			expect(point.x).toBe(10);
			expect(point.y).toBe(10);
		});
		it('avoid-mech: should not return any point if all points have a mech',  () => {
			const data:PostScanRequest = {
				protocols: [Protocols.AVOID_MECH],
				scan: [{
					coordinates: {
						x: 10,
						y: 10
					},
					enemies: {
						type: EnemyTypes.MECH,
						number: 1
					}
				},
				{
					coordinates: {
						x: 40,
						y: 40
					},
					enemies: {
						type: EnemyTypes.MECH,
						number: 1
					},
					allies: 1
				}]
			};
			expect(() => radarService.scan(data)).toThrow();
		});
	});

	describe('multiple protocols', () => { 
		describe('incompatible protocols', () => {
			it('should return an error with closest-enemies and furthest-enemies', () => {
				const data:PostScanRequest = {
					protocols: [Protocols.CLOSEST_ENEMIES, Protocols.FURTHEST_ENEMIES],
					scan: [{
						coordinates: {
							x: 10,
							y: 10
						},
						enemies: {
							type: EnemyTypes.MECH,
							number: 1
						}
					},
					{
						coordinates: {
							x: 40,
							y: 40
						},
						enemies: {
							type: EnemyTypes.MECH,
							number: 1
						},
						allies: 1
					}]
				};
				expect(() => radarService.scan(data)).toThrow();
			});
			it('should return an error with avoid-mech and prioritize-mech', () => {
				const data:PostScanRequest = {
					protocols: [Protocols.AVOID_MECH, Protocols.PRIORITIZE_MECH],
					scan: [{
						coordinates: {
							x: 10,
							y: 10
						},
						enemies: {
							type: EnemyTypes.SOLDIER,
							number: 1
						}
					},
					{
						coordinates: {
							x: 40,
							y: 40
						},
						enemies: {
							type: EnemyTypes.MECH,
							number: 1
						},
						allies: 1
					}]
				};
				expect(() => radarService.scan(data)).toThrow();
			});
			it('should return an error with avoid-crossfire and assist-allies', () => {
				const data:PostScanRequest = {
					protocols: [Protocols.AVOID_CROSSFIRE, Protocols.ASSIST_ALLIES],
					scan: [{
						coordinates: {
							x: 10,
							y: 10
						},
						enemies: {
							type: EnemyTypes.MECH,
							number: 1
						}
					},
					{
						coordinates: {
							x: 40,
							y: 40
						},
						enemies: {
							type: EnemyTypes.MECH,
							number: 1
						},
						allies: 1
					}]
				};
				expect(() => radarService.scan(data)).toThrow();
			});
		});

		describe('compatible protocols', () => {
			describe('closest-enemies and assist-allies', () => {
				it('should return the closest point with allies', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.CLOSEST_ENEMIES, Protocols.ASSIST_ALLIES],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
							allies: 1
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
							allies: 1
						}]
					};
					const point = radarService.scan(data);
					expect(point.x).toBe(20);
					expect(point.y).toBe(20);
				});
				it('should return the closest point without allies if not exist', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.CLOSEST_ENEMIES, Protocols.ASSIST_ALLIES],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						}]
					};
					const point = radarService.scan(data);
					expect(point.x).toBe(10);
					expect(point.y).toBe(10);
				});
			});
			describe('closest-enemies and avoid-crossfire', () => {
				it('should return the closest point without allies', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.CLOSEST_ENEMIES, Protocols.AVOID_CROSSFIRE],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
							allies: 1
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
							allies: 1
						}]
					};
					const point = radarService.scan(data);
					expect(point.x).toBe(20);
					expect(point.y).toBe(20);
				});
				it('should not return any point if all points have allies', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.CLOSEST_ENEMIES, Protocols.AVOID_CROSSFIRE],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
							allies: 1
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
							allies: 1
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
							allies: 1
						}]
					};
					expect(() => radarService.scan(data)).toThrow();
				});
			});
			describe('closest-enemies and prioritize-mech', () => {
				it('should return the closest point with a mech', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.CLOSEST_ENEMIES, Protocols.PRIORITIZE_MECH],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						}]
					};
					const point = radarService.scan(data);
					expect(point.x).toBe(20);
					expect(point.y).toBe(20);
				});
				it('should return the closest point without a mech if not exist', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.CLOSEST_ENEMIES, Protocols.PRIORITIZE_MECH],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						}]
					};
					const point = radarService.scan(data);
					expect(point.x).toBe(10);
					expect(point.y).toBe(10);
				});
			});
			describe('closest-enemies and avoid-mech', () => {
				it('should return the closest point without a mech', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.CLOSEST_ENEMIES, Protocols.AVOID_MECH],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						}]
					};
					const point = radarService.scan(data);
					expect(point.x).toBe(20);
					expect(point.y).toBe(20);
				});
				it('should not return any point if all points have mechs', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.CLOSEST_ENEMIES, Protocols.AVOID_MECH],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						}]
					};
					expect(() => radarService.scan(data)).toThrow();
				});
			});
			describe('furthest-enemies and assist-allies', () => {
				it('should return the furthest point with allies', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.FURTHEST_ENEMIES, Protocols.ASSIST_ALLIES],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
							allies: 1
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						}]
					};
					const point = radarService.scan(data);
					expect(point.x).toBe(20);
					expect(point.y).toBe(20);
				});
				it('should return the furthest point without allies if not exist', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.FURTHEST_ENEMIES, Protocols.ASSIST_ALLIES],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						}]
					};
					const point = radarService.scan(data);
					expect(point.x).toBe(40);
					expect(point.y).toBe(40);
				});
			});
			describe('furthest-enemies and avoid-crossfire', () => {
				it('should return the furthest point without allies', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.FURTHEST_ENEMIES, Protocols.AVOID_CROSSFIRE],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
							allies: 1
						}]
					};
					const point = radarService.scan(data);
					expect(point.x).toBe(20);
					expect(point.y).toBe(20);
				});
				it('should not return any point if all points have allies', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.FURTHEST_ENEMIES, Protocols.AVOID_CROSSFIRE],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
							allies: 1
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
							allies: 1
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
							allies: 1
						}]
					};
					expect(() => radarService.scan(data)).toThrow();	
				});
			});
			describe('furthest-enemies and prioritize-mech', () => {
				it('should return the furthest point with a mech', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.FURTHEST_ENEMIES, Protocols.PRIORITIZE_MECH],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						}]
					};
					const point = radarService.scan(data);
					expect(point.x).toBe(20);
					expect(point.y).toBe(20);
				});
				it('should return the furthest point without a mech if not exist', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.FURTHEST_ENEMIES, Protocols.PRIORITIZE_MECH],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
							allies: 1
						}]
					};
					const point = radarService.scan(data);
					expect(point.x).toBe(40);
					expect(point.y).toBe(40);
				});
			});
			describe('furthest-enemies and avoid-mech', () => {
				it('should return the furthest point without a mech', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.FURTHEST_ENEMIES, Protocols.AVOID_MECH],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
							allies: 1
						}]
					};
					const point = radarService.scan(data);
					expect(point.x).toBe(20);
					expect(point.y).toBe(20);
				});
				it('should not return any point if all points have mechs', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.FURTHEST_ENEMIES, Protocols.AVOID_MECH],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
							allies: 1
						}]
					};
					expect(() => radarService.scan(data)).toThrow();
				});
			});
			describe('assist-allies and prioritize-mech', () => {
				it('should return a point with allies and mechs', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.ASSIST_ALLIES, Protocols.PRIORITIZE_MECH],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
							allies: 1
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
							allies: 1
						}]
					};
					const point = radarService.scan(data);
					expect(point.x).toBe(20);
					expect(point.y).toBe(20);
				});
				it('should return a point with allies and without a mech if not exist mechs', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.ASSIST_ALLIES, Protocols.PRIORITIZE_MECH],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
							allies: 1
						}]
					};
					const point = radarService.scan(data);
					expect(point.x).toBe(40);
					expect(point.y).toBe(40);
				});
				it('should return a point without allies and with a mech if not exist allies', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.ASSIST_ALLIES, Protocols.PRIORITIZE_MECH],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						}]
					};
					const point = radarService.scan(data);
					expect(point.x).toBe(20);
					expect(point.y).toBe(20);
				});
				it('should return the first point without allies and without a mech if not exist allies and mechs', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.ASSIST_ALLIES, Protocols.PRIORITIZE_MECH],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						}]
					};
					const point = radarService.scan(data);
					expect(point.x).toBe(10);
					expect(point.y).toBe(10);
				});
			});
			describe('assist-allies and avoid-mech', () => {
				it('should return a point with allies and without a mech', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.ASSIST_ALLIES, Protocols.AVOID_MECH],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
							allies: 1
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
							allies: 1
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						}]
					};
					const point = radarService.scan(data);
					expect(point.x).toBe(20);
					expect(point.y).toBe(20);
				});
				it('should return a point without allies and without a mech if not exist allies', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.ASSIST_ALLIES, Protocols.AVOID_MECH],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
							allies: 1
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						}]
					};
					const point = radarService.scan(data);
					expect(point.x).toBe(10);
					expect(point.y).toBe(10);
				});
				it('should not return any point if all points have mechs', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.ASSIST_ALLIES, Protocols.AVOID_MECH],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
							allies: 1
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						}]
					};
					expect(() => radarService.scan(data)).toThrow();
				});
			});
			describe('avoid-crossfire and prioritize-mech', () => {
				it('should return a point without allies and with a mech', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.AVOID_CROSSFIRE, Protocols.PRIORITIZE_MECH],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
							allies: 1
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						}]
					};
					const point = radarService.scan(data);
					expect(point.x).toBe(40);
					expect(point.y).toBe(40);
				});
				it('should return a point without allies and without a mech if not exist mechs', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.AVOID_CROSSFIRE, Protocols.PRIORITIZE_MECH],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
							allies: 1
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
							allies: 1
						}]
					};
					const point = radarService.scan(data);
					expect(point.x).toBe(20);
					expect(point.y).toBe(20);
				});
				it('should not return a point if all points have allies', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.AVOID_CROSSFIRE, Protocols.PRIORITIZE_MECH],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
							allies: 1
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
							allies: 1
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
							allies: 1
						}]
					};
					expect(() => radarService.scan(data)).toThrow();
				});
			});
			describe('avoid-crossfire and avoid-mech', () => {
				it('should return a point without allies and without a mech', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.AVOID_CROSSFIRE, Protocols.AVOID_MECH],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
							allies: 1
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
						}]
					};
					const point = radarService.scan(data);
					expect(point.x).toBe(40);
					expect(point.y).toBe(40);
				});
				it('should not return a point if all points have allies', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.AVOID_CROSSFIRE, Protocols.AVOID_MECH],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
							allies: 1
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
							allies: 1
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.SOLDIER,
								number: 1
							},
							allies: 1
						}]
					};
					expect(() => radarService.scan(data)).toThrow();
				});
				it('should not return a point if all points have mechs', () => {
					const data:PostScanRequest = {
						protocols: [Protocols.AVOID_CROSSFIRE, Protocols.AVOID_MECH],
						scan: [{
							coordinates: {
								x: 10,
								y: 10
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						},
						{
							coordinates: {
								x: 20,
								y: 20
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						},{
							coordinates: {
								x: 40,
								y: 40
							},
							enemies: {
								type: EnemyTypes.MECH,
								number: 1
							},
						}]
					};
					expect(() => radarService.scan(data)).toThrow();
				});
			});
		});
	});

	describe('no protocols', () => {
		it('should return the first point',  () => {
			const data:PostScanRequest = {
				protocols: [],
				scan: [{
					coordinates: {
						x: 10,
						y: 10
					},
					enemies: {
						type: EnemyTypes.SOLDIER,
						number: 1
					}
				},
				{
					coordinates: {
						x: 40,
						y: 40
					},
					enemies: {
						type: EnemyTypes.MECH,
						number: 1
					},
					allies: 1
				}]
			};
			const point = radarService.scan(data);
			expect(point.x).toBe(10);
			expect(point.y).toBe(10);
		});
	});

	describe('wrong data', () => {
		it('should return an error if the enemies are empty', () => {
			const data:any = {
				protocols: [],
				scan: []
			};
			expect(() => radarService.scan(data)).toThrow();
		});

	});
});