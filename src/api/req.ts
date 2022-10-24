import { get, request, RequestOptions } from 'https';

export const mapcraftApiUrl = (process.env.DEV)
	? 'localhost:3000'
	: 'api.mapcraft.app';

export default class req {
	static get(url: string, options?: RequestOptions): Promise<any> {
		return new Promise((resolve, reject) => {
			get(url, options ?? {}, (res) => {
				let data = '';
				res.on('data', (chunk) => data += chunk);
				res.on('end', () => resolve(data));
			})
				.on('error', (e) => reject(e));
		});
	}

	static post(url: string, data: Record<string, unknown>): Promise<any> {
		const __url = new URL(url);
		const __ret = JSON.stringify(data);
		return new Promise((resolve, reject) => {
			const req = request({
				host: __url.hostname,
				port: __url.port || 443,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': __ret.length
				}
			}, (res) => {
				let ret = '';
				res.on('data', (chunk) => ret += chunk);
				res.on('end', () => resolve(ret));
			});
			req.on('error', (e) => reject(e));
			req.write(__ret);
			req.end();
		});
	}
}
