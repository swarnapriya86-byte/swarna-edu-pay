import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const adminEmail = (env.ADMIN_EMAIL || env.VITE_ADMIN_EMAIL || 'swarnapriyaegala@gmail.com').toLowerCase();
  const adminPassword = env.DEMO_ADMIN_PASSWORD || env.ADMIN_PASSWORD || 'pandu_143';
  const adminName = env.ADMIN_NAME || 'Swarnapriya Egala';

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'vite-admin-auth-middleware',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/api/auth/verify-admin' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', () => {
                try {
                  const { email, password } = JSON.parse(body || '{}');
                  const inputUser = (email || '').trim().toLowerCase();
                  const effectiveEmail = inputUser.includes('@') ? inputUser : `${inputUser}@gmail.com`;

                  if (!effectiveEmail || effectiveEmail !== adminEmail) {
                    res.statusCode = 403;
                    res.setHeader('Content-Type', 'application/json');
                    return res.end(JSON.stringify({ 
                      success: false, 
                      error: 'Access Denied: This account is not authorized for administrator access. Only swarnapriyaegala@gmail.com is permitted.' 
                    }));
                  }

                  if (!password) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    return res.end(JSON.stringify({ success: false, error: 'Administrator password is required.' }));
                  }

                  if (password === adminPassword) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.end(JSON.stringify({
                      success: true,
                      profile: {
                        id: 'user-admin-1',
                        full_name: adminName,
                        email: adminEmail,
                        role: 'admin'
                      }
                    }));
                  }

                  res.statusCode = 401;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ success: false, error: 'Incorrect administrator password. Access denied.' }));
                } catch (err: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ success: false, error: err?.message || 'Internal server error' }));
                }
              });
              return;
            }

            if (req.url === '/api/auth/verify-admin-session' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', () => {
                try {
                  const { email } = JSON.parse(body || '{}');
                  const inputUser = (email || '').trim().toLowerCase();
                  const effectiveEmail = inputUser.includes('@') ? inputUser : `${inputUser}@gmail.com`;

                  if (!effectiveEmail || effectiveEmail !== adminEmail) {
                    res.statusCode = 403;
                    res.setHeader('Content-Type', 'application/json');
                    return res.end(JSON.stringify({ authorized: false, error: 'Unauthorized administrator email.' }));
                  }

                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ authorized: true, email: adminEmail, role: 'admin' }));
                } catch (err: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ authorized: false, error: err?.message || 'Internal server error' }));
                }
              });
              return;
            }

            next();
          });
        }
      }
    ],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  };
});
