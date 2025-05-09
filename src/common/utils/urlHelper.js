export function withServerUrl(path) {
    const isDev = import.meta.env.DEV; // True khi đang run `npm run dev`
    const serverPrefix = 'http://localhost:8080';
    
    if (isDev) {
      return serverPrefix + path;
    } else {
      return path; // Production thì giữ nguyên
    }
  }
  