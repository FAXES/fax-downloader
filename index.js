const fs = require('fs');
const path = require('path');

function resolveDestPath(dest) {
    const baseDir = path.dirname(require.main?.filename || process.cwd());
    return path.join(baseDir, dest);
}

/**
 * Download a file to disk using fetch(), keeping the same "resolve-on-error" behavior.
 * @param {string} url
 * @param {string} dest - relative path (from require.main.filename dir) like before
 * @param {object} options - fetch options (headers, method, signal, etc.)
 * @returns {Promise<{dest?: string, status: number, error?: any}>}
 */
module.exports.getFile = (url, dest, options = {}) =>
  new Promise(async (resolve) => {
    try {
		url = String(url || '').trim();
		if(!url) return resolve({ status: 400, error: 'Invalid URL' });
		const filePath = resolveDestPath(dest);
		fs.mkdirSync(path.dirname(filePath), { recursive: true });
		const timeoutMs = Number(options.timeoutMs ?? 0);
		const userSignal = options.signal;
		let controller;
		let timeout;
		let signal = userSignal;
		if(!userSignal && timeoutMs > 0) {
			controller = new AbortController();
			signal = controller.signal;
			timeout = setTimeout(() => controller.abort(new Error('Request timed out')), timeoutMs);
		}

		const { timeoutMs: _timeoutMs, ...fetchOptions } = options;
		const res = await fetch(url, { ...fetchOptions, signal });
		if(timeout) clearTimeout(timeout);

		if(!res.ok) {
			try {
				if (res.body?.cancel) await res.body.cancel();
			} catch {}
			return resolve({ status: res.status, error: res.status });
		}

		const writeStream = fs.createWriteStream(filePath);
		if(!res.body) {
			writeStream.destroy();
			return resolve({ status: res.status || 500, error: 'No response body' });
		}
		const { Readable } = require('stream');
		const nodeStream = Readable.fromWeb(res.body);
		nodeStream.pipe(writeStream).on('error', (err) => resolve({ status: res.status || 500, error: err })).once('close', () => resolve({ dest, status: res.status }));
    } catch (err) {
        const msg = String(err?.name || '');
        const isAbort =
            err?.name === 'AbortError' ||
            msg.toLowerCase().includes('abort') ||
            String(err?.message || '').toLowerCase().includes('timed out');
        return resolve({ status: isAbort ? 408 : 500, error: err });
    }
});

/**
 * getBuffer: async function that returns the downloaded data (Buffer).
 * (Name is "getBuffer" per request, but it's still async/non-blocking.)
 *
 * @param {string} url
 * @param {object} options - fetch options (headers, method, signal, etc.)
 * @returns {Promise<{status: number, data?: Buffer, error?: any}>}
 */
module.exports.getBuffer = async (url, options = {}) => {
	try {
		url = String(url || '').trim();
		if(!url) return {status: 400, error: 'Invalid URL'};
		const timeoutMs = Number(options.timeoutMs ?? 0);
		const userSignal = options.signal;
		let controller;
		let timeout;
		let signal = userSignal;

		if(!userSignal && timeoutMs > 0) {
			controller = new AbortController();
			signal = controller.signal;
			timeout = setTimeout(() => controller.abort(new Error('Request timed out')), timeoutMs);
		}

		const {timeoutMs: _timeoutMs, ...fetchOptions} = options;
		const res = await fetch(url, { ...fetchOptions, signal });
		if(timeout) clearTimeout(timeout);
		if(!res.ok) {
			try {
				if (res.body?.cancel) await res.body.cancel();
			} catch {}
			return { status: res.status, error: res.status };
		}
		const ab = await res.arrayBuffer();
		return {status: res.status, data: Buffer.from(ab)};
	} catch (err) {
		const msg = String(err?.name || '');
		const isAbort =
		err?.name === 'AbortError' ||
		msg.toLowerCase().includes('abort') ||
		String(err?.message || '').toLowerCase().includes('timed out');
		return { status: isAbort ? 408 : 500, error: err };
	}
};