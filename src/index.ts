import { app } from './server';

const server = app.listen(8888, () => console.log('Listen on port 8888'));
export { app, server };